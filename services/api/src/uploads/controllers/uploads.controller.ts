import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UploadsService } from '../services/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, contentType } = await this.uploadsService.readImage(id);
    res.setHeader('Content-Type', contentType);
    res.send(buffer);
  }
}
