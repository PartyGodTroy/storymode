// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from '@/vuex'
import { AppState } from './appstore'

declare module '@vue/runtime-core' {
  // typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<AppState>;
  }
}
