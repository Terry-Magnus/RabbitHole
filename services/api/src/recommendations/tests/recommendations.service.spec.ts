import type { Journey } from '@prisma/client';
import type {
  JourneysService,
  PublicJourney,
} from '../../journeys/services/journeys.service';
import type { RecommendationsRepository } from '../repositories/recommendations.repository';
import { RecommendationsService } from '../services/recommendations.service';

function makeJourney(overrides: Partial<Journey> = {}): Journey {
  return {
    id: 'journey-1',
    title: 'How Vaccines Work',
    slug: 'how-vaccines-work',
    description: 'An introduction to immunology.',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: new Date(),
    createdById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makePublicJourney(
  overrides: Partial<PublicJourney> = {},
): PublicJourney {
  return {
    ...makeJourney(),
    nodes: [],
    estimatedMinutes: 5,
    ...overrides,
  };
}

function makeJourneysService(
  overrides: Partial<JourneysService> = {},
): JourneysService {
  return {
    findManyPublished: jest.fn().mockResolvedValue([]),
    findPublishedBySlug: jest.fn().mockResolvedValue(makePublicJourney()),
    ...overrides,
  } as unknown as JourneysService;
}

function makeRecommendationsRepository(
  overrides: Partial<RecommendationsRepository> = {},
): RecommendationsRepository {
  return {
    findMostSimilarPublished: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as RecommendationsRepository;
}

describe('RecommendationsService', () => {
  describe('getHomepage', () => {
    it('includes only featured journeys in the featured list', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest
          .fn()
          .mockResolvedValue([
            makeJourney({ id: 'a', isFeatured: true }),
            makeJourney({ id: 'b', isFeatured: false }),
          ]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const homepage = await service.getHomepage();

      expect(homepage.featured.map((j) => j.id)).toEqual(['a']);
    });

    it('caps the featured list at 6', async () => {
      const journeys = Array.from({ length: 8 }, (_, i) =>
        makeJourney({ id: `journey-${i}`, isFeatured: true }),
      );
      const journeysService = makeJourneysService({
        findManyPublished: jest.fn().mockResolvedValue(journeys),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const homepage = await service.getHomepage();

      expect(homepage.featured).toHaveLength(6);
    });

    it('groups journeys by difficulty in a fixed order, capped at 4 each', async () => {
      const journeys = [
        ...Array.from({ length: 5 }, (_, i) =>
          makeJourney({ id: `adv-${i}`, difficulty: 'ADVANCED' }),
        ),
        makeJourney({ id: 'beg-1', difficulty: 'BEGINNER' }),
      ];
      const journeysService = makeJourneysService({
        findManyPublished: jest.fn().mockResolvedValue(journeys),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const homepage = await service.getHomepage();

      expect(homepage.categories.map((c) => c.difficulty)).toEqual([
        'BEGINNER',
        'ADVANCED',
      ]);
      expect(homepage.categories[1].journeys).toHaveLength(4);
    });

    it('omits a difficulty with zero published journeys', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest
          .fn()
          .mockResolvedValue([makeJourney({ difficulty: 'BEGINNER' })]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const homepage = await service.getHomepage();

      expect(homepage.categories).toHaveLength(1);
      expect(homepage.categories[0].difficulty).toBe('BEGINNER');
    });

    it('shapes each journey down to the lightweight homepage fields', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest
          .fn()
          .mockResolvedValue([makeJourney({ isFeatured: true })]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const homepage = await service.getHomepage();

      expect(homepage.featured[0]).toEqual({
        id: 'journey-1',
        slug: 'how-vaccines-work',
        title: 'How Vaccines Work',
        description: 'An introduction to immunology.',
        difficulty: 'BEGINNER',
      });
    });
  });

  describe('findRelatedJourney', () => {
    it('returns the content-similarity match when one exists', async () => {
      const similar = {
        id: 'journey-2',
        slug: 'how-the-immune-system-works',
        title: 'How the Immune System Works',
        description: 'A companion piece.',
        difficulty: 'BEGINNER' as const,
      };
      const repository = makeRecommendationsRepository({
        findMostSimilarPublished: jest.fn().mockResolvedValue(similar),
      });
      const service = new RecommendationsService(
        makeJourneysService(),
        repository,
      );

      const result = await service.findRelatedJourney('how-vaccines-work');

      expect(result).toEqual(similar);
    });

    it('falls back to a same-difficulty journey when no similarity match exists', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest.fn().mockResolvedValue([
          makeJourney({ id: 'journey-1' }), // the source itself, must be excluded
          makeJourney({ id: 'other-difficulty', difficulty: 'ADVANCED' }),
          makeJourney({ id: 'same-difficulty', difficulty: 'BEGINNER' }),
        ]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const result = await service.findRelatedJourney('how-vaccines-work');

      expect(result?.id).toBe('same-difficulty');
    });

    it('falls back to any other published journey when no same-difficulty match exists', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest
          .fn()
          .mockResolvedValue([
            makeJourney({ id: 'journey-1' }),
            makeJourney({ id: 'other', difficulty: 'ADVANCED' }),
          ]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const result = await service.findRelatedJourney('how-vaccines-work');

      expect(result?.id).toBe('other');
    });

    it('returns null when the source is the only published journey', async () => {
      const journeysService = makeJourneysService({
        findManyPublished: jest
          .fn()
          .mockResolvedValue([makeJourney({ id: 'journey-1' })]),
      });
      const service = new RecommendationsService(
        journeysService,
        makeRecommendationsRepository(),
      );

      const result = await service.findRelatedJourney('how-vaccines-work');

      expect(result).toBeNull();
    });
  });
});
