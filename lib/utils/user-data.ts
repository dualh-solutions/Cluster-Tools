import { TOOLS_REGISTRY } from "../tools/registry";

const RECENT_TOOLS_KEY = "pressto_recent_tools";
const FAVORITE_TOOLS_KEY = "pressto_favorite_tools";
const MAX_RECENT = 10;

/**
 * Filter list of IDs against the active registry to ensure we don't return obsolete tools.
 */
function getValidToolIds(ids: string[]): string[] {
  return ids.filter(id => TOOLS_REGISTRY.some(tool => tool.id === id));
}

function safeGet(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return getValidToolIds(parsed);
    }
  } catch (e) {
    console.warn(`Failed to parse localStorage key ${key}`, e);
  }
  return [];
}

function safeSet(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage key ${key}`, e);
  }
}

// ----------------------------------------------------
// Recently Used
// ----------------------------------------------------

export function getRecentTools(): string[] {
  return safeGet(RECENT_TOOLS_KEY);
}

export function saveRecentTool(toolId: string) {
  const current = getRecentTools();
  const filtered = current.filter(id => id !== toolId);
  const updated = [toolId, ...filtered].slice(0, MAX_RECENT);
  safeSet(RECENT_TOOLS_KEY, updated);
}

// ----------------------------------------------------
// Favorites
// ----------------------------------------------------

export function getFavoriteTools(): string[] {
  return safeGet(FAVORITE_TOOLS_KEY);
}

export function toggleFavoriteTool(toolId: string): boolean {
  const current = getFavoriteTools();
  const isFavorited = current.includes(toolId);
  
  let updated;
  if (isFavorited) {
    updated = current.filter(id => id !== toolId);
  } else {
    updated = [...current, toolId];
  }
  
  safeSet(FAVORITE_TOOLS_KEY, updated);
  return !isFavorited;
}

export function isFavorite(toolId: string): boolean {
  return getFavoriteTools().includes(toolId);
}
