import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),

  },
  {
    path: '/canvas',
    component: () => import('../views/CanvasScraping.vue'),
  },
  {
    path: '/snow',
    component: () => import('../views/SnowScraping.vue'),
  },
  {
    path: '/matter',
    component: () => import('../views/Matter.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // return { top: 0 }
    // time out to wait for the transition
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ top: 0, behavior: 'smooth' })
      }, 300)
    })
  }
})

export default router