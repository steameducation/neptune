export default class Recorder {
    constructor(timeoutMS) {
        this.timeoutMS = timeoutMS

        this.recording = false
        this.timeoutId = null

        // This will automatically ask for permission
        this.mediaRecorder = navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream)
            })

        // Where to save the data once finished recording
        this.data = null

        this.areEventsSet = false
    }

    start(arr, key) {
        if (this.recording) throw Error('Already recording...')

        this.recording = true
        // console.log('recording!')

        this.arr = arr
        this.key = key

        this.mediaRecorderChunks = []

        if (!this.areEventsSet) {
            this.mediaRecorder.addEventListener('dataavailable', event => {
                this.mediaRecorderChunks.push(event.data)
            })

            // When stop recording happens (or max time limit is reached)
            this.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.mediaRecorderChunks)
                const audioUrl = URL.createObjectURL(audioBlob)
                const audio = new Audio(audioUrl)
                audio.loop = false
                audio.pause()
                audio.currentTime = 0
                this.arr[this.key] = audio
            })
            this.areEventsSet = true
        }

        // Set timeout
        this.timeoutId = window.setTimeout(() => {
            console.log(`Timing out after ${this.timeoutMS} ms`)
            this.recording = false
            this.mediaRecorder.stop()
        }, this.timeoutMS)

        // Start recording
        // Keep storing the chunks of audio as recording happens
        this.mediaRecorderChunks = []
        this.mediaRecorder.start()
    }

    stop() {
        if (!this.recording) throw 'Need to be recording first'
        window.clearTimeout(this.timeoutId)
        this.recording = false
        this.mediaRecorder.stop()
        // console.log('stopped recording')
    }
}
