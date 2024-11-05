export class Router {
  constructor(routes) {
    this.routes = routes;
    this.app = document.getElementById('app');

    // Cambiar a hash change en lugar de popstate
    window.addEventListener('hashchange', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-navigate]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        this.navigate(href);
      }
    });

    // Manejar la ruta inicial
    this.handleRoute();
  }

  async handleRoute() {
    // Obtener la ruta del hash en lugar de pathname
    const hash = window.location.hash.slice(1) || '/';
    let match = this.findMatchingRoute(hash);

    // Si no hay match, usar la ruta 404
    if (!match) {
      match = {
        route: this.routes.find((route) => route.path === '*'),
        params: {},
      };
    }

    // Actualizar navegación activa
    this.updateActiveNav();

    // Renderizar la vista
    if (match.route.component) {
      try {
        // Esperar a que el componente se resuelva si es una promesa
        const view = await Promise.resolve(match.route.component(match.params));
        this.app.innerHTML = view;
      } catch (error) {
        console.error('Error al renderizar la vista:', error);
        this.app.innerHTML = 'Error al cargar la vista';
      }
    }
  }

  findMatchingRoute(hash) {
    // Buscar rutas dinámicas primero
    for (const route of this.routes) {
      if (route.path.includes(':')) {
        const routeParts = route.path.split('/');
        const pathParts = hash.split('/');

        if (routeParts.length === pathParts.length) {
          const params = {};
          let isMatch = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              isMatch = false;
              break;
            }
          }

          if (isMatch) {
            return { route, params };
          }
        }
      }
    }

    // Si no hay match con rutas dinámicas, buscar rutas exactas
    return {
      route: this.routes.find((route) => route.path === hash),
      params: {},
    };
  }

  navigate(url) {
    // Cambiar a hash navigation
    window.location.hash = url;
  }

  updateActiveNav() {
    const currentPath = window.location.hash.slice(1) || '/';
    document.querySelectorAll('nav a').forEach((link) => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

