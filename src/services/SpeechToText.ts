
const _SpeechRecognition = (window as any).webkitSpeechRecognition

export default class SpeechToText {
    speechRecognizer!: SpeechRecognition
    isRecording = false
    isAvailable = false

    Setup () {
      if (this.speechRecognizer) {
        return
      }
      if ('webkitSpeechRecognition' in window) {
        this.speechRecognizer = new _SpeechRecognition()
        this.speechRecognizer.continuous = true
        this.speechRecognizer.interimResults = true
        this.speechRecognizer.lang = 'en-US'
        this.isAvailable = true
      } else {
        console.error('No Speech recognition is available in this browser')
      }
    }

    Record (onResult: (x: SpeechRecognitionEvent) => void) {
      if (this.isRecording) return
      this.isRecording = true
      this.speechRecognizer.onresult = onResult
      this.speechRecognizer.start()
    }

    Stop () {
      if (!this.isRecording) return
      this.speechRecognizer.stop()
      this.isRecording = false
    }
}
