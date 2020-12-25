import { Store, StoreOptions } from 'vuex'
import Utils from './Utils'
import { Color4, Engine, Scene } from '@babylonjs/core'
import { State } from '@popperjs/core'
import Recording from './models/Recording'
import VideoPlaneBehavior, { VideoPlaneOptions } from './models/behavior/VideoPlaneBehavior'
import ArcRotateCameraBehavior, { ArcRotateCameraOptions } from './models/behavior/ArcRotateCameraBehavior'
import { AppState } from './states/AppState'
import { BehaviorControl } from './models/behavior/Behaviors'

const MediaRecorder = (window as any).MediaRecorder || 'none'

const defaultState = new AppState()

const store = new Store<AppState>({

  state: defaultState,

  actions: {
    registerControl (ctx, control: BehaviorControl): BehaviorControl {
      ctx.state.sceneState.allControls.push(control)
      return control
    },
    getControl (ctx, controlId: string): BehaviorControl | null | undefined {
      return ctx.state.sceneState.allControls.find(bc => bc.id === controlId)
    },
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
        name: '',
        inProgress: true,
        id: Utils.uuidv4()
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
    },
    /**
     * scene actions
     */
    /**
     * Adds an ArcRotateCamera to the scene of the target node provided or the default scenes node
     * @param state
     * @param options
     */
    addArcRotateCameraBehavior (ctx, options: ArcRotateCameraOptions) {
      const behavior: ArcRotateCameraBehavior = new ArcRotateCameraBehavior(options)
      const { scene, node } = ctx.state.sceneState.routeBehaviorToTarget(options.route)
      node.addBehavior(behavior)
      ctx.state.sceneState.behaviors.push(behavior)
    },
    async addVideoPlaneBehavior (ctx, options: VideoPlaneOptions) {
      const behavior: VideoPlaneBehavior = new VideoPlaneBehavior(options)
      const { scene, node } = ctx.state.sceneState.routeBehaviorToTarget(options.route)
      node.addBehavior(behavior)
      ctx.state.sceneState.behaviors.push(behavior)
    }
  },
  /**
   * Mutations
   */
  mutations: {
    setSelectedRecording (state: AppState, val: Recording) {
      state.selectedRecording = val
    },
    setDisplayListIsOpened (state: AppState, val: boolean) {
      state.displayListOpened = val
    },
    setRecordingsOpened (state: AppState, val: boolean) {
      state.recordingsOpened = val
    },
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
    },
    /**
     * Scene Mutations
     */
    /**
     * Stores reference to the engine, adds resizing events, creates the defaultScene, and 'root_node'
     * then kicks off render loop
     * @param state
     * @param engine
     */
    setEngine (state: AppState, engine: Engine) {
      state.sceneState.engine = engine
      state.sceneState.createScene()
      // state.
      window.addEventListener('resize', () => state.sceneState.engine.resize())
      if (!state.sceneState.defaultSceneIsRendering) {
        state.sceneState.defaultSceneIsRendering = true
        let lastRendererErrorName = ''
        state.sceneState.engine.runRenderLoop(() => {
          state.sceneState.scenes.forEach(scene => {
            try {
              scene.render()
            } catch (err) {
              const msg = err as Error
              if (msg.name !== lastRendererErrorName) {
                console.warn(msg)
              }
              lastRendererErrorName = msg.name
            }
          })
        })
      }
    },
    setSceneClearColor (state: AppState, color: Color4) {
      if (state.sceneState.defaultScene) {
        state.sceneState.defaultScene.clearColor = color
      }
    },
    removeBehaviorById (state: AppState, behaviorId: string) {
      const behaviorIdIndex = state.sceneState.behaviors.findIndex(b => {
        return b.id === behaviorId
      })
      if (behaviorIdIndex > -1) {
        const behavior = state.sceneState.behaviors.splice(behaviorIdIndex, 1)[0]
        behavior.remove()
      } else {
        console.warn(`Cannot remove ${behaviorId} it is not found`)
      }
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
    scenes (state: AppState): Scene[] {
      if (state.sceneState) {
        return state.sceneState.scenes
      }
      return []
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
    },
    selectedRecording (state: AppState): Recording | null | undefined {
      return state.selectedRecording
    },
    controlCount (state: AppState): number {
      return state.sceneState.allControls.length
    }
  }
})

export default store
