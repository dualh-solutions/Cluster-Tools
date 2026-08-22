import { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/tools/registry';
import { CATEGORIES } from '@/lib/tools/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cluster-tools.dev';
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const tools: MetadataRoute.Sitemap = getAllTools()
    .filter(t => t.status === 'live')
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
      lastModified: tool.lastModified ? new Date(tool.lastModified) : new Date(),
      changeFrequency: 'weekly',
      priority: tool.popular ? 0.9 : 0.7,
    }));

  return [...staticRoutes, ...categories, ...tools];
}
