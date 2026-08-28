import { BadRequestException, NotFoundException } from '@nestjs/common';

export class JourneyNodeNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Journey node with id "${id}" was not found.`);
  }
}

export class InvalidNodeReorderException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

export class SourceNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Source with id "${id}" was not found.`);
  }
}
