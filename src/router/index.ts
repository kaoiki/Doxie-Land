import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'

import HomeView from '../pages/index.vue'
import LoginView from '../pages/LoginView.vue'
import RegisterView from '../pages/RegisterView.vue'
import ForgotView from '../pages/ForgotView.vue'
import ForumView from '../pages/ForumView.vue'
import ShopView from '../pages/ShopView.vue'
import AICareView from '../pages/AICareView.vue'
import KnowledgeView from '../pages/KnowledgeView.vue'
import ProfilesView from '../pages/ProfilesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'forum', name: 'forum', component: ForumView },
        { path: 'shop', name: 'shop', component: ShopView },
        { path: 'ai-care', name: 'ai-care', component: AICareView },
        { path: 'knowledge', name: 'knowledge', component: KnowledgeView },
        { path: 'profiles', name: 'profiles', component: ProfilesView }
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