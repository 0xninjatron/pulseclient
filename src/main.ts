import "./style.css";

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Faq from './components/Faq.vue';
import NFTDisplay from './components/NFTDisplay.vue';
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/faq', component: Faq },
    { path: '/nft', component: NFTDisplay },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
