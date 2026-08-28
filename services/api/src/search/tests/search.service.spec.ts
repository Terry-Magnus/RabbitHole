import type { SearchRepository } from '../repositories/search.repository';
import { SearchService } from '../services/search.service';

function makeRepository(
  overrides: Partial<SearchRepository> = {},
): SearchRepository {
  return {
    searchPublishedJourneys: jest.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as SearchRepository;
}

describe('SearchService', () => {
  describe('search', () => {
    it('delegates to the repository with the given query', async () => {
      const repository = makeRepository({
        searchPublishedJourneys: jest.fn().mockResolvedValue([
          {
            id: 'journey-1',
            slug: 'how-vaccines-work',
            title: 'How Vaccines Work',
            description: 'An introduction to immunology.',
            difficulty: 'BEGINNER',
          },
        ]),
      });
      const service = new SearchService(repository);

      const results = await service.search('vaccines');

      expect(repository.searchPublishedJourneys).toHaveBeenCalledWith(
        'vaccines',
      );
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe('how-vaccines-work');
    });

    it('returns an empty array when nothing matches', async () => {
      const repository = makeRepository();
      const service = new SearchService(repository);

      const results = await service.search('no-such-topic');

      expect(results).toEqual([]);
    });
  });
});
