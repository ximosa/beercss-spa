import { fetchBloggerPosts, slugify } from './blog-utils.js';

export async function Post(params) {
  let post = null;
  let loading = true;
  let error = null;

  // Mostrar el loader al inicio
  const loader = document.getElementById('post-loader');
  if (loader) {
    loader.style.display = 'block';
  }

  try {
    const postId = params.id.split('-').pop();

    // Obtener solo el post específico
    const data = await fetchBloggerPosts(null, null, postId); // Pasar el postId como tercer argumento
    post = data.posts[0]; // El post estará en el primer elemento del array

    if (!post) {
      error = 'Post no encontrado';
    }
  } catch (err) {
    error = err.message;
  } finally {
    loading = false;

    // Ocultar el loader después de que el contenido se haya cargado
    if (loader) {
      loader.style.display = 'none';
    }

    // Desplazar al inicio de la página después de que el contenido se haya cargado
    window.scrollTo(0, 0);
  }

  return `
    <div class="large-space"></div>
    <div id="post-view" style="max-width: 800px; margin: auto;">
      <div id="post-loader" style="display: none;">Cargando...</div>
      <div class="responsive large-padding extra-line large-text">
        ${error ? `<p class="error">${error}</p>` : ''}
        ${post ? `
          <h1 class="small">${post.title}</h1>
          <div>${post.content}</div>
        <div class="large-space"></div>
         <a class="button responsive secondary large-elevate large" href="/blog" data-navigate onclick="event.preventDefault(); history.pushState(null, '', '/blog'); window.scrollTo({ top: 0, behavior: 'smooth' });"> ← Volver al blog</a>
        ` : ''}
      </div>
    </div>
  `;
}



