import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://clustertools.online/sitemap.xml',
  };
}
