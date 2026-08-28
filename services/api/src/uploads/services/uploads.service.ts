import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import type { Env } from '../../config/env.validation';
import { detectImageMime } from '../detect-image-type';

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;
const IMAGE_KEY_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/;

export interface SavedImage {
  key: string;
  contentType: string;
}

export interface ReadImage {
  buffer: Buffer;
  contentType: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir: string;

  constructor(config: ConfigService<Env, true>) {
    this.uploadsDir = resolve(
      process.cwd(),
      config.get('UPLOADS_DIR', { infer: true }),
    );
  }

  async saveImage(buffer: Buffer): Promise<SavedImage> {
    const detectedMime = detectImageMime(buffer);

    if (!detectedMime) {
      throw new BadRequestException('File must be a JPEG, PNG, or WebP image.');
    }

    const compressed = await sharp(buffer)
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const key = `${randomUUID()}.webp`;
    await mkdir(this.uploadsDir, { recursive: true });
    await writeFile(join(this.uploadsDir, key), compressed);

    return { key, contentType: 'image/webp' };
  }

  async deleteImage(key: string): Promise<void> {
    if (!IMAGE_KEY_PATTERN.test(key)) {
      return;
    }

    await rm(join(this.uploadsDir, key), { force: true });
  }

  async readImage(key: string): Promise<ReadImage> {
    if (!IMAGE_KEY_PATTERN.test(key)) {
      throw new BadRequestException('Invalid image id.');
    }

    try {
      const buffer = await readFile(join(this.uploadsDir, key));
      return { buffer, contentType: 'image/webp' };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException('Image not found.');
      }
      throw error;
    }
  }
}
