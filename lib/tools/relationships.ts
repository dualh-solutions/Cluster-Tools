import { ToolDefinition } from "./types";
import { getToolById, getAllTools } from "./registry";

export function getRelatedTools(tool: ToolDefinition, limit: number = 4): ToolDefinition[] {
  const related: ToolDefinition[] = [];
  const seenIds = new Set<string>();
  seenIds.add(tool.id); // Don't recommend itself

  const addTool = (id: string) => {
    if (related.length >= limit) return;
    if (seenIds.has(id)) return;
    
    const t = getToolById(id);
    if (t && t.status === "live") {
      related.push(t);
      seenIds.add(id);
    }
  };

  // 1. Explicit relationships
  if (tool.relatedTools) {
    tool.relatedTools.forEach(addTool);
  }

  const allTools = getAllTools();

  // 2. Category-based relationships
  allTools
    .filter(t => t.category === tool.category)
    .forEach(t => addTool(t.id));

  // 3. Tool-type relationships
  allTools
    .filter(t => t.toolType === tool.toolType)
    .forEach(t => addTool(t.id));

  // 4. Keyword-based relationships (if we still need more)
  if (related.length < limit && tool.keywords && tool.keywords.length > 0) {
    // Simple intersection of keywords
    const toolsWithScores = allTools.map(t => {
      if (seenIds.has(t.id)) return { id: t.id, score: -1 };
      let score = 0;
      t.keywords?.forEach(k => {
        if (tool.keywords.includes(k)) score++;
      });
      return { id: t.id, score };
    });

    toolsWithScores
      .filter(t => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach(t => addTool(t.id));
  }

  return related.slice(0, limit);
}
