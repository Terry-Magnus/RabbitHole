import type { JourneyNode, Source } from '@prisma/client';
import type { JourneysService } from '../../journeys/services/journeys.service';
import type { UploadsService } from '../../uploads/services/uploads.service';
import {
  InvalidNodeReorderException,
  JourneyNodeNotFoundException,
  SourceNotFoundException,
} from '../nodes.exceptions';
import type {
  JourneyNodeWithSources,
  NodesRepository,
} from '../repositories/nodes.repository';
import { NodesService } from '../services/nodes.service';

function makeNode(
  overrides: Partial<JourneyNodeWithSources> = {},
): JourneyNodeWithSources {
  return {
    id: 'node-1',
    journeyId: 'journey-1',
    title: 'Intro',
    content: '<p>Hello</p>',
    ahaMoment: null,
    order: 0,
    imageUrl: null,
    imageKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    sources: [],
    ...overrides,
  };
}

function makeSource(overrides: Partial<Source> = {}): Source {
  return {
    id: 'source-1',
    nodeId: 'node-1',
    label: 'CDC — Vaccine Basics',
    url: 'https://example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeRepository(
  overrides: Partial<NodesRepository> = {},
): NodesRepository {
  return {
    findMany: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    findMaxOrder: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    reorder: jest.fn(),
    findSourceById: jest.fn(),
    createSource: jest.fn(),
    updateSource: jest.fn(),
    deleteSource: jest.fn(),
    ...overrides,
  } as unknown as NodesRepository;
}

function makeJourneysService(
  overrides: Partial<JourneysService> = {},
): JourneysService {
  return {
    findById: jest.fn().mockResolvedValue({ id: 'journey-1' }),
    findPublishedBySlug: jest.fn(),
    ...overrides,
  } as unknown as JourneysService;
}

function makeUploadsService(
  overrides: Partial<UploadsService> = {},
): UploadsService {
  return {
    saveImage: jest
      .fn()
      .mockResolvedValue({ key: 'new-key.webp', contentType: 'image/webp' }),
    deleteImage: jest.fn().mockResolvedValue(undefined),
    readImage: jest.fn(),
    ...overrides,
  } as unknown as UploadsService;
}

describe('NodesService', () => {
  describe('create', () => {
    it('assigns order 0 for the first node in a journey', async () => {
      const repository = makeRepository({
        findMaxOrder: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation((data: Partial<JourneyNode>) =>
            Promise.resolve(makeNode(data)),
          ),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.create('journey-1', {
        title: 'Intro',
        content: '<p>Hi</p>',
      });

      expect(node.order).toBe(0);
    });

    it('assigns the next order after the current max', async () => {
      const repository = makeRepository({
        findMaxOrder: jest.fn().mockResolvedValue(3),
        create: jest
          .fn()
          .mockImplementation((data: Partial<JourneyNode>) =>
            Promise.resolve(makeNode(data)),
          ),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.create('journey-1', {
        title: 'Next',
        content: '<p>Hi</p>',
      });

      expect(node.order).toBe(4);
    });

    it('strips disallowed tags like script from content', async () => {
      const repository = makeRepository({
        create: jest
          .fn()
          .mockImplementation((data: Partial<JourneyNode>) =>
            Promise.resolve(makeNode(data)),
          ),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.create('journey-1', {
        title: 'Intro',
        content: '<p>Hello</p><script>alert(1)</script>',
      });

      expect(node.content).toBe('<p>Hello</p>');
    });

    it('passes ahaMoment through to the repository', async () => {
      const repository = makeRepository({
        create: jest
          .fn()
          .mockImplementation((data: Partial<JourneyNode>) =>
            Promise.resolve(makeNode(data)),
          ),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.create('journey-1', {
        title: 'Intro',
        content: '<p>Hi</p>',
        ahaMoment: 'The penny that drops.',
      });

      expect(node.ahaMoment).toBe('The penny that drops.');
    });
  });

  describe('update', () => {
    it('passes a changed ahaMoment through to the repository', async () => {
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(makeNode()),
        update: jest
          .fn()
          .mockImplementation((_id, data) => Promise.resolve(makeNode(data))),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.update('journey-1', 'node-1', {
        ahaMoment: 'Updated payoff.',
      });

      expect(node.ahaMoment).toBe('Updated payoff.');
    });

    it('clears ahaMoment when explicitly set to null', async () => {
      const repository = makeRepository({
        findById: jest
          .fn()
          .mockResolvedValue(makeNode({ ahaMoment: 'Old payoff.' })),
        update: jest
          .fn()
          .mockImplementation((_id, data) => Promise.resolve(makeNode(data))),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const node = await service.update('journey-1', 'node-1', {
        ahaMoment: null,
      });

      expect(node.ahaMoment).toBeNull();
    });
  });

  describe('reorder', () => {
    it('reorders when nodeIds exactly match the current nodes', async () => {
      const existing = [makeNode({ id: 'a' }), makeNode({ id: 'b' })];
      const reordered = [existing[1], existing[0]];
      const repository = makeRepository({
        findMany: jest.fn().mockResolvedValue(existing),
        reorder: jest.fn().mockResolvedValue(reordered),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const result = await service.reorder('journey-1', {
        nodeIds: ['b', 'a'],
      });

      expect(repository.reorder).toHaveBeenCalledWith('journey-1', ['b', 'a']);
      expect(result).toEqual(reordered);
    });

    it('rejects when nodeIds do not match the current nodes', async () => {
      const existing = [makeNode({ id: 'a' }), makeNode({ id: 'b' })];
      const repository = makeRepository({
        findMany: jest.fn().mockResolvedValue(existing),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      await expect(
        service.reorder('journey-1', { nodeIds: ['a'] }),
      ).rejects.toBeInstanceOf(InvalidNodeReorderException);
    });
  });

  describe('sources', () => {
    it('creates a source scoped to the node', async () => {
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(makeNode()),
        createSource: jest
          .fn()
          .mockImplementation((data) => Promise.resolve(makeSource(data))),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      const source = await service.createSource('node-1', {
        label: 'CDC — Vaccine Basics',
        url: 'https://example.com',
      });

      expect(source.label).toBe('CDC — Vaccine Basics');
    });

    it('rejects updating a source that belongs to a different node', async () => {
      const repository = makeRepository({
        findSourceById: jest
          .fn()
          .mockResolvedValue(makeSource({ nodeId: 'other-node' })),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      await expect(
        service.updateSource('node-1', 'source-1', { label: 'New label' }),
      ).rejects.toBeInstanceOf(SourceNotFoundException);
    });

    it('deletes a source that belongs to the node', async () => {
      const repository = makeRepository({
        findSourceById: jest.fn().mockResolvedValue(makeSource()),
        deleteSource: jest.fn().mockResolvedValue(makeSource()),
      });
      const service = new NodesService(
        repository,
        makeJourneysService(),
        makeUploadsService(),
      );

      await service.deleteSource('node-1', 'source-1');

      expect(repository.deleteSource).toHaveBeenCalledWith('source-1');
    });
  });

  describe('image', () => {
    it('deletes the previous image when uploading a replacement', async () => {
      const repository = makeRepository({
        findById: jest
          .fn()
          .mockResolvedValue(makeNode({ imageKey: 'old-key.webp' })),
        update: jest
          .fn()
          .mockImplementation((_id, data) => Promise.resolve(makeNode(data))),
      });
      const uploadsService = makeUploadsService();
      const service = new NodesService(
        repository,
        makeJourneysService(),
        uploadsService,
      );

      const node = await service.uploadImage(
        'node-1',
        Buffer.from('fake-image-bytes'),
      );

      expect(uploadsService.deleteImage).toHaveBeenCalledWith('old-key.webp');
      expect(node.imageKey).toBe('new-key.webp');
      expect(node.imageUrl).toBe('/uploads/new-key.webp');
    });

    it('does not attempt to delete a previous image when none exists', async () => {
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(makeNode({ imageKey: null })),
        update: jest
          .fn()
          .mockImplementation((_id, data) => Promise.resolve(makeNode(data))),
      });
      const uploadsService = makeUploadsService();
      const service = new NodesService(
        repository,
        makeJourneysService(),
        uploadsService,
      );

      await service.uploadImage('node-1', Buffer.from('fake-image-bytes'));

      expect(uploadsService.deleteImage).not.toHaveBeenCalled();
    });

    it('clears the image fields and deletes the file on removal', async () => {
      const repository = makeRepository({
        findById: jest
          .fn()
          .mockResolvedValue(makeNode({ imageKey: 'old-key.webp' })),
        update: jest
          .fn()
          .mockImplementation((_id, data) => Promise.resolve(makeNode(data))),
      });
      const uploadsService = makeUploadsService();
      const service = new NodesService(
        repository,
        makeJourneysService(),
        uploadsService,
      );

      const node = await service.removeImage('node-1');

      expect(uploadsService.deleteImage).toHaveBeenCalledWith('old-key.webp');
      expect(node.imageKey).toBeNull();
      expect(node.imageUrl).toBeNull();
    });
  });

  describe('findPublishedNodeByPosition', () => {
    it('returns the node at the given 1-based position', async () => {
      const nodeSummaries = [
        { id: 'node-1', title: 'Intro', order: 0 },
        { id: 'node-2', title: 'How it works', order: 1 },
      ];
      const repository = makeRepository({
        findById: jest.fn().mockResolvedValue(makeNode({ id: 'node-2' })),
      });
      const journeysService = makeJourneysService({
        findPublishedBySlug: jest.fn().mockResolvedValue({
          title: 'How Vaccines Work',
          slug: 'how-vaccines-work',
          nodes: nodeSummaries,
        }),
      });
      const service = new NodesService(
        repository,
        journeysService,
        makeUploadsService(),
      );

      const result = await service.findPublishedNodeByPosition(
        'how-vaccines-work',
        2,
      );

      expect(result.node.id).toBe('node-2');
      expect(result.totalNodes).toBe(2);
      expect(result.journeyTitle).toBe('How Vaccines Work');
    });

    it('rejects a position beyond the last node', async () => {
      const journeysService = makeJourneysService({
        findPublishedBySlug: jest.fn().mockResolvedValue({
          title: 'How Vaccines Work',
          slug: 'how-vaccines-work',
          nodes: [{ id: 'node-1', title: 'Intro', order: 0 }],
        }),
      });
      const service = new NodesService(
        makeRepository(),
        journeysService,
        makeUploadsService(),
      );

      await expect(
        service.findPublishedNodeByPosition('how-vaccines-work', 2),
      ).rejects.toBeInstanceOf(JourneyNodeNotFoundException);
    });

    it('rejects position 0', async () => {
      const journeysService = makeJourneysService({
        findPublishedBySlug: jest.fn().mockResolvedValue({
          title: 'How Vaccines Work',
          slug: 'how-vaccines-work',
          nodes: [{ id: 'node-1', title: 'Intro', order: 0 }],
        }),
      });
      const service = new NodesService(
        makeRepository(),
        journeysService,
        makeUploadsService(),
      );

      await expect(
        service.findPublishedNodeByPosition('how-vaccines-work', 0),
      ).rejects.toBeInstanceOf(JourneyNodeNotFoundException);
    });
  });
});
