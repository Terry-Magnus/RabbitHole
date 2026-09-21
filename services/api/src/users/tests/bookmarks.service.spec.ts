import type {
  JourneysService,
  PublicJourney,
} from '../../journeys/services/journeys.service';
import type {
  BookmarkWithJourney,
  BookmarksRepository,
} from '../repositories/bookmarks.repository';
import { BookmarksService } from '../services/bookmarks.service';

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
    nodes: [{ id: 'node-1', title: 'Intro', order: 0 }],
    ...overrides,
  };
}

function makeBookmarkRow(
  overrides: Partial<BookmarkWithJourney> = {},
): BookmarkWithJourney {
  return {
    id: 'bookmark-1',
    userId: 'user-1',
    journeyId: 'journey-1',
    createdAt: new Date(),
    journey: {
      id: 'journey-1',
      slug: 'how-vaccines-work',
      title: 'How Vaccines Work',
      description: 'A journey.',
      difficulty: 'BEGINNER',
    },
    ...overrides,
  };
}

function makeRepository(
  overrides: Partial<BookmarksRepository> = {},
): BookmarksRepository {
  return {
    upsert: jest.fn().mockResolvedValue(makeBookmarkRow()),
    deleteIfExists: jest.fn().mockResolvedValue(undefined),
    exists: jest.fn().mockResolvedValue(false),
    findByUser: jest.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as BookmarksRepository;
}

function makeJourneysService(
  overrides: Partial<JourneysService> = {},
): JourneysService {
  return {
    findPublishedBySlug: jest.fn().mockResolvedValue(makePublicJourney()),
    ...overrides,
  } as unknown as JourneysService;
}

describe('BookmarksService', () => {
  describe('addBookmark', () => {
    it('upserts against the resolved journey id', async () => {
      const repository = makeRepository();
      const service = new BookmarksService(repository, makeJourneysService());

      await service.addBookmark('user-1', 'how-vaccines-work');

      expect(repository.upsert).toHaveBeenCalledWith('user-1', 'journey-1');
    });
  });

  describe('removeBookmark', () => {
    it('calls deleteIfExists against the resolved journey id', async () => {
      const repository = makeRepository();
      const service = new BookmarksService(repository, makeJourneysService());

      await service.removeBookmark('user-1', 'how-vaccines-work');

      expect(repository.deleteIfExists).toHaveBeenCalledWith(
        'user-1',
        'journey-1',
      );
    });
  });

  describe('isBookmarked', () => {
    it('reflects the repository exists() result', async () => {
      const repository = makeRepository({
        exists: jest.fn().mockResolvedValue(true),
      });
      const service = new BookmarksService(repository, makeJourneysService());

      await expect(
        service.isBookmarked('user-1', 'how-vaccines-work'),
      ).resolves.toBe(true);
      expect(repository.exists).toHaveBeenCalledWith('user-1', 'journey-1');
    });
  });

  describe('getBookmarks', () => {
    it('maps repository rows to the response shape', async () => {
      const repository = makeRepository({
        findByUser: jest.fn().mockResolvedValue([makeBookmarkRow()]),
      });
      const service = new BookmarksService(repository, makeJourneysService());

      const items = await service.getBookmarks('user-1');

      expect(repository.findByUser).toHaveBeenCalledWith('user-1');
      expect(items).toEqual([
        {
          id: 'journey-1',
          slug: 'how-vaccines-work',
          title: 'How Vaccines Work',
          description: 'A journey.',
          difficulty: 'BEGINNER',
        },
      ]);
    });
  });
});
