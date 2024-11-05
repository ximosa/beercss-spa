import { fetchBloggerPosts, getExcerpt } from './blog-utils.js';

// Declara nextPageToken como una variable global
let nextPageToken = null;
let loading = true; // Variable global para el estado de carga

// Función para cargar más posts (ahora global)
async function loadMorePosts() {
  if (loading || !nextPageToken) return;

  loading = true;
  try {
    const data = await fetchBloggerPosts(nextPageToken);
    const postsContainer = document.getElementById('posts');

    // Iterar sobre los nuevos posts y crear elementos HTML
    data.posts.forEach(post => {
      // Crear el elemento div principal
      const postDiv = document.createElement('div');

      // Crear el elemento h2 para el título
      const titleH2 = document.createElement('h2');
      titleH2.classList.add('large-text', 'primary-text', 'center-align');
      const titleLink = document.createElement('a');
      titleLink.href = `/blog/${post.slug}`;
      titleLink.textContent = post.title;
      titleLink.setAttribute('data-navigate', '');
      titleH2.appendChild(titleLink);
      postDiv.appendChild(titleH2);

      // Crear el elemento div para la imagen (si existe)
      if (post.images[0]) {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('left');
        const imageLink = document.createElement('a');
        imageLink.href = `./#/blog/${post.slug}`;
        imageLink.setAttribute('data-navigate', '');
        const image = document.createElement('img');
        image.classList.add('circle', 'extra');
        image.src = post.images[0];
        image.alt = post.title;
        imageLink.appendChild(image);
        imageDiv.appendChild(imageLink);
        postDiv.appendChild(imageDiv);
      }

      // Crear el elemento div para el extracto
      const excerptDiv = document.createElement('div');
      excerptDiv.textContent = getExcerpt(post.content);
      postDiv.appendChild(excerptDiv);

      // Crear el elemento div para el enlace "Leer más"
      const readMoreDiv = document.createElement('div');
      readMoreDiv.classList.add('max');
      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('link');
      readMoreLink.href = `/blog/${post.slug}`;
      readMoreLink.textContent = 'Leer más ';
      readMoreLink.setAttribute('data-navigate', '');
      const arrowIcon = document.createElement('i');
      arrowIcon.textContent = 'arrow_forward';
      readMoreLink.appendChild(arrowIcon);
      readMoreDiv.appendChild(readMoreLink);
      postDiv.appendChild(readMoreDiv);

      // Crear el elemento hr
      const hr = document.createElement('hr');
      hr.classList.add('large');
      postDiv.appendChild(hr);

      // Crear el elemento div para el espacio
      const spaceDiv = document.createElement('div');
      spaceDiv.classList.add('large-space');
      postDiv.appendChild(spaceDiv);

      // Agregar el nuevo post al contenedor
      postsContainer.appendChild(postDiv);
    });

    nextPageToken = data.nextPageToken; // Actualiza la variable global
    // Oculta el botón si no hay más posts
    const loadMoreButton = document.getElementById("load-more");
    if (loadMoreButton) {
      loadMoreButton.style.display = nextPageToken ? "block" : "none";
    }
  } catch (err) {
    console.error('Error al cargar más posts:', err);
  } finally {
    loading = false;
  }
}

export async function Blog() {
  let posts = [];
  let categories = [];
  let error = null;

  try {
    const data = await fetchBloggerPosts();
    posts = data.posts;
    nextPageToken = data.nextPageToken; // Actualiza la variable global

    // Obtener categorías únicas de los posts
    const allLabels = new Set();
    posts.forEach((post) => {
      (post.labels || []).forEach((label) => allLabels.add(label));
    });
    categories = Array.from(allLabels);
  } catch (err) {
    error = err.message;
  } finally {
    loading = false;
  }

  // Función para filtrar por categoría
  window.filterByCategory = async function(category) {
    loading = true;
    try {
      const data = await fetchBloggerPosts(null, category); // Pasa la categoría a fetchBloggerPosts
      posts = data.posts;
      nextPageToken = data.nextPageToken;

      // Actualiza la vista con los posts filtrados
      const postsContainer = document.getElementById('posts');
      postsContainer.innerHTML = posts.map(post => `
        <div>
            <h2 class="large-text primary-text center-align">
                <a href="/blog/${post.slug}" data-navigate>${post.title}</a>
            </h2>
            <div class="center-align">
                ${post.images[0] ? `<a href="./#/blog/${post.slug}" data-navigate><img  class="circle extra" src="${post.images[0]}" alt="${post.title}" /></a>` : ''}
            </div>
            <div>
                ${getExcerpt(post.content)}
            </div>
            <div class="right-align">
                <a class="link" href="/blog/${post.slug}" data-navigate>Leer más <i>arrow_forward</i></a>
            </div>
            <hr class="large">      
        </div>
        <div class="large-space"></div>
    `).join('');

      // Actualiza el botón "Cargar más"
      const loadMoreButton = document.getElementById("load-more");
      if (loadMoreButton) {
        loadMoreButton.style.display = nextPageToken ? "block" : "none";
      }
    } catch (err) {
      console.error('Error al filtrar por categoría:', err);
    } finally {
      loading = false;
    }
  }

  // Renderiza el HTML del blog
  const blogHTML = `
    <div id="blog-view" class="responsive large-padding">
      <h1 class="large-text primary-text center-align">Webgae Blog</h1>
      <hr class="medium">
      <div id="error-message" class="card error center-align" style="display: none;">
        <p class="error-text"></p>
        <button id="retry-button" class="button primary">Intentar de nuevo</button>
      </div>
      <div id="categories" class="center-align middle-align">
        ${categories.map(category => `
          <button class="transparent" onclick="filterByCategory('${category}')">${category}</button>
        `).join('')}
      </div>
      <div id="posts" class="large-padding" style="max-width: 800px; margin: auto;">
        ${posts.map(post => `
          <div>
            <h2 class="large-text primary-text center-align">
              <a href="/blog/${post.slug}" data-navigate>${post.title}</a>
            </h2>
<div class="small-space"></div>
            <div class="center-align">
              ${post.images[0] ? `<a href="./#/blog/${post.slug}" data-navigate><img  class="circle extra" src="${post.images[0]}" alt="${post.title}" /></a>` : ''}
            </div>
            <div>
              ${getExcerpt(post.content)}
            </div>
 
            <div class="right-align">
              <a class="link" href="/blog/${post.slug}" data-navigate>Leer más <i>arrow_forward</i></a>
            </div>
            <hr class="large">      
          </div>
          <div class="large-space"></div>
        `).join('')}
      </div>
      <div id="loading" class="center-align" style="display: ${loading ? 'block' : 'none'}">
        <p>Cargando posts...</p><progress class="circle small"></progress>
      </div>
      <div id="load-more" class="center-align" style="display: ${nextPageToken ? 'block' : 'none'}">
        <button class="button large secondary round">Cargar más posts</button>
      </div>
    </div>
  `;

  // Agrega el event listener al botón "Cargar más" después de que el HTML se haya renderizado
  setTimeout(() => {
    const loadMoreButton = document.querySelector('#load-more button');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', loadMorePosts);
    }
  }, 0);

  return blogHTML;
}
