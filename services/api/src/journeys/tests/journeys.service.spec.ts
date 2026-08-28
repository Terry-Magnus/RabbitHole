import type { Journey } from '@prisma/client';
import {
  InvalidJourneyFeatureException,
  InvalidJourneyStatusTransitionException,
  JourneyNotFoundException,
} from '../journeys.exceptions';
import type {
  JourneysRepository,
  JourneyWithNodeContent,
} from '../repositories/journeys.repository';
import { JourneysService } from '../services/journeys.service';

function makeJourney(overrides: Partial<Journey> = {}): Journey {
  return {
    id: 'journey-1',
    title: 'How Vaccines Work',
    slug: 'how-vaccines-work',
    description: 'An introduction to immunology.',
    difficulty: 'BEGINNER',
    status: 'DRAFT',
    isFeatured: false,
    publishedAt: null,
    createdById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeJourneyWithNodeContent(
  overrides: Partial<JourneyWithNodeContent> = {},
): JourneyWithNodeContent {
  return {
    ...makeJourney({ status: 'PUBLISHED' }),
    nodes: [],
    ...overrides,
  };
}

function makeRepository(
  overrides: Partial<JourneysRepository> = {},
): JourneysRepository {
  return {
    findMany: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn().mockResolvedValue(null),
    findPublishedBySlugWithNodes: jest.fn(),
    findManyPublished: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    update: jest.fn(),
    ...overrides,
  } as unknown as JourneysRepository;
}

describe('JourneysService', () => {
  describe('create', () => {
    it('generates a slug from the title when no collision exists', async () => {
      const repository = makeRepository({
        create: jest
          .fn()
          .mockImplementation((data: Partial<Journey>) =>
            Promise.resolve(makeJourney(data)),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.create({
        title: 'How Vaccines Work',
        description: 'An introduction to immunology.',
        difficulty: 'BEGINNER',
      });

      expect(journey.slug).toBe('how-vaccines-work');
    });

    it('appends a numeric suffix when the slug already exists', async () => {
      const findBySlug = jest
        .fn()
        .mockResolvedValueOnce(makeJourney({ slug: 'how-vaccines-work' }))
        .mockResolvedValueOnce(null);
      const repository = makeRepository({
        findBySlug,
        create: jest
          .fn()
          .mockImplementation((data: Partial<Journey>) =>
            Promise.resolve(makeJourney(data)),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.create({
        title: 'How Vaccines Work',
        description: 'An introduction to immunology.',
        difficulty: 'BEGINNER',
      });

      expect(journey.slug).toBe('how-vaccines-work-2');
    });
  });

  describe('publish', () => {
    it('publishes a draft journey', async () => {
      const draft = makeJourney({ status: 'DRAFT' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(draft),
        update: jest
          .fn()
          .mockImplementation((_id, data) =>
            Promise.resolve({ ...draft, ...data }),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.publish(draft.id);

      expect(journey.status).toBe('PUBLISHED');
      expect(journey.publishedAt).not.toBeNull();
    });

    it('rejects publishing an already-published journey', async () => {
      const published = makeJourney({ status: 'PUBLISHED' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(published),
      });
      const service = new JourneysService(repository);

      await expect(service.publish(published.id)).rejects.toBeInstanceOf(
        InvalidJourneyStatusTransitionException,
      );
    });
  });

  describe('archive', () => {
    it('archives a published journey', async () => {
      const published = makeJourney({ status: 'PUBLISHED' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(published),
        update: jest
          .fn()
          .mockImplementation((_id, data) =>
            Promise.resolve({ ...published, ...data }),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.archive(published.id);

      expect(journey.status).toBe('ARCHIVED');
    });

    it('rejects archiving an already-archived journey', async () => {
      const archived = makeJourney({ status: 'ARCHIVED' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(archived),
      });
      const service = new JourneysService(repository);

      await expect(service.archive(archived.id)).rejects.toBeInstanceOf(
        InvalidJourneyStatusTransitionException,
      );
    });
  });

  describe('feature', () => {
    it('features a published journey', async () => {
      const published = makeJourney({ status: 'PUBLISHED' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(published),
        update: jest
          .fn()
          .mockImplementation((_id, data) =>
            Promise.resolve({ ...published, ...data }),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.feature(published.id);

      expect(journey.isFeatured).toBe(true);
    });

    it('rejects featuring a draft journey', async () => {
      const draft = makeJourney({ status: 'DRAFT' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(draft),
      });
      const service = new JourneysService(repository);

      await expect(service.feature(draft.id)).rejects.toBeInstanceOf(
        InvalidJourneyFeatureException,
      );
    });

    it('rejects featuring an archived journey', async () => {
      const archived = makeJourney({ status: 'ARCHIVED' });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(archived),
      });
      const service = new JourneysService(repository);

      await expect(service.feature(archived.id)).rejects.toBeInstanceOf(
        InvalidJourneyFeatureException,
      );
    });
  });

  describe('unfeature', () => {
    it('succeeds regardless of current status', async () => {
      const archived = makeJourney({ status: 'ARCHIVED', isFeatured: true });
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(archived),
        update: jest
          .fn()
          .mockImplementation((_id, data) =>
            Promise.resolve({ ...archived, ...data }),
          ),
      });
      const service = new JourneysService(repository);

      const journey = await service.unfeature(archived.id);

      expect(journey.isFeatured).toBe(false);
    });
  });

  describe('findPublishedBySlug', () => {
    it('returns a published journey with a light node list and computed reading time', async () => {
      const published = makeJourneyWithNodeContent({
        nodes: [
          {
            id: 'node-1',
            title: 'Intro',
            order: 0,
            content: `<p>${'word '.repeat(200)}</p>`,
          },
        ],
      });
      const repository = makeRepository({
        findPublishedBySlugWithNodes: jest.fn().mockResolvedValue(published),
      });
      const service = new JourneysService(repository);

      const journey = await service.findPublishedBySlug('how-vaccines-work');

      expect(journey.nodes).toEqual([
        { id: 'node-1', title: 'Intro', order: 0 },
      ]);
      expect(journey.estimatedMinutes).toBe(1);
      expect(journey.nodes[0]).not.toHaveProperty('content');
    });

    it('treats a draft/archived journey the same as nonexistent', async () => {
      const repository = makeRepository({
        findPublishedBySlugWithNodes: jest.fn().mockResolvedValue(null),
      });
      const service = new JourneysService(repository);

      await expect(
        service.findPublishedBySlug('some-draft-journey'),
      ).rejects.toBeInstanceOf(JourneyNotFoundException);
    });
  });

  describe('findRandomPublished', () => {
    it('returns one journey when published journeys exist', async () => {
      const published = makeJourney({ status: 'PUBLISHED' });
      const repository = makeRepository({
        findManyPublished: jest.fn().mockResolvedValue([published]),
      });
      const service = new JourneysService(repository);

      const journey = await service.findRandomPublished();

      expect(journey.id).toBe(published.id);
    });

    it('rejects when no journeys are published', async () => {
      const repository = makeRepository({
        findManyPublished: jest.fn().mockResolvedValue([]),
      });
      const service = new JourneysService(repository);

      await expect(service.findRandomPublished()).rejects.toBeInstanceOf(
        JourneyNotFoundException,
      );
    });
  });
});
