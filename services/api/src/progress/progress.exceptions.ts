import { BadRequestException } from '@nestjs/common';

export class InvalidProgressPositionException extends BadRequestException {
  constructor(nodePosition: number, totalNodes: number) {
    super(
      `Node position ${nodePosition} is out of range for a journey with ${totalNodes} node(s).`,
    );
  }
}
