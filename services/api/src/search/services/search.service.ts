import { Injectable } from '@nestjs/common';
import {
  SearchRepository,
  type SearchResultRow,
} from '../repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  search(query: string): Promise<SearchResultRow[]> {
    return this.searchRepository.searchPublishedJourneys(query);
  }
}
