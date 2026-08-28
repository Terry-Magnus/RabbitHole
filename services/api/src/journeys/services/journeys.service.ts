import { Injectable } from '@nestjs/common';
import type { Journey } from '@prisma/client';
import type { CreateJourneyDto } from '../dto/create-journey.dto';
import type { UpdateJourneyDto } from '../dto/update-journey.dto';
import { estimateReadingMinutes } from '../estimate-reading-minutes';
import {
  InvalidJourneyFeatureException,
  InvalidJourneyStatusTransitionException,
  JourneyNotFoundException,
} from '../journeys.exceptions';
import { JourneysRepository } from '../repositories/journeys.repository';
import { slugify } from '../slugify';

export interface PublicJourneyNode {
  id: string;
  title: string;
  order: number;
}

export interface PublicJourney extends Journey {
  nodes: PublicJourneyNode[];
  estimatedMinutes: number;
}

@Injectable()
export class JourneysService {
  constructor(private readonly journeysRepository: JourneysRepository) {}

  findAll(): Promise<Journey[]> {
    return this.journeysRepository.findMany();
  }

  async findById(id: string): Promise<Journey> {
    const journey = await this.journeysRepository.findById(id);

    if (!journey) {
      throw new JourneyNotFoundException(id);
    }

    return journey;
  }

  async create(dto: CreateJourneyDto): Promise<Journey> {
    const slug = await this.generateUniqueSlug(dto.slug ?? dto.title);

    return this.journeysRepository.create({
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      slug,
    });
  }

  async update(id: string, dto: UpdateJourneyDto): Promise<Journey> {
    await this.findById(id);

    const slug = dto.slug
      ? await this.generateUniqueSlug(dto.slug, id)
      : undefined;

    return this.journeysRepository.update(id, {
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      ...(slug ? { slug } : {}),
    });
  }

  async publish(id: string): Promise<Journey> {
    const journey = await this.findById(id);

    if (journey.status === 'PUBLISHED') {
      throw new InvalidJourneyStatusTransitionException(
        journey.status,
        'publish',
      );
    }

    return this.journeysRepository.update(id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
  }

  async archive(id: string): Promise<Journey> {
    const journey = await this.findById(id);

    if (journey.status === 'ARCHIVED') {
      throw new InvalidJourneyStatusTransitionException(
        journey.status,
        'archive',
      );
    }

    return this.journeysRepository.update(id, { status: 'ARCHIVED' });
  }

  async feature(id: string): Promise<Journey> {
    const journey = await this.findById(id);

    if (journey.status !== 'PUBLISHED') {
      throw new InvalidJourneyFeatureException(journey.status);
    }

    return this.journeysRepository.update(id, { isFeatured: true });
  }

  async unfeature(id: string): Promise<Journey> {
    await this.findById(id);
    return this.journeysRepository.update(id, { isFeatured: false });
  }

  async findPublishedBySlug(slug: string): Promise<PublicJourney> {
    const journey =
      await this.journeysRepository.findPublishedBySlugWithNodes(slug);

    if (!journey) {
      throw new JourneyNotFoundException(slug);
    }

    const estimatedMinutes = estimateReadingMinutes(
      journey.nodes.map((node) => node.content),
    );

    return {
      ...journey,
      nodes: journey.nodes.map(({ id, title, order }) => ({
        id,
        title,
        order,
      })),
      estimatedMinutes,
    };
  }

  findManyPublished(): Promise<Journey[]> {
    return this.journeysRepository.findManyPublished();
  }

  async findRandomPublished(): Promise<Journey> {
    const published = await this.findManyPublished();

    if (published.length === 0) {
      throw new JourneyNotFoundException('random');
    }

    const index = Math.floor(Math.random() * published.length);
    return published[index];
  }

  private async generateUniqueSlug(
    source: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(source);
    let candidate = base;
    let suffix = 2;

    let existing = await this.journeysRepository.findBySlug(candidate);
    while (existing && existing.id !== excludeId) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
      existing = await this.journeysRepository.findBySlug(candidate);
    }

    return candidate;
  }
}
