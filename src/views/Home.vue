<style lang="scss">
.home{
  height:100%;
  overflow: hidden hidden;
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
</style>

<template>
   <DisplayList></DisplayList>
   <VideoRecordings></VideoRecordings>
  <div class="home">
    <div class="container-fluid" style="height:90%;">
    <div class="controls">
      <button @click="toggleRecording">
      {{recordBtnTxt}}
      </button>
      <button @click="openDisplayList">
        Open Display List
      </button>
      <button @click="openRecordings">
        Open Recordings
      </button>
    </div>
      <Renderer></Renderer>
      <!--video id="playback" controls autoplay="true" width="500" height="300" :src="currentVideoSource"></video-->
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
import store from '../appstore'
import VideoRecordings from '../components/VideoRecordings.vue'

@Options({
  components: {
    Renderer,
    ScriptEditor,
    DisplayList,
    VideoRecordings
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

  openDisplayList () {
    this.$store.commit('setDisplayListIsOpened', true)
  }

  openRecordings () {
    this.$store.commit('setRecordingsOpened', true)
  }

  mounted () {
    this.$store.commit('initSpeechToText')
    this.$store.subscribe((mutation: any, state: AppState) => {
      // console.log(mutation.payload)
    })
  }
}
</script>
