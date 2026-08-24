import { TOOLS_REGISTRY } from "@/lib/tools/registry";
import { NextResponse } from "next/server";

export async function GET() {
  const activeTools = TOOLS_REGISTRY.filter(tool => tool.status === 'live');
  
  let content = `# Cluster Tools\n\n`;
  content += `> Cluster Tools builds fast, free, privacy-first file tools that run entirely in your browser. No servers, no uploads, no data collected.\n\n`;
  
  content += `## Available Tools\n\n`;
  
  activeTools.forEach(tool => {
    content += `- [${tool.name}](https://clustertools.online/tools/${tool.category}/${tool.slug}): ${tool.description}\n`;
  });

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
