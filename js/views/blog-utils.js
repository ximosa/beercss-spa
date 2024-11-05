const API_KEY = 'AIzaSyBFBbH1SQkSZf1LJzammWAe2karh5mG9rQ';
const BLOG_ID = '2756493429384988662';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function extractFirstImage(content) {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

function getExcerpt(content, length = 150) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";
  return plainText.substring(0, length) + "...";
}

async function fetchBloggerPosts(token, category, postId) {
  try {
    let url;
    if (postId) {
      // Si se proporciona un postId, obtener solo ese post
      url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}`);
    } else {
      // Si no se proporciona un postId, obtener la lista de posts
      url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`);
      url.searchParams.append('maxResults', '10');
      if (token) url.searchParams.append('pageToken', token);
      if (category) url.searchParams.append('labels', category);
    }

    url.searchParams.append('key', API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Error al obtener los posts');

    const data = await response.json();

    let newPosts;
    if (postId) {
      // Si se está obteniendo un solo post, no es necesario mapearlo
      newPosts = [data];
    } else {
      // Si se está obteniendo una lista de posts, mapearlos como antes
      newPosts = (data.items || []).map((post) => ({
        ...post,
        slug: `${slugify(post.title)}-${post.id}`,
        images: [extractFirstImage(post.content)].filter(Boolean),
      }));
    }

    return {
      posts: newPosts,
      nextPageToken: data.nextPageToken,
    };
  } catch (err) {
    console.error('Error:', err);
    throw err; // Propaga el error para manejarlo en la vista
  }
}
export { 
  fetchBloggerPosts, 
  slugify, 
  extractFirstImage, 
  getExcerpt 
};
