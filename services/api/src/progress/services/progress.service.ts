import { Injectable } from '@nestjs/common';
import type { JourneyDifficulty } from '@prisma/client';
import { JourneysService } from '../../journeys/services/journeys.service';
import { InvalidProgressPositionException } from '../progress.exceptions';
import {
  ProgressRepository,
  type JourneyProgressWithJourney,
} from '../repositories/progress.repository';

const CONTINUE_LEARNING_LIMIT = 6;

export interface ProgressJourneySummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
  lastNodePosition: number;
  totalNodes: number;
  completed: boolean;
}

function toSummary(row: JourneyProgressWithJourney): ProgressJourneySummary {
  return {
    id: row.journey.id,
    slug: row.journey.slug,
    title: row.journey.title,
    description: row.journey.description,
    difficulty: row.journey.difficulty,
    lastNodePosition: row.lastNodePosition,
    totalNodes: row.journey._count.nodes,
    completed: row.completedAt !== null,
  };
}

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly journeysService: JourneysService,
  ) {}

  async recordProgress(
    userId: string,
    slug: string,
    nodePosition: number,
  ): Promise<ProgressJourneySummary> {
    const journey = await this.journeysService.findPublishedBySlug(slug);

    if (nodePosition < 1 || nodePosition > journey.nodes.length) {
      throw new InvalidProgressPositionException(
        nodePosition,
        journey.nodes.length,
      );
    }

    const row = await this.progressRepository.upsert({
      userId,
      journeyId: journey.id,
      lastNodePosition: nodePosition,
    });

    return toSummary(row);
  }

  async markComplete(
    userId: string,
    slug: string,
  ): Promise<ProgressJourneySummary> {
    const journey = await this.journeysService.findPublishedBySlug(slug);

    const row = await this.progressRepository.upsert({
      userId,
      journeyId: journey.id,
      lastNodePosition: journey.nodes.length,
      completedAt: new Date(),
    });

    return toSummary(row);
  }

  async getContinueLearning(userId: string): Promise<ProgressJourneySummary[]> {
    const rows = await this.progressRepository.findByUser(userId, {
      limit: CONTINUE_LEARNING_LIMIT,
    });

    return rows.map(toSummary);
  }

  async getLibrary(userId: string): Promise<ProgressJourneySummary[]> {
    const rows = await this.progressRepository.findByUser(userId);
    return rows.map(toSummary);
  }
}
