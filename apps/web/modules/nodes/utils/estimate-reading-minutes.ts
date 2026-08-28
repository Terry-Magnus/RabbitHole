const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(nodes: { content: string }[]): number {
  const totalWords = nodes.reduce((sum, node) => {
    const text = node.content.replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean);
    return sum + words.length;
  }, 0);

  return Math.max(1, Math.round(totalWords / WORDS_PER_MINUTE));
}
