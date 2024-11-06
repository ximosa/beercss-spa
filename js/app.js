import { Router } from './router.js';
import { Home } from './views/home.js';
import { About } from './views/about.js';
import { Contact } from './views/contact.js';
import { Blog } from './views/blog.js';
import { Post } from './views/post.js';
import { NotFound } from './views/notFound.js';
import { Precios } from './views/precios.js';

const router = new Router([
    { path: '/', component: Home },
    { path: '/sobre-mi', component: About },
    { path: '/contacto', component: Contact },
    { path: '/blog', component: Blog },
    { path: '/blog/:id', component: Post },
    { path: '/precios', component: Precios },
    { path: '*', component: NotFound }
]);
