import {
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { JourneyNode } from '@prisma/client';
import { NodesService } from '../services/nodes.service';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('nodes/:nodeId/image')
export class NodeImageController {
  constructor(private readonly nodesService: NodesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('nodeId') nodeId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<JourneyNode> {
    return this.nodesService.uploadImage(nodeId, file.buffer);
  }

  @Delete()
  removeImage(@Param('nodeId') nodeId: string): Promise<JourneyNode> {
    return this.nodesService.removeImage(nodeId);
  }
}
