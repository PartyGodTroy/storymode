import { Store } from 'vuex'
import SpeechToText from './services/SpeechToText'
import commandStore, { CommandState } from './commandstore'
import Utils from './Utils'

const MediaRecorder = (window as any).MediaRecorder || 'none'

export interface Recording {
  blob?: Blob;
  url?: string;
  name: string;
  inProgress: boolean;
  startTime: Date;
  endTime?: Date;
  duration?: number;

}
/**
 * Class for containing app level specs
 */
export class AppState {
    mode!: 'debug' | 'production'
    width = 500
    height = 300
    recordingFPS = 30
    speechToText: SpeechToText = new SpeechToText();
    recordings: Recording[] = []
    currentRecording!: Recording | null
    videoStream!: MediaStream
    audioStream!: MediaStream
    videoChunks: Array<any> = []
    mediaRecorder!: any // MediaRecorder not available in Ts
    canvas!: HTMLCanvasElement | any // HTMLCanvasElement.captureStream not available in TS
    script = ''
    finalTranscripts = ''
    isRecording = false
    commandStore = commandStore
}
const defaultState = new AppState()

const store = new Store<AppState>({
  modules: {
  },
  state: defaultState,
  actions: {
    /**
     * @param store
     */
    enterDebugMode (store) {
      store.commit('switchMode', 'debug')
    },
    /**
     *
     * @param store
     */
    enterProductionMode (store) {
      store.commit('switchMode', 'production')
    },
    /**
     *
     * @param ctx
     */
    async record (ctx) {
      ctx.commit('setRecording', {
        startTime: new Date(),
        name: Utils.uuidv4(),
        inProgress: true
      })
      await ctx.dispatch('startRecorderAsync')
      await ctx.dispatch('startSpeechToText')
      // keep last
      ctx.commit('setRecordingState', true)
    },
    /**
     *
     * @param ctx
     */
    async stop (ctx) {
      console.log(ctx.state.currentRecording)
      await ctx.dispatch('stopRecorderAsync')
      await ctx.dispatch('stopSpeechToText')
      // keep last
    },

    /**
     *
     * @param ctx
     */
    async startRecorderAsync (ctx) {
      const streamTracks: MediaStreamTrack[] = []

      if (!ctx.state.canvas) {
        console.error('cannot record no canvas set')
      }
      ctx.state.videoStream = ctx.state.canvas.captureStream(30)

      streamTracks.push(...ctx.state.videoStream.getTracks())

      if (navigator.mediaDevices) {
        console.log('getUserMedia supported.')

        ctx.state.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

        streamTracks.push(...ctx.state.audioStream.getTracks())
      } else {
        console.error('getUserMedia not supported')
        // raise flag NO Audio, its not a deal breaker though
      }

      const combinedstreams = new MediaStream(streamTracks)

      ctx.state.mediaRecorder = new MediaRecorder(combinedstreams)

      ctx.state.mediaRecorder.ondataavailable = (e: any) => {
        ctx.commit('addVideoChunk', e.data)
      }

      ctx.state.mediaRecorder.onstop = (e: any) => {
        if (ctx.state.currentRecording) {
          ctx.state.currentRecording.blob = new Blob(ctx.state.videoChunks, { type: 'video/mp4' })
          ctx.state.currentRecording.url = URL.createObjectURL(ctx.state.currentRecording.blob)
          ctx.state.currentRecording.endTime = new Date()
          ctx.state.currentRecording.duration = ctx.state.currentRecording.endTime.getTime() - ctx.state.currentRecording.startTime.getTime()
          ctx.state.currentRecording.inProgress = false
        }
        ctx.commit('addRecording', ctx.state.currentRecording)
        ctx.commit('clearVideoChunks')
        ctx.commit('setRecordingState', false)
      }

      ctx.state.mediaRecorder.start()

      console.log('starting recorder session')
    },
    /**
     *
     * @param ctx
     */
    async stopRecorderAsync (ctx) {
      if (!ctx.state.canvas) {
        console.error('cannot record no canvas set')
      }

      if (!ctx.getters.isRecording) {
        console.warn('Cannot dispatch stopRecorderAsync, recording is NOT in progress')
      }
      ctx.state.mediaRecorder.stop()
    },
    /**
     *
     * @param ctx
     */
    startSpeechToText (ctx) {
      ctx.state.speechToText.Record((e: SpeechRecognitionEvent) => {
        let interimTranscripts = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript
          transcript.replace('\n', '<br>')
          if (e.results[i].isFinal) {
            ctx.state.finalTranscripts += transcript
          } else {
            interimTranscripts += transcript
          }
        }
        ctx.commit('newSpeechResults', interimTranscripts)
      })
      console.log('starting speech to text')
    },
    /**
     *
     * @param ctx
     */
    stopSpeechToText (ctx) {
      console.log('stopping speech to text')
      ctx.state.speechToText.Stop()
    }
  },
  /**
   * Mutations
   */
  mutations: {
    /**
     *
     * @param state
     * @param canvas
     */
    setCanvas (state: AppState, canvas: HTMLCanvasElement | any) {
      if (!canvas) {
        console.error('cannot set a null canvas')
      }
      console.log('mutation - setCanvas: ' + canvas)
      state.canvas = canvas
    },
    /**
     *
     * @param state
     * @param mode
     */
    switchMode (state: AppState, mode: 'debug' | 'production') {
      console.log('mutation - switchMode: ' + mode)
      state.mode = mode
    },
    /**
     *
     * @param state
     */
    initSpeechToText (state: AppState) {
      console.log('mutation - initSpeechToText')
      state.speechToText.Setup()
    },
    /**
     * Passes speech results to command store for processing
     * @param state
     * @param result
     */
    newSpeechResults (state: AppState, result: string) {
      console.log('new speech results')
    },
    /**
     *
     * @param state
     * @param scriptText
     */
    setScriptText (state: AppState, scriptText: string) {
      state.script = scriptText
    },
    /**
     *
     * @param state
     * @param isRecording
     */
    setRecordingState (state: AppState, isRecording: boolean) {
      console.log('isRecording: ' + isRecording)
      state.isRecording = isRecording
      if (isRecording) {

      }
    },
    addVideoChunk (state: AppState, chunk: any) {
      state.videoChunks.push(chunk)
    },
    clearVideoChunks (state: AppState) {
      console.log('video chunks cleared')
    },
    setRecording (state: AppState, recording: Recording | null) {
      state.currentRecording = recording
      console.log('setting current recording to = ' + recording)
    },
    addRecording (state: AppState, recording: Recording) {
      state.recordings.push(recording)
      console.log('recording finished')
    }
  },
  /**
   * Getters
   */
  getters: {
    /**
     *
     * @param state
     */
    speechToTextAvailable (state: AppState): boolean {
      return state.speechToText.isAvailable
    },
    /**
     *
     * @param state
     */
    isRecording (state: AppState): boolean {
      return state.isRecording
    },
    /**
     *
     * @param state
     */
    scriptText (state: AppState): string {
      return state.script
    },
    latestVideoUrl (state: AppState): string {
      const lastVideo = state.recordings[state.recordings.length - 1]
      if (lastVideo && lastVideo.url) {
        return lastVideo.url
      }
      return ''
    },
    recordings (state: AppState): Recording[] {
      return state.recordings
    }
  }
})

export default store
