const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.resolve(__dirname, '..');
const EXPORT_DIR = path.resolve(__dirname, '../../downloader-tools-export');

const EXCLUDE_DIRS = ['.git', 'node_modules', '.next', '.gemini', 'scripts/export-downloader.js'];

// Helpers
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (EXCLUDE_DIRS.some(dir => src.endsWith(path.normalize(dir)))) {
    return;
  }

  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Starting export...');
if (fs.existsSync(EXPORT_DIR)) {
  fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(EXPORT_DIR, { recursive: true });

console.log('Copying files (this may take a moment)...');
copyRecursiveSync(SOURCE_DIR, EXPORT_DIR);

console.log('Filtering categories.ts...');
const categoriesFile = path.join(EXPORT_DIR, 'lib/tools/categories.ts');
let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
categoriesContent = `import { CategoryDefinition } from "./types";

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "downloader",
    slug: "downloader",
    name: "Social Media Downloaders",
    description: "Download videos and media from various social platforms.",
    lastModified: "2026-08-24T00:00:00.000Z",
  }
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
`;
fs.writeFileSync(categoriesFile, categoriesContent);

console.log('Filtering registry.ts...');
const registryFile = path.join(EXPORT_DIR, 'lib/tools/registry.ts');
const registryOriginalContent = fs.readFileSync(registryFile, 'utf8');
const DOWNLOADER_IDS = [
  'youtube-downloader',
  'instagram-video-downloader',
  'tiktok-video-downloader',
  'twitter-video-downloader',
  'facebook-video-downloader',
  'reddit-video-downloader',
  'pinterest-video-downloader',
  'youtube-to-mp3',
  'youtube-thumbnail-downloader'
];

// Re-write registry manually keeping imports and specific tools
const newRegistryContent = `import { ToolDefinition } from './types';
import { SocialMediaDownloaderTool } from '@/components/tools/interfaces/SocialMediaDownloaderTool';
import { YoutubeToMp3Tool } from '@/components/tools/interfaces/YoutubeToMp3Tool';
import { YoutubeThumbnailDownloaderTool } from '@/components/tools/interfaces/YoutubeThumbnailDownloaderTool';

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: "youtube-downloader",
    slug: "youtube-downloader",
    name: "YouTube Video Downloader",
    shortName: "YouTube Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["youtube", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "YouTube Video Downloader | Download Free | Cluster Tools",
    description: "Download videos and shorts from YouTube in high quality directly to your device.",
    keywords: ["youtube downloader", "youtube video downloader", "download youtube video", "youtube shorts downloader", "download mp4"],
    aliases: ["video downloader", "youtube downloader"],
    searchTerms: ["youtube", "download", "video", "mp4", "shorts"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "instagram-video-downloader",
    slug: "instagram-video-downloader",
    name: "Instagram Video Downloader",
    shortName: "Instagram Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["instagram", "download", "video", "reels", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "Instagram Video & Reels Downloader | Download Free | Cluster Tools",
    description: "Download videos and reels from Instagram directly to your device.",
    keywords: ["instagram downloader", "reels downloader", "download instagram video"],
    aliases: ["ig downloader", "instagram reel downloader"],
    searchTerms: ["instagram", "download", "video", "reels", "ig"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "tiktok-video-downloader",
    slug: "tiktok-video-downloader",
    name: "TikTok Video Downloader",
    shortName: "TikTok Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["tiktok", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "TikTok Video Downloader | Download Free | Cluster Tools",
    description: "Download TikTok videos quickly and easily without any hassle.",
    keywords: ["tiktok downloader", "download tiktok video", "save tiktok"],
    aliases: ["tiktok saver"],
    searchTerms: ["tiktok", "download", "video", "save"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "twitter-video-downloader",
    slug: "twitter-video-downloader",
    name: "Twitter Video Downloader",
    shortName: "Twitter Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["twitter", "x", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "Twitter (X) Video Downloader | Download Free | Cluster Tools",
    description: "Download videos from Twitter (X) in high quality to your device.",
    keywords: ["twitter downloader", "x video downloader", "download twitter video"],
    aliases: ["x downloader", "twitter video saver"],
    searchTerms: ["twitter", "x", "download", "video"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "facebook-video-downloader",
    slug: "facebook-video-downloader",
    name: "Facebook Video Downloader",
    shortName: "Facebook Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["facebook", "fb", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "Facebook Video Downloader | Download Free | Cluster Tools",
    description: "Download Facebook videos, reels, and clips directly to your device.",
    keywords: ["facebook downloader", "fb video downloader", "download facebook video"],
    aliases: ["fb downloader", "facebook video saver"],
    searchTerms: ["facebook", "fb", "download", "video", "reels"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "reddit-video-downloader",
    slug: "reddit-video-downloader",
    name: "Reddit Video Downloader",
    shortName: "Reddit Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["reddit", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "Reddit Video Downloader | Download Free | Cluster Tools",
    description: "Download Reddit videos with audio directly to your device.",
    keywords: ["reddit downloader", "download reddit video", "reddit video with audio"],
    aliases: ["reddit saver"],
    searchTerms: ["reddit", "download", "video", "audio"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "pinterest-video-downloader",
    slug: "pinterest-video-downloader",
    name: "Pinterest Video Downloader",
    shortName: "Pinterest Downloader",
    category: "downloader",
    toolType: "downloader",
    tags: ["pinterest", "download", "video", "social media"],
    componentKey: "SocialMediaDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [],
    outputTypes: ["video/mp4"],
    outputFormats: [".mp4"],
    title: "Pinterest Video Downloader | Download Free | Cluster Tools",
    description: "Download Pinterest videos and idea pins quickly and easily.",
    keywords: ["pinterest downloader", "download pinterest video", "pinterest pin downloader"],
    aliases: ["pinterest saver"],
    searchTerms: ["pinterest", "download", "video", "pin"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  },
  {
    id: "youtube-to-mp3",
    slug: "youtube-to-mp3",
    name: "YouTube to MP3",
    shortName: "YT to MP3",
    category: "downloader",
    toolType: "downloader",
    tags: ["youtube", "mp3", "audio", "music", "converter", "extract"],
    componentKey: "YoutubeToMp3Tool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [".txt"],
    outputTypes: ["audio/mpeg"],
    outputFormats: [".mp3"],
    title: "YouTube to MP3 Converter | Extract Audio Free | Cluster Tools",
    description: "Convert and download high-quality MP3 audio from any YouTube video instantly. No registration required, fast and free.",
    keywords: ["youtube to mp3", "yt to mp3", "youtube audio extractor", "download youtube music", "youtube to mp3 converter"],
    aliases: ["yt to mp3 converter", "youtube mp3 extractor"],
    searchTerms: ["youtube", "mp3", "audio", "music", "convert", "extract", "download"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    popular: true,
    faqs: []
  },
  {
    id: "youtube-thumbnail-downloader",
    slug: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnail Downloader",
    shortName: "YT Thumbnail",
    category: "downloader",
    toolType: "downloader",
    tags: ["youtube", "thumbnail", "image", "hq", "hd", "download"],
    componentKey: "YoutubeThumbnailDownloaderTool",
    processingMode: "server",
    inputTypes: ["text/plain"],
    inputFormats: [".txt"],
    outputTypes: ["image/jpeg"],
    outputFormats: [".jpg"],
    title: "YouTube Thumbnail Downloader | Get HD Thumbnails | Cluster Tools",
    description: "Download high-quality (HD) thumbnails from any YouTube video instantly. Perfect for SEO and content creators.",
    keywords: ["youtube thumbnail downloader", "download youtube thumbnail", "get youtube thumbnail", "youtube hd thumbnail"],
    aliases: ["yt thumbnail saver", "youtube image downloader"],
    searchTerms: ["youtube", "thumbnail", "image", "cover", "picture", "download"],
    status: "live",
    lastModified: "2026-08-24T00:00:00.000Z",
    faqs: []
  }
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.id === id);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.slug === slug);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter(t => t.category === categoryId);
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS_REGISTRY;
}

export function getToolUrl(tool: ToolDefinition): string {
  return \`/tools/\${tool.category}/\${tool.slug}\`;
}
`;
fs.writeFileSync(registryFile, newRegistryContent);

console.log('Cleaning up interfaces...');
const interfacesDir = path.join(EXPORT_DIR, 'components/tools/interfaces');
const KEEP_INTERFACES = ['SocialMediaDownloaderTool.tsx', 'YoutubeToMp3Tool.tsx', 'YoutubeThumbnailDownloaderTool.tsx'];
fs.readdirSync(interfacesDir).forEach(file => {
  if (!KEEP_INTERFACES.includes(file)) {
    fs.rmSync(path.join(interfacesDir, file), { recursive: true, force: true });
  }
});

console.log('Cleaning up MDX content...');
const mdxDir = path.join(EXPORT_DIR, 'content/tools');
const KEEP_MDX = [
  'youtube-downloader.mdx',
  'instagram-video-downloader.mdx',
  'tiktok-video-downloader.mdx',
  'twitter-video-downloader.mdx',
  'facebook-video-downloader.mdx',
  'reddit-video-downloader.mdx',
  'pinterest-video-downloader.mdx',
  'youtube-to-mp3.mdx',
  'youtube-thumbnail-downloader.mdx'
];
fs.readdirSync(mdxDir).forEach(file => {
  if (!KEEP_MDX.includes(file) && fs.statSync(path.join(mdxDir, file)).isFile()) {
    fs.rmSync(path.join(mdxDir, file), { force: true });
  }
});

console.log('Cleaning up API routes...');
const apiDir = path.join(EXPORT_DIR, 'app/api');
const KEEP_API = ['download', 'poll', 'merge-download'];
fs.readdirSync(apiDir).forEach(dir => {
  if (!KEEP_API.includes(dir) && fs.statSync(path.join(apiDir, dir)).isDirectory()) {
    fs.rmSync(path.join(apiDir, dir), { recursive: true, force: true });
  }
});

console.log('Pruning package.json...');
const packageJsonFile = path.join(EXPORT_DIR, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
pkg.name = 'downloader-tools';
pkg.description = 'Standalone Next.js downloader tools project';

// Remove dependencies not used by downloander
const depsToRemove = ['heic2any', 'pdf-lib', 'pdfjs-dist', 'react-image-crop', 'gsap'];
depsToRemove.forEach(dep => delete pkg.dependencies[dep]);
fs.writeFileSync(packageJsonFile, JSON.stringify(pkg, null, 2));

console.log('Zipping...');
execSync('powershell -Command "Compress-Archive -Path \\"../downloader-tools-export/*\\" -DestinationPath \\"../downloader-tools.zip\\" -Force"', { cwd: __dirname });

console.log('Done!');
