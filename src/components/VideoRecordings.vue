<template>
  <div :class="recordingStyle">
    <div class="container-fluid">
      <h5>Recordings</h5>
      <div v-if="selectedRecording.id !== ''">
        <div>Preview</div>
        <video
          class="vid"
          :id="selectedRecording.id"
          :src="selectedRecording.url"
          controls
        ></video>
      </div>
      <div
        v-for="recording in recordings"
        :key="recording.id"
        @click="selectRecording(recording)"
        :class="getRecordingClass(recording)"
      >
        <div class="col-sm-6">
          <video :src="recording.url" style="width: 100%; height: 100%"></video>
        </div>
        <div class="col-sm-6">
          <div class="container-fluid">
            <div class="row">{{ recording.name }}</div>
            <div class="row">
              Duration
              <small>{{ getDurationLabel(recording) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
video.vid {
  width: 100%;
  height: auto;
}
.video-recordings {
  width: 300px;
  height: 100vh;
  overflow: hidden scroll;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
}
.selected-vid {
  background-color: lightblue;
}

.no-pointer {
  pointer-events: none;
}
</style>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { createPopper } from '@popperjs/core'
import ScriptPreview from '@/components/ScriptPreview.vue'
import Recording from '../models/Recording'
import Utils from '../Utils'

@Options({})
export default class VideoRecordings extends Vue {
  get selectedRecording (): Recording | null | undefined {
    return this.$store.getters.selectedRecording
  }

  get recordings (): Recording[] {
    return this.$store.getters.recordings
  }

  get recordingStyle (): string {
    return this.$store.state.recordingsOpened
      ? 'video-recordings animate__animated animate__fadeInLeft'
      : 'video-recordings animate__animated animate__fadeOutLeft no-pointer'
  }

  closeDisplayList () {
    this.$store.commit('setDisplayListIsOpened', false)
  }

  selectRecording (recording: Recording) {
    this.$store.commit('setSelectedRecording', recording)
  }

  getRecordingClass (recording: Recording) {
    if (this.selectedRecording) {
      return recording.id === this.selectedRecording.id
        ? 'row selected-vid'
        : 'row'
    }
    return 'row'
  }

  getDurationLabel (recording: Recording): string {
    if (recording.duration) {
      const ms = recording.duration % 100
      const seconds = parseInt('' + recording.duration / 1000)
      const minutes = parseInt('' + recording.duration / 60000)
      const hours = parseInt('' + recording.duration / 3600000)

      let leadingMS = ''
      if (ms.toString().length < 2) {
        leadingMS = '0'
      }

      let leadingS = ''
      if (seconds.toString().length < 2) {
        leadingS = '0'
      }

      let leadingMin = ''
      if (minutes.toString().length < 2) {
        leadingMin = '0'
      }

      let leadingHr = ''
      if (hours.toString().length < 2) {
        leadingHr = '0'
      }

      return `${leadingHr}${hours}hr:${leadingMin}${minutes}m:${leadingS}${seconds}s:${leadingMS}${ms}ms`
    }
    return '00:00:00'
  }
}
</script>
