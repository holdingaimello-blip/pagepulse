// Mastodon API Gateway for PagePulse
// Auto-posting with native fetch

const MASTODON_INSTANCE = process.env.MASTODON_INSTANCE || 'https://mastodon.social';
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;

export async function postToMastodon(content: string, options?: {
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  mediaIds?: string[];
}) {
  try {
    if (!MASTODON_ACCESS_TOKEN) {
      throw new Error('Mastodon access token not configured');
    }

    const response = await fetch(`${MASTODON_INSTANCE}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: content,
        visibility: options?.visibility || 'public',
        media_ids: options?.mediaIds || [],
        language: 'en'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Mastodon API error');
    }

    const data = await response.json();
    return { 
      success: true, 
      id: data.id,
      url: data.url,
      uri: data.uri
    };
  } catch (error) {
    console.error('Mastodon post error:', error);
    return { success: false, error: error.message };
  }
}

// Upload media to Mastodon
export async function uploadMediaToMastodon(file: Blob, description?: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${MASTODON_INSTANCE}/api/v1/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Media upload failed');
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Mastodon media upload error:', error);
    return { success: false, error: error.message };
  }
}

// Example usage:
// await postToMastodon(
//   "Just launched PagePulse v2! AI-powered competitor monitoring in 10 seconds 🚀\n\nhttps://pagepulse-v2.vercel.app",
//   { visibility: 'public' }
// );
