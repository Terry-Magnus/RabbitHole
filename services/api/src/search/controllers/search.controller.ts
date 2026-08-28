import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import {
  searchQuerySchema,
  type SearchQueryDto,
} from '../dto/search-query.dto';
import type { SearchResultRow } from '../repositories/search.repository';
import { SearchService } from '../services/search.service';

@Controller('public/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query(new ZodValidationPipe(searchQuerySchema)) query: SearchQueryDto,
  ): Promise<SearchResultRow[]> {
    return this.searchService.search(query.q);
  }
}
