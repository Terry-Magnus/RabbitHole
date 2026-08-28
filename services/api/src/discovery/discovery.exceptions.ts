import { BadRequestException, NotFoundException } from '@nestjs/common';

export class DiscoveryLinkNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Discovery link with id "${id}" was not found.`);
  }
}

export class DiscoveryLinkLimitExceededException extends BadRequestException {
  constructor(nodeId: string) {
    super(`Node "${nodeId}" already has the maximum of 3 discovery links.`);
  }
}

export class InvalidDiscoveryLinkTargetException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
