import { Injectable } from '@nestjs/common';
import { JourneysService } from '../../journeys/services/journeys.service';
import { JourneyNodeNotFoundException } from '../../nodes/nodes.exceptions';
import { NodesService } from '../../nodes/services/nodes.service';
import type { CreateDiscoveryLinkDto } from '../dto/create-discovery-link.dto';
import type { UpdateDiscoveryLinkDto } from '../dto/update-discovery-link.dto';
import {
  DiscoveryLinkLimitExceededException,
  DiscoveryLinkNotFoundException,
  InvalidDiscoveryLinkTargetException,
} from '../discovery.exceptions';
import {
  DiscoveryLinksRepository,
  type DiscoveryLinkWithTarget,
} from '../repositories/discovery-links.repository';

const MAX_LINKS_PER_NODE = 3;

export interface PublicDiscoveryLink {
  id: string;
  label: string | null;
  journey: {
    slug: string;
    title: string;
    difficulty: DiscoveryLinkWithTarget['targetJourney']['difficulty'];
  };
}

@Injectable()
export class DiscoveryLinksService {
  constructor(
    private readonly discoveryLinksRepository: DiscoveryLinksRepository,
    private readonly nodesService: NodesService,
    private readonly journeysService: JourneysService,
  ) {}

  async findAll(nodeId: string): Promise<DiscoveryLinkWithTarget[]> {
    await this.nodesService.requireNode(nodeId);
    return this.discoveryLinksRepository.findMany(nodeId);
  }

  async create(
    nodeId: string,
    dto: CreateDiscoveryLinkDto,
  ): Promise<DiscoveryLinkWithTarget> {
    const node = await this.nodesService.requireNode(nodeId);

    const existing = await this.discoveryLinksRepository.findMany(nodeId);
    if (existing.length >= MAX_LINKS_PER_NODE) {
      throw new DiscoveryLinkLimitExceededException(nodeId);
    }

    await this.validateTarget(node.journeyId, dto.targetJourneyId);

    return this.discoveryLinksRepository.create({
      label: dto.label,
      node: { connect: { id: nodeId } },
      targetJourney: { connect: { id: dto.targetJourneyId } },
    });
  }

  async update(
    nodeId: string,
    id: string,
    dto: UpdateDiscoveryLinkDto,
  ): Promise<DiscoveryLinkWithTarget> {
    const node = await this.nodesService.requireNode(nodeId);
    await this.requireLink(nodeId, id);

    if (dto.targetJourneyId) {
      await this.validateTarget(node.journeyId, dto.targetJourneyId);
    }

    return this.discoveryLinksRepository.update(id, {
      label: dto.label,
      ...(dto.targetJourneyId
        ? { targetJourney: { connect: { id: dto.targetJourneyId } } }
        : {}),
    });
  }

  async delete(nodeId: string, id: string): Promise<DiscoveryLinkWithTarget> {
    await this.requireLink(nodeId, id);
    return this.discoveryLinksRepository.delete(id);
  }

  async findPublicLinksForNode(nodeId: string): Promise<PublicDiscoveryLink[]> {
    const node = await this.nodesService.requireNode(nodeId);
    const journey = await this.journeysService.findById(node.journeyId);

    if (journey.status !== 'PUBLISHED') {
      throw new JourneyNodeNotFoundException(nodeId);
    }

    const links = await this.discoveryLinksRepository.findMany(nodeId);

    return links
      .filter((link) => link.targetJourney.status === 'PUBLISHED')
      .map((link) => ({
        id: link.id,
        label: link.label,
        journey: {
          slug: link.targetJourney.slug,
          title: link.targetJourney.title,
          difficulty: link.targetJourney.difficulty,
        },
      }));
  }

  private async validateTarget(
    nodeJourneyId: string,
    targetJourneyId: string,
  ): Promise<void> {
    if (targetJourneyId === nodeJourneyId) {
      throw new InvalidDiscoveryLinkTargetException(
        "A discovery link cannot target the node's own journey.",
      );
    }

    const target = await this.journeysService.findById(targetJourneyId);

    if (target.status !== 'PUBLISHED') {
      throw new InvalidDiscoveryLinkTargetException(
        'Discovery link targets must be published journeys.',
      );
    }
  }

  private async requireLink(
    nodeId: string,
    id: string,
  ): Promise<DiscoveryLinkWithTarget> {
    const link = await this.discoveryLinksRepository.findById(id);

    if (!link || link.nodeId !== nodeId) {
      throw new DiscoveryLinkNotFoundException(id);
    }

    return link;
  }
}
