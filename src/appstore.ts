import { Store } from 'vuex'
import SpeechToText from './services/SpeechToText'
import RecordRTCPromisesHandler from 'recordrtc'

export class AppState {
    mode!: 'debug' | 'production'
    width = 500
    height = 300
    speechToText: SpeechToText = new SpeechToText();
    recorder!: RecordRTCPromisesHandler
    canvas!: HTMLCanvasElement
    script = ''
    finalTranscripts = ''
    isRecording = false
    recordLimit = 1000 // in seconds
    recordedBlob: Blob[] = []
}
const defaultState = new AppState()

const store = new Store<AppState>({
  state: defaultState,
  actions: {
    /**
     *
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
      console.log('starting recording')
      ctx.commit('setRecordingState', true)
      await ctx.dispatch('startRecorderAsync')
      await ctx.dispatch('startSpeechToText')
    },
    /**
     *
     * @param ctx
     */
    async stop (ctx) {
      console.log('stopping recording')
      ctx.commit('setRecordingState', false)
      await ctx.dispatch('stopRecorderAsync')
      await ctx.dispatch('stopSpeechToText')
    },
    /**
     *
     * @param ctx
     */
    async startRecorderAsync (ctx) {
      if (!ctx.state.canvas) {
        console.error('cannot record no canvas set')
      }
      if (!ctx.state.recorder) {
        ctx.state.recorder = new RecordRTCPromisesHandler(this.state.canvas, {
          type: 'canvas',
          recorderType: 'CanvasRecorder',
          canvas: {
            width: ctx.state.width,
            height: ctx.state.height
          }
        })
      }
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

      if (!ctx.state.recorder) {
        console.warn('Cannot dispatch stopRecorderAsync, recorder is null try startRecorderAsync')
      }

      if (!ctx.getters.isRecording) {
        console.warn('Cannot dispatch stopRecorderAsync, recording is NOT in progress')
      }

      ctx.state.recorder.stopRecording(async () => {
        const blob = await ctx.state.recorder.getBlob()
        console.log('Finished collecting blob')
      })
      console.log('ending recorder session')
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
    setCanvas (state: AppState, canvas: HTMLCanvasElement) {
      if (!canvas) {
        console.error('cannot set a null canvas')
      }
      state.canvas = canvas
    },
    /**
     *
     * @param state
     * @param mode
     */
    switchMode (state: AppState, mode: 'debug' | 'production') {
      state.mode = mode
    },
    /**
     *
     * @param state
     */
    initSpeechToText (state: AppState) {
      state.speechToText.Setup()
    },
    /**
     *
     * @param state
     * @param result
     */
    newSpeechResults (state: AppState, result: string) {
      console.log(result)
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
    }
  }
})

export default store
