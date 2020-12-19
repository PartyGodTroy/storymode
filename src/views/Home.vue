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
  width:100px;
}
</style>

<template>
  <div class="side-panel-left">
    <div>
      <h3>Recordings</h3>
    </div>
    <div v-for="recording in recordings" :key="recording.name" class="recording">
      <h4>{{recording.name}}</h4>
      <span>Duration: {{recording.duration}}</span>
    </div>
  </div>
  <div class="side-panel-right">
    <h3>Commands</h3>
  </div>
  <div class="home">
    <div class="controls">
      <button @click="toggleRecording">
      {{recordBtnTxt}}
      </button>
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
import store, { AppState, Recording } from '../appstore'
import { Mutation } from 'vuex'
import ScriptEditor from '@/components/ScriptEditor.vue'

@Options({
  components: {
    Renderer,
    ScriptEditor
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

  get recordings (): string {
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
