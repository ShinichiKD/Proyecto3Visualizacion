import { createRouter, createWebHistory } from 'vue-router';
/* import Home from '../components/home.vue';
import Dev from '../components/dev.vue'; */
import  cargarTablas from '../components/cargardatos.vue';
// Definir rutas
const routes = [
  
    {
      path: '/tablas',
      name: 'tablas',
      component: cargarTablas
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
