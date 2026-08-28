import type {
  CreateNodeInput,
  CreateSourceInput,
  JourneyNode,
  JourneyNodeWithSources,
  PublicNodeResponse,
  Source,
  UpdateNodeInput,
  UpdateSourceInput,
} from "../types/node";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message = Array.isArray(body)
      ? (body[0] as { message?: string } | undefined)?.message
      : (body as { message?: string } | null)?.message;
    throw new Error(message ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  return parseResponse<T>(response);
}

// Multipart upload — no Content-Type header is set here so the browser can
// fill in the multipart boundary itself; setting it manually breaks the upload.
async function uploadFile<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<T>(response);
}

export function fetchNodes(journeyId: string): Promise<JourneyNode[]> {
  return request<JourneyNode[]>(`/journeys/${journeyId}/nodes`);
}

export function fetchNode(
  journeyId: string,
  id: string,
): Promise<JourneyNodeWithSources> {
  return request<JourneyNodeWithSources>(`/journeys/${journeyId}/nodes/${id}`);
}

export function createNode(journeyId: string, input: CreateNodeInput): Promise<JourneyNode> {
  return request<JourneyNode>(`/journeys/${journeyId}/nodes`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateNode(
  journeyId: string,
  id: string,
  input: UpdateNodeInput,
): Promise<JourneyNode> {
  return request<JourneyNode>(`/journeys/${journeyId}/nodes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteNode(journeyId: string, id: string): Promise<JourneyNode> {
  return request<JourneyNode>(`/journeys/${journeyId}/nodes/${id}`, {
    method: "DELETE",
  });
}

export function reorderNodes(journeyId: string, nodeIds: string[]): Promise<JourneyNode[]> {
  return request<JourneyNode[]>(`/journeys/${journeyId}/nodes/reorder`, {
    method: "POST",
    body: JSON.stringify({ nodeIds }),
  });
}

export function fetchSources(nodeId: string): Promise<Source[]> {
  return request<Source[]>(`/nodes/${nodeId}/sources`);
}

export function createSource(nodeId: string, input: CreateSourceInput): Promise<Source> {
  return request<Source>(`/nodes/${nodeId}/sources`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateSource(
  nodeId: string,
  id: string,
  input: UpdateSourceInput,
): Promise<Source> {
  return request<Source>(`/nodes/${nodeId}/sources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteSource(nodeId: string, id: string): Promise<Source> {
  return request<Source>(`/nodes/${nodeId}/sources/${id}`, {
    method: "DELETE",
  });
}

export function uploadNodeImage(nodeId: string, file: File): Promise<JourneyNode> {
  return uploadFile<JourneyNode>(`/nodes/${nodeId}/image`, file);
}

export function removeNodeImage(nodeId: string): Promise<JourneyNode> {
  return request<JourneyNode>(`/nodes/${nodeId}/image`, {
    method: "DELETE",
  });
}

// Public reader fetch (Server Component — see app/journeys/[slug]/[position]).
// Returns null on 404 so the page can call Next's notFound() itself.
export async function fetchPublicNode(
  slug: string,
  position: number,
): Promise<PublicNodeResponse | null> {
  const response = await fetch(`${API_URL}/public/journeys/${slug}/nodes/${position}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<PublicNodeResponse>;
}
