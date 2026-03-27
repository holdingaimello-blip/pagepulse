// Bluesky API Gateway for PagePulse
// Auto-posting with @atproto/api

import { BskyAgent, RichText } from '@atproto/api';

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

export async function postToBluesky(content: string, link?: string) {
  try {
    // Login with app password
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE!, // e.g., pagepulse.bsky.social
      password: process.env.BLUESKY_APP_PASSWORD! // app-specific password
    });

    let embed = undefined;
    
    // If link provided, create link card
    if (link) {
      const response = await fetch(link);
      const html = await response.text();
      
      // Extract OG data
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
      const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
      
      const title = titleMatch?.[1] || 'PagePulse';
      const description = descMatch?.[1] || 'AI-powered competitor monitoring';
      
      let thumb = undefined;
      if (imageMatch?.[1]) {
        const imageRes = await fetch(imageMatch[1]);
        const imageBlob = await imageRes.blob();
        const upload = await agent.uploadBlob(imageBlob, { encoding: 'image/jpeg' });
        thumb = upload.data.blob;
      }
      
      embed = {
        $type: 'app.bsky.embed.external',
        external: {
          uri: link,
          title,
          description,
          thumb
        }
      };
    }

    // Create rich text with facets
    const rt = new RichText({ text: content });
    await rt.detectFacets(agent);

    // Post
    const post = await agent.post({
      text: rt.text,
      facets: rt.facets,
      embed,
      createdAt: new Date().toISOString()
    });

    return { success: true, uri: post.uri, cid: post.cid };
  } catch (error) {
    console.error('Bluesky post error:', error);
    return { success: false, error: error.message };
  }
}

// Example usage:
// await postToBluesky(
//   "Just launched PagePulse v2! AI-powered competitor monitoring in 10 seconds 🚀",
//   "https://pagepulse-v2.vercel.app"
// );
