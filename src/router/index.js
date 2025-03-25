import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),

  },
  {
    path: '/canvas',
    component: () => import('../views/ScratchBook.vue'),
  },
  {
    path: '/snow',
    component: () => import('../views/SnowScraping.vue'),
  },
  {
    path: '/matter',
    component: () => import('../views/Matter.vue'),
  },
  {
    path: '/line',
    component: () => import('../views/LineDrawer.vue'),
  },
  {
    path: '/cards',
    component: () => import('../views/Cards.vue'),
  },
  {
    path: '/test',
    component: () => import('../views/Test.vue'),
  },
  {
    path: '/grid',
    component: () => import('../views/Grid.vue'),
  },
  {
    path: '/oblik-menu',
    component: () => import('../views/oblik/OblikMenu.vue'),
  },
  {
    path: '/planet',
    component: () => import('../views/Planet.vue'),
  },
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