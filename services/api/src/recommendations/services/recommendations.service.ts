import { Injectable } from '@nestjs/common';
import type { Journey, JourneyDifficulty } from '@prisma/client';
import { JourneysService } from '../../journeys/services/journeys.service';
import { RecommendationsRepository } from '../repositories/recommendations.repository';

const FEATURED_LIMIT = 6;
const CATEGORY_LIMIT = 4;
const CATEGORY_ORDER: JourneyDifficulty[] = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
];

export interface HomepageJourney {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}

export interface HomepageCategory {
  difficulty: JourneyDifficulty;
  journeys: HomepageJourney[];
}

export interface Homepage {
  featured: HomepageJourney[];
  categories: HomepageCategory[];
}

function toHomepageJourney(journey: Journey): HomepageJourney {
  return {
    id: journey.id,
    slug: journey.slug,
    title: journey.title,
    description: journey.description,
    difficulty: journey.difficulty,
  };
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly journeysService: JourneysService,
    private readonly recommendationsRepository: RecommendationsRepository,
  ) {}

  async getHomepage(): Promise<Homepage> {
    const published = await this.journeysService.findManyPublished();

    const featured = published
      .filter((journey) => journey.isFeatured)
      .slice(0, FEATURED_LIMIT)
      .map(toHomepageJourney);

    const categories = CATEGORY_ORDER.map((difficulty) => ({
      difficulty,
      journeys: published
        .filter((journey) => journey.difficulty === difficulty)
        .slice(0, CATEGORY_LIMIT)
        .map(toHomepageJourney),
    })).filter((category) => category.journeys.length > 0);

    return { featured, categories };
  }

  async findRelatedJourney(slug: string): Promise<HomepageJourney | null> {
    const source = await this.journeysService.findPublishedBySlug(slug);

    // Built from the description, not the title. Every journey in this app
    // is titled "How X Works" by convention, so OR-ing title words together
    // let generic template words ("how", "works") outrank genuinely shared,
    // specific vocabulary that only appeared in a description — confirmed
    // directly against the real database during verification, not assumed.
    // Descriptions are free prose actually describing the topic, so they're
    // the more discriminative signal for similarity.
    const descriptionQuery = source.description.trim().split(/\s+/).join(' OR ');
    const similar =
      await this.recommendationsRepository.findMostSimilarPublished(
        descriptionQuery,
        source.id,
      );
    if (similar) {
      return similar;
    }

    const published = await this.journeysService.findManyPublished();

    const sameDifficulty = published.find(
      (journey) =>
        journey.id !== source.id && journey.difficulty === source.difficulty,
    );
    if (sameDifficulty) {
      return toHomepageJourney(sameDifficulty);
    }

    const anyOther = published.find((journey) => journey.id !== source.id);
    return anyOther ? toHomepageJourney(anyOther) : null;
  }
}
