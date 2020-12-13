<style lang="scss">

</style>

<template>
  <div class="home">
    <button @click="toggleRecording">{{recordBtnTxt}}</button>
    <Renderer></Renderer>
    <ScriptEditor></ScriptEditor>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Renderer from '@/components/Renderer.vue'
import store, { AppState } from '../appstore'
import { Mutation } from 'vuex'
import ScriptEditor from '@/components/ScriptEditor.vue'

@Options({
  components: {
    Renderer,
    ScriptEditor
  }
})
export default class Home extends Vue {
  get recordBtnTxt (): string {
    return this.$store.getters.isRecording
      ? 'Stop Recording'
      : 'Start Recording'
  }

  startRecording () {
    if (this.$store.getters.isRecording) {
      return
    }
    this.$store.dispatch('startSpeechToText')
  }

  stopRecording () {
    if (!this.$store.getters.isRecording) {
      return
    }
    this.$store.dispatch('stopSpeechToText')
  }

  toggleRecording () {
    if (this.$store.getters.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  }

  mounted () {
    this.$store.commit('initSpeechToText')
    this.$store.subscribe((mutation: any, state: AppState) => {
      console.log(mutation.payload)
    })
  }
}
</script>
