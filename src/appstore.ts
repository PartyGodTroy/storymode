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
    finalTranscripts = ''
    isRecording = false
    recordLimit = 1000 // in seconds
    recordedBlob: Blob[] = []
}
const defaultState = new AppState()

const store = new Store<AppState>({
  state: defaultState,
  actions: {
    enterDebugMode (store) {
      store.commit('switchMode', 'debug')
    },
    enterProductionMode (store) {
      store.commit('switchMode', 'production')
    },
    async startRecorderAsync (ctx) {
      if (!ctx.state.canvas) {
        console.error('cannot record no canvas set')
      }
      if (ctx.state.recorder) {
        ctx.state.recorder = new RecordRTCPromisesHandler(this.state.canvas, {
          type: 'canvas',
          recorderType: 'CanvasRecorder',
          canvas: {
            width: ctx.state.width,
            height: ctx.state.height
          }
        })
      }
    },
    async stopRecorderAsync (ctx) {
      if (!ctx.state.canvas) {
        console.error('cannot record no canvas set')
      }

      if (!ctx.state.recorder) {
        console.warn('Cannot dispatch stopRecorderAsync, recorder is null try startRecorderAsync')
      }

      if (!ctx.state.isRecording) {
        console.warn('Cannot dispatch stopRecorderAsync, recording is NOT in progress')
      }

      ctx.state.recorder.stopRecording(async () => {
        const blob = await ctx.state.recorder.getBlob()
        console.log('Finished collecting blob')
      })
    },

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
    },
    stopSpeechToText (ctx) {
      ctx.state.speechToText.Stop()
    }
  },
  mutations: {
    setCanvas (state: AppState, canvas: HTMLCanvasElement) {
      if (!canvas) {
        console.error('cannot set a null canvas')
      }
      state.canvas = canvas
    },
    switchMode (state: AppState, mode: 'debug' | 'production') {
      state.mode = mode
    },
    initSpeechToText (state: AppState) {
      console.log(state.speechToText)
      state.speechToText.Setup()
    },
    newSpeechResults (state: AppState, result: string) {
      console.log(result)
    }

  },
  getters: {
    speechToTextAvailable (state: AppState): boolean {
      return state.speechToText.isAvailable
    },
    isRecording (state: AppState): boolean {
      return state.isRecording
    }
  }
})

export default store
