import type {
  JourneysService,
  PublicJourney,
} from '../../journeys/services/journeys.service';
import { InvalidProgressPositionException } from '../progress.exceptions';
import type {
  JourneyProgressWithJourney,
  ProgressRepository,
} from '../repositories/progress.repository';
import { ProgressService } from '../services/progress.service';

function makePublicJourney(
  overrides: Partial<PublicJourney> = {},
): PublicJourney {
  return {
    id: 'journey-1',
    title: 'How Vaccines Work',
    slug: 'how-vaccines-work',
    description: 'A journey.',
    difficulty: 'BEGINNER',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: new Date(),
    createdById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedMinutes: 5,
    nodes: [
      { id: 'node-1', title: 'Intro', order: 0 },
      { id: 'node-2', title: 'Middle', order: 1 },
      { id: 'node-3', title: 'End', order: 2 },
    ],
    ...overrides,
  };
}

function makeProgressRow(
  overrides: Partial<JourneyProgressWithJourney> = {},
): JourneyProgressWithJourney {
  return {
    id: 'progress-1',
    userId: 'user-1',
    journeyId: 'journey-1',
    lastNodePosition: 1,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    journey: {
      id: 'journey-1',
      slug: 'how-vaccines-work',
      title: 'How Vaccines Work',
      description: 'A journey.',
      difficulty: 'BEGINNER',
      _count: { nodes: 3 },
    },
    ...overrides,
  };
}

function makeRepository(
  overrides: Partial<ProgressRepository> = {},
): ProgressRepository {
  return {
    upsert: jest.fn().mockResolvedValue(makeProgressRow()),
    findByUser: jest.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as ProgressRepository;
}

function makeJourneysService(
  overrides: Partial<JourneysService> = {},
): JourneysService {
  return {
    findPublishedBySlug: jest.fn().mockResolvedValue(makePublicJourney()),
    ...overrides,
  } as unknown as JourneysService;
}

describe('ProgressService', () => {
  describe('recordProgress', () => {
    it('upserts with a valid position', async () => {
      const repository = makeRepository({
        upsert: jest
          .fn()
          .mockResolvedValue(makeProgressRow({ lastNodePosition: 2 })),
      });
      const service = new ProgressService(repository, makeJourneysService());

      const result = await service.recordProgress(
        'user-1',
        'how-vaccines-work',
        2,
      );

      expect(repository.upsert).toHaveBeenCalledWith({
        userId: 'user-1',
        journeyId: 'journey-1',
        lastNodePosition: 2,
      });
      expect(result.lastNodePosition).toBe(2);
      expect(result.completed).toBe(false);
    });

    it('rejects a position below 1', async () => {
      const service = new ProgressService(
        makeRepository(),
        makeJourneysService(),
      );

      await expect(
        service.recordProgress('user-1', 'how-vaccines-work', 0),
      ).rejects.toBeInstanceOf(InvalidProgressPositionException);
    });

    it("rejects a position beyond the journey's node count", async () => {
      const service = new ProgressService(
        makeRepository(),
        makeJourneysService(),
      );

      await expect(
        service.recordProgress('user-1', 'how-vaccines-work', 4),
      ).rejects.toBeInstanceOf(InvalidProgressPositionException);
    });
  });

  describe('markComplete', () => {
    it('pins lastNodePosition to the final node and sets completedAt', async () => {
      const repository = makeRepository({
        upsert: jest
          .fn()
          .mockResolvedValue(
            makeProgressRow({ lastNodePosition: 3, completedAt: new Date() }),
          ),
      });
      const service = new ProgressService(repository, makeJourneysService());

      const result = await service.markComplete('user-1', 'how-vaccines-work');

      const upsertMock = repository.upsert as jest.MockedFunction<
        ProgressRepository['upsert']
      >;
      const [upsertArg] = upsertMock.mock.calls[0];
      expect(upsertArg.userId).toBe('user-1');
      expect(upsertArg.journeyId).toBe('journey-1');
      expect(upsertArg.lastNodePosition).toBe(3);
      expect(upsertArg.completedAt).toBeInstanceOf(Date);
      expect(result.completed).toBe(true);
    });
  });

  describe('getContinueLearning / getLibrary', () => {
    it('maps repository rows to the response shape, capped for the homepage teaser', async () => {
      const repository = makeRepository({
        findByUser: jest.fn().mockResolvedValue([makeProgressRow()]),
      });
      const service = new ProgressService(repository, makeJourneysService());

      const items = await service.getContinueLearning('user-1');

      expect(repository.findByUser).toHaveBeenCalledWith('user-1', {
        limit: 6,
      });
      expect(items).toEqual([
        {
          id: 'journey-1',
          slug: 'how-vaccines-work',
          title: 'How Vaccines Work',
          description: 'A journey.',
          difficulty: 'BEGINNER',
          lastNodePosition: 1,
          totalNodes: 3,
          completed: false,
        },
      ]);
    });

    it('getLibrary fetches the full, uncapped list', async () => {
      const repository = makeRepository({
        findByUser: jest
          .fn()
          .mockResolvedValue([makeProgressRow({ completedAt: new Date() })]),
      });
      const service = new ProgressService(repository, makeJourneysService());

      const items = await service.getLibrary('user-1');

      expect(repository.findByUser).toHaveBeenCalledWith('user-1');
      expect(items[0].completed).toBe(true);
    });
  });
});
