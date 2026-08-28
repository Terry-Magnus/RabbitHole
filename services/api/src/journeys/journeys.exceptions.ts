import { ConflictException, NotFoundException } from '@nestjs/common';

export class JourneyNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Journey with id "${id}" was not found.`);
  }
}

export class InvalidJourneyStatusTransitionException extends ConflictException {
  constructor(from: string, action: 'publish' | 'archive') {
    super(`Cannot ${action} a journey that is currently "${from}".`);
  }
}

export class InvalidJourneyFeatureException extends ConflictException {
  constructor(from: string) {
    super(
      `Cannot feature a journey that is currently "${from}" — only published journeys can be featured.`,
    );
  }
}
