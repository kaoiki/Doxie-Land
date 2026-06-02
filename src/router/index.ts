import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'

import HomeView from '../pages/index.vue'
import LoginView from '../pages/LoginView.vue'
import RegisterView from '../pages/RegisterView.vue'
import ForgotView from '../pages/ForgotView.vue'
import ForumView from '../pages/ForumView.vue'
import TopicDetailView from '../pages/TopicDetailView.vue'
import ShopView from '../pages/ShopView.vue'
import ShopDetailView from '../pages/ShopDetailView.vue'
import AICareView from '../pages/AICareView.vue'
import KnowledgeView from '../pages/KnowledgeView.vue'
import ServicesView from '../pages/ServicesView.vue'
import ServicesDetailView from '../pages/ServicesDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'forum', name: 'forum', component: ForumView },
        { path: 'forum/:id', name: 'topic-detail', component: TopicDetailView, props: true },
        { path: 'shop', name: 'shop', component: ShopView },
        { path: 'shop/:id', name: 'shop-detail', component: ShopDetailView, props: true },
        { path: 'ai-care', name: 'ai-care', component: AICareView },
        { path: 'knowledge', name: 'knowledge', component: KnowledgeView },
        { path: 'services', name: 'services', component: ServicesView },
        { path: 'services/:id', name: 'service-detail', component: ServicesDetailView, props: true },
      ]
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        { path: 'login', name: 'login', component: LoginView },
        { path: 'register', name: 'register', component: RegisterView },
        { path: 'forgot', name: 'forgot', component: ForgotView }
      ]
    }
  ]
})

export default router