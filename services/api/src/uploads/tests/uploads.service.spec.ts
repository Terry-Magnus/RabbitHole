import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import type { Env } from '../../config/env.validation';
import { UploadsService } from '../services/uploads.service';

const TEST_UPLOADS_DIR = 'test-uploads-tmp';

function makeConfigService(): ConfigService<Env, true> {
  return {
    get: () => TEST_UPLOADS_DIR,
  } as unknown as ConfigService<Env, true>;
}

describe('UploadsService', () => {
  const resolvedTestDir = join(process.cwd(), TEST_UPLOADS_DIR);
  let service: UploadsService;

  beforeEach(() => {
    service = new UploadsService(makeConfigService());
  });

  afterAll(async () => {
    await rm(resolvedTestDir, { recursive: true, force: true });
  });

  it('compresses and normalizes a valid image to webp, capped at 1600px', async () => {
    const pngBuffer = await sharp({
      create: {
        width: 2000,
        height: 1000,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const saved = await service.saveImage(pngBuffer);

    expect(saved.key).toMatch(/^[0-9a-f-]{36}\.webp$/);
    expect(saved.contentType).toBe('image/webp');

    const written = await readFile(join(resolvedTestDir, saved.key));
    const metadata = await sharp(written).metadata();
    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBeLessThanOrEqual(1600);
  });

  it('rejects a file whose real bytes are not an image, regardless of claimed type', async () => {
    const textBuffer = Buffer.from('not actually an image, just text');

    await expect(service.saveImage(textBuffer)).rejects.toThrow();
  });

  it('rejects reading a path-traversal-style key', async () => {
    await expect(service.readImage('../../etc/passwd')).rejects.toThrow();
  });

  it('rejects reading a key that does not match the generated-id format', async () => {
    await expect(service.readImage('not-a-valid-key.png')).rejects.toThrow();
  });

  it('silently ignores deleting a malformed key rather than touching the filesystem', async () => {
    await expect(
      service.deleteImage('../../etc/passwd'),
    ).resolves.toBeUndefined();
  });
});
