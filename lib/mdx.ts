import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'tools');

export interface ToolMDXContent {
  source: string;
  frontmatter: Record<string, any>;
}

/**
 * Reads a tool's MDX file if it exists, parsing the frontmatter and content.
 * Returns null if the file doesn't exist.
 */
export function getToolMDXContent(slug: string): ToolMDXContent | null {
  try {
    const fullPath = path.join(CONTENT_PATH, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      source: content,
      frontmatter: data,
    };
  } catch (error) {
    console.error(`Error reading MDX for tool ${slug}:`, error);
    return null;
  }
}
