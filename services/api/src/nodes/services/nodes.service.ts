import { Injectable } from '@nestjs/common';
import type { JourneyNode, Source } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { JourneysService } from '../../journeys/services/journeys.service';
import { UploadsService } from '../../uploads/services/uploads.service';
import type { CreateNodeDto } from '../dto/create-node.dto';
import type { CreateSourceDto } from '../dto/create-source.dto';
import type { ReorderNodesDto } from '../dto/reorder-nodes.dto';
import type { UpdateNodeDto } from '../dto/update-node.dto';
import type { UpdateSourceDto } from '../dto/update-source.dto';
import {
  InvalidNodeReorderException,
  JourneyNodeNotFoundException,
  SourceNotFoundException,
} from '../nodes.exceptions';
import {
  NodesRepository,
  type JourneyNodeWithSources,
} from '../repositories/nodes.repository';

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'strong',
  'em',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'br',
  'a',
];

@Injectable()
export class NodesService {
  constructor(
    private readonly nodesRepository: NodesRepository,
    private readonly journeysService: JourneysService,
    private readonly uploadsService: UploadsService,
  ) {}

  async findAll(journeyId: string): Promise<JourneyNode[]> {
    await this.journeysService.findById(journeyId);
    return this.nodesRepository.findMany(journeyId);
  }

  async findById(
    journeyId: string,
    id: string,
  ): Promise<JourneyNodeWithSources> {
    await this.journeysService.findById(journeyId);
    const node = await this.nodesRepository.findById(id);

    if (!node || node.journeyId !== journeyId) {
      throw new JourneyNodeNotFoundException(id);
    }

    return node;
  }

  async create(journeyId: string, dto: CreateNodeDto): Promise<JourneyNode> {
    await this.journeysService.findById(journeyId);
    const maxOrder = await this.nodesRepository.findMaxOrder(journeyId);

    return this.nodesRepository.create({
      title: dto.title,
      content: this.sanitize(dto.content),
      ahaMoment: dto.ahaMoment,
      order: maxOrder === null ? 0 : maxOrder + 1,
      journey: { connect: { id: journeyId } },
    });
  }

  async update(
    journeyId: string,
    id: string,
    dto: UpdateNodeDto,
  ): Promise<JourneyNode> {
    await this.findById(journeyId, id);

    return this.nodesRepository.update(id, {
      title: dto.title,
      content: dto.content ? this.sanitize(dto.content) : undefined,
      ahaMoment: dto.ahaMoment,
    });
  }

  async delete(journeyId: string, id: string): Promise<JourneyNode> {
    await this.findById(journeyId, id);
    return this.nodesRepository.delete(id);
  }

  async reorder(
    journeyId: string,
    dto: ReorderNodesDto,
  ): Promise<JourneyNode[]> {
    await this.journeysService.findById(journeyId);
    const existingNodes = await this.nodesRepository.findMany(journeyId);
    const existingIds = new Set(existingNodes.map((node) => node.id));
    const requestedIds = new Set(dto.nodeIds);

    const sameSize = existingIds.size === requestedIds.size;
    const sameMembers = [...existingIds].every((id) => requestedIds.has(id));

    if (!sameSize || !sameMembers) {
      throw new InvalidNodeReorderException(
        "nodeIds must include exactly the journey's current nodes.",
      );
    }

    return this.nodesRepository.reorder(journeyId, dto.nodeIds);
  }

  async findPublishedNodeByPosition(
    slug: string,
    position: number,
  ): Promise<{
    node: JourneyNodeWithSources;
    journeyTitle: string;
    journeySlug: string;
    totalNodes: number;
  }> {
    const journey = await this.journeysService.findPublishedBySlug(slug);
    const totalNodes = journey.nodes.length;
    const target = journey.nodes[position - 1];

    if (!target) {
      throw new JourneyNodeNotFoundException(`position ${position}`);
    }

    const node = await this.requireNode(target.id);

    return {
      node,
      journeyTitle: journey.title,
      journeySlug: journey.slug,
      totalNodes,
    };
  }

  async findSources(nodeId: string): Promise<Source[]> {
    const node = await this.requireNode(nodeId);
    return node.sources;
  }

  async createSource(nodeId: string, dto: CreateSourceDto): Promise<Source> {
    await this.requireNode(nodeId);

    return this.nodesRepository.createSource({
      label: dto.label,
      url: dto.url,
      node: { connect: { id: nodeId } },
    });
  }

  async updateSource(
    nodeId: string,
    sourceId: string,
    dto: UpdateSourceDto,
  ): Promise<Source> {
    await this.requireSource(nodeId, sourceId);

    return this.nodesRepository.updateSource(sourceId, {
      label: dto.label,
      url: dto.url,
    });
  }

  async deleteSource(nodeId: string, sourceId: string): Promise<Source> {
    await this.requireSource(nodeId, sourceId);
    return this.nodesRepository.deleteSource(sourceId);
  }

  async uploadImage(nodeId: string, file: Buffer): Promise<JourneyNode> {
    const node = await this.requireNode(nodeId);
    const saved = await this.uploadsService.saveImage(file);

    if (node.imageKey) {
      await this.uploadsService.deleteImage(node.imageKey);
    }

    return this.nodesRepository.update(nodeId, {
      imageUrl: `/uploads/${saved.key}`,
      imageKey: saved.key,
    });
  }

  async removeImage(nodeId: string): Promise<JourneyNode> {
    const node = await this.requireNode(nodeId);

    if (node.imageKey) {
      await this.uploadsService.deleteImage(node.imageKey);
    }

    return this.nodesRepository.update(nodeId, {
      imageUrl: null,
      imageKey: null,
    });
  }

  async requireNode(id: string): Promise<JourneyNodeWithSources> {
    const node = await this.nodesRepository.findById(id);

    if (!node) {
      throw new JourneyNodeNotFoundException(id);
    }

    return node;
  }

  private async requireSource(
    nodeId: string,
    sourceId: string,
  ): Promise<Source> {
    const source = await this.nodesRepository.findSourceById(sourceId);

    if (!source || source.nodeId !== nodeId) {
      throw new SourceNotFoundException(sourceId);
    }

    return source;
  }

  private sanitize(content: string): string {
    return sanitizeHtml(content, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
      },
    });
  }
}
