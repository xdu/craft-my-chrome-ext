import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '../view/FeedView.vue'
import ArticleView from '../view/ArticleView.vue'
import ConfigView from '../view/ConfigView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: FeedView
  },
  {
    path: '/article',
    name: 'article',
    component: ArticleView
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigView
  }
]

// Set the base to popup.html to avoid the warning of VueRouter : no match found
// for location with path 'popup.html'.
const router = createRouter({
  history: createWebHistory('/popup.html'),
  routes
})

export default router
