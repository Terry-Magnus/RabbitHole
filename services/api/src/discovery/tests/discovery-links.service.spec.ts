import type { Journey } from '@prisma/client';
import type { JourneysService } from '../../journeys/services/journeys.service';
import type { JourneyNodeWithSources } from '../../nodes/repositories/nodes.repository';
import type { NodesService } from '../../nodes/services/nodes.service';
import {
  DiscoveryLinkLimitExceededException,
  DiscoveryLinkNotFoundException,
  InvalidDiscoveryLinkTargetException,
} from '../discovery.exceptions';
import type {
  DiscoveryLinksRepository,
  DiscoveryLinkWithTarget,
} from '../repositories/discovery-links.repository';
import { DiscoveryLinksService } from '../services/discovery-links.service';

function makeNode(
  overrides: Partial<JourneyNodeWithSources> = {},
): JourneyNodeWithSources {
  return {
    id: 'node-1',
    journeyId: 'journey-1',
    title: 'Intro',
    content: '<p>Hello</p>',
    order: 0,
    imageUrl: null,
    imageKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    sources: [],
    ...overrides,
  };
}

function makeJourney(overrides: Partial<Journey> = {}): Journey {
  return {
    id: 'journey-2',
    title: 'How Medicines Are Created in the Lab',
    slug: 'how-medicines-are-created',
    description: 'A journey.',
    difficulty: 'INTERMEDIATE',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: new Date(),
    createdById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeLink(
  overrides: Partial<DiscoveryLinkWithTarget> = {},
): DiscoveryLinkWithTarget {
  const targetJourney = makeJourney(overrides.targetJourney ?? {});

  return {
    id: 'link-1',
    nodeId: 'node-1',
    targetJourneyId: targetJourney.id,
    label: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    targetJourney: {
      id: targetJourney.id,
      slug: targetJourney.slug,
      title: targetJourney.title,
      difficulty: targetJourney.difficulty,
      status: targetJourney.status,
    },
    ...overrides,
  };
}

function makeRepository(
  overrides: Partial<DiscoveryLinksRepository> = {},
): DiscoveryLinksRepository {
  return {
    findMany: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  } as unknown as DiscoveryLinksRepository;
}

function makeNodesService(overrides: Partial<NodesService> = {}): NodesService {
  return {
    requireNode: jest.fn().mockResolvedValue(makeNode()),
    ...overrides,
  } as unknown as NodesService;
}

function makeJourneysService(
  overrides: Partial<JourneysService> = {},
): JourneysService {
  return {
    findById: jest.fn().mockResolvedValue(makeJourney()),
    ...overrides,
  } as unknown as JourneysService;
}

describe('DiscoveryLinksService', () => {
  describe('create', () => {
    it('creates a link against a published, different journey', async () => {
      const repository = makeRepository({
        create: jest
          .fn()
          .mockImplementation((data) => Promise.resolve(makeLink(data))),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        makeJourneysService(),
      );

      const link = await service.create('node-1', {
        targetJourneyId: 'journey-2',
      });

      expect(link.targetJourneyId).toBe('journey-2');
    });

    it('rejects a target journey that is not published', async () => {
      const journeysService = makeJourneysService({
        findById: jest.fn().mockResolvedValue(makeJourney({ status: 'DRAFT' })),
      });
      const service = new DiscoveryLinksService(
        makeRepository(),
        makeNodesService(),
        journeysService,
      );

      await expect(
        service.create('node-1', { targetJourneyId: 'journey-2' }),
      ).rejects.toBeInstanceOf(InvalidDiscoveryLinkTargetException);
    });

    it("rejects a target journey equal to the node's own journey", async () => {
      const service = new DiscoveryLinksService(
        makeRepository(),
        makeNodesService({
          requireNode: jest
            .fn()
            .mockResolvedValue(makeNode({ journeyId: 'journey-1' })),
        }),
        makeJourneysService(),
      );

      await expect(
        service.create('node-1', { targetJourneyId: 'journey-1' }),
      ).rejects.toBeInstanceOf(InvalidDiscoveryLinkTargetException);
    });

    it('rejects a fourth link on a node that already has 3', async () => {
      const repository = makeRepository({
        findMany: jest
          .fn()
          .mockResolvedValue([makeLink(), makeLink(), makeLink()]),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        makeJourneysService(),
      );

      await expect(
        service.create('node-1', { targetJourneyId: 'journey-2' }),
      ).rejects.toBeInstanceOf(DiscoveryLinkLimitExceededException);
    });
  });

  describe('update', () => {
    it('re-validates a changed target journey', async () => {
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(makeLink()),
      });
      const journeysService = makeJourneysService({
        findById: jest
          .fn()
          .mockResolvedValue(makeJourney({ status: 'ARCHIVED' })),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        journeysService,
      );

      await expect(
        service.update('node-1', 'link-1', { targetJourneyId: 'journey-3' }),
      ).rejects.toBeInstanceOf(InvalidDiscoveryLinkTargetException);
    });

    it('rejects updating a link that belongs to a different node', async () => {
      const repository = makeRepository({
        findById: jest
          .fn()
          .mockResolvedValue(makeLink({ nodeId: 'other-node' })),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        makeJourneysService(),
      );

      await expect(
        service.update('node-1', 'link-1', { label: 'New label' }),
      ).rejects.toBeInstanceOf(DiscoveryLinkNotFoundException);
    });
  });

  describe('findPublicLinksForNode', () => {
    it("404s when the node's own journey is not published", async () => {
      const nodesService = makeNodesService({
        requireNode: jest
          .fn()
          .mockResolvedValue(makeNode({ journeyId: 'journey-1' })),
      });
      const journeysService = makeJourneysService({
        findById: jest.fn().mockResolvedValue(makeJourney({ status: 'DRAFT' })),
      });
      const service = new DiscoveryLinksService(
        makeRepository(),
        nodesService,
        journeysService,
      );

      await expect(service.findPublicLinksForNode('node-1')).rejects.toThrow();
    });

    it('omits a link whose target is no longer published', async () => {
      const repository = makeRepository({
        findMany: jest.fn().mockResolvedValue([
          makeLink({ id: 'link-1' }),
          makeLink({
            id: 'link-2',
            targetJourney: {
              id: 'journey-3',
              slug: 'archived-journey',
              title: 'Archived Journey',
              difficulty: 'BEGINNER',
              status: 'ARCHIVED',
            },
          }),
        ]),
      });
      const journeysService = makeJourneysService({
        findById: jest
          .fn()
          .mockResolvedValue(
            makeJourney({ id: 'journey-1', status: 'PUBLISHED' }),
          ),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        journeysService,
      );

      const links = await service.findPublicLinksForNode('node-1');

      expect(links).toHaveLength(1);
      expect(links[0].id).toBe('link-1');
    });

    it('falls back to the target journey title when no custom label is set', async () => {
      const repository = makeRepository({
        findMany: jest.fn().mockResolvedValue([makeLink({ label: null })]),
      });
      const journeysService = makeJourneysService({
        findById: jest
          .fn()
          .mockResolvedValue(
            makeJourney({ id: 'journey-1', status: 'PUBLISHED' }),
          ),
      });
      const service = new DiscoveryLinksService(
        repository,
        makeNodesService(),
        journeysService,
      );

      const links = await service.findPublicLinksForNode('node-1');

      expect(links[0].label).toBeNull();
      expect(links[0].journey.title).toBe(
        'How Medicines Are Created in the Lab',
      );
    });
  });
});
