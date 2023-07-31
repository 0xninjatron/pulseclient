import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  plugins: [vue({
    template: {
      compilerOptions: {
        // Here's the config to ignore this warning:
        //App.vue:21 [Vue warn]: Failed to resolve component: router-view
        // If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement. 
        isCustomElement: (tag) => ['router-linkZ', "router-viewZ"].includes(tag)
      }
    }
  })]
}
