import type {
  CreateDiscoveryLinkInput,
  DiscoveryLink,
  PublicDiscoveryLink,
  UpdateDiscoveryLinkInput,
} from "../types/discovery-link";

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

export function fetchDiscoveryLinks(nodeId: string): Promise<DiscoveryLink[]> {
  return request<DiscoveryLink[]>(`/nodes/${nodeId}/discovery-links`);
}

export function createDiscoveryLink(
  nodeId: string,
  input: CreateDiscoveryLinkInput,
): Promise<DiscoveryLink> {
  return request<DiscoveryLink>(`/nodes/${nodeId}/discovery-links`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateDiscoveryLink(
  nodeId: string,
  id: string,
  input: UpdateDiscoveryLinkInput,
): Promise<DiscoveryLink> {
  return request<DiscoveryLink>(`/nodes/${nodeId}/discovery-links/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteDiscoveryLink(nodeId: string, id: string): Promise<DiscoveryLink> {
  return request<DiscoveryLink>(`/nodes/${nodeId}/discovery-links/${id}`, {
    method: "DELETE",
  });
}

// Public reader fetch (Server Component — see app/journeys/[slug]/[position]).
// Returns [] on any non-OK response rather than throwing — the node itself
// is already validated by the parallel fetchPublicNode call on the same
// page, so a failure here should never block rendering the node's content.
export async function fetchNodeDiscoveryLinks(nodeId: string): Promise<PublicDiscoveryLink[]> {
  const response = await fetch(`${API_URL}/public/nodes/${nodeId}/discovery-links`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json() as Promise<PublicDiscoveryLink[]>;
}
