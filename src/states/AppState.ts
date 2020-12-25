import SpeechToText from '../services/SpeechToText'
import { SceneState } from './SceneState'
import Recording from '../models/Recording'

/**
 * Class for containing app level specs for recording audio
 */

export class AppState {
  mode!: 'debug' | 'production';
  width = 500;
  height = 300;
  recordingFPS = 30;
  speechToText: SpeechToText = new SpeechToText();
  recordings: Recording[] = [];
  currentRecording!: Recording | null;
  videoStream!: MediaStream;
  audioStream!: MediaStream;
  videoChunks: Array<any> = [];
  mediaRecorder!: any; // MediaRecorder not available in Ts
  canvas!: HTMLCanvasElement | any; // HTMLCanvasElement.captureStream not available in TS
  script = '';
  finalTranscripts = '';
  isRecording = false;
  sceneState: SceneState = new SceneState();
  displayListOpened = false
  recordingsOpened = false
  selectedRecording: Recording = { name: '', inProgress: false, id: '', startTime: new Date() }
}
