// Mirrors apps/web/modules/nodes/utils/estimate-reading-minutes.ts exactly.
// Computed here (not shipped node content to the client) specifically for the
// public journey landing page, whose payload deliberately excludes full node
// content to stay light — see journeys.repository.ts.
const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(nodeContents: string[]): number {
  const totalWords = nodeContents.reduce((sum, content) => {
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean);
    return sum + words.length;
  }, 0);

  return Math.max(1, Math.round(totalWords / WORDS_PER_MINUTE));
}
