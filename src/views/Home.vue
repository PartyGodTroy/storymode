<style lang="scss">
.container{
  display:flex;
  justify-content:center;
  align-items: center;
}
.side-panel-left{
  height:100%;
  position:absolute;
  left: 0;
  top: 0;
  width:100px;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
  .recording{
    width:100%;
    height:64px;
    border-bottom: 1px solid black;
  }
}
.side-panel-right{
  height:100%;
  position:absolute;
  right: 0;
  top: 0;
  width:300px;
}
</style>

<template>
  <div class="side-panel-right">
   <DisplayList></DisplayList>
  </div>
  <div class="home">
    <div class="controls">
      <button @click="toggleRecording">
      {{recordBtnTxt}}
      </button>
      <div>
  </div>
    </div>
    <div class="container">
      <Renderer></Renderer>
      <video id="playback" controls autoplay="true" width="500" height="300" :src="currentVideoSource"></video>
    </div>
    <div class="container">
      <ScriptEditor></ScriptEditor>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Renderer from '@/components/Renderer.vue'
import DisplayList from '@/components/DisplayList.vue'
import { Mutation } from 'vuex'
import ScriptEditor from '@/components/ScriptEditor.vue'
import { AppState } from '@/states/AppState'
import Recording from '../models/Recording'

@Options({
  components: {
    Renderer,
    ScriptEditor,
    DisplayList
  }
})
export default class Home extends Vue {
  get isRecording (): boolean {
    return this.$store.getters.isRecording
  }

  get recordBtnTxt (): string {
    return this.$store.getters.isRecording
      ? '❌ stop recording'
      : '⭕ Record'
  }

  startRecording () {
    if (this.$store.getters.isRecording) {
      return
    }
    this.$store.dispatch('record')
  }

  stopRecording () {
    if (!this.$store.getters.isRecording) {
      return
    }
    this.$store.dispatch('stop')
  }

  toggleRecording () {
    if (this.$store.getters.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  }

  get currentVideoSource (): string {
    return this.$store.getters.latestVideoUrl
  }

  get recordings (): Recording[] {
    return this.$store.getters.recordings
  }

  mounted () {
    this.$store.commit('initSpeechToText')
    this.$store.subscribe((mutation: any, state: AppState) => {
      // console.log(mutation.payload)
    })
  }
}
</script>
