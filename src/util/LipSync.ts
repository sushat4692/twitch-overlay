export class Lipsync {
    private fBins: number[] = [];
    private refFBins = [0, 500, 700, 3000, 6000];

    // Freq analysis bins, energy and lipsync vectors
    private energy: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    private lipsyncBSW: [number, number, number] = [0, 0, 0];

    // Lipsync parameters
    private threshold;
    private smoothness;
    private pitch;

    // Context
    private context;
    private analyser;
    private data;
    private byteData;

    // Stream
    private working = false;
    private stream: MediaStream | null = null;
    private sample: MediaStreamAudioSourceNode | null = null;

    constructor({
        threshold = 0.5,
        smoothness = 0.6,
        pitch = 1,
        fftSize = 1024,
    }) {
        this.threshold = threshold;
        this.smoothness = smoothness;
        this.pitch = pitch;

        // Change freq bins according to pitch
        this.defineFBins(this.pitch);

        // Initialize buffers
        this.context = new AudioContext();
        // Analyser
        this.analyser = this.context.createAnalyser();
        // FFT size
        this.analyser.fftSize = fftSize;
        // FFT smoothing
        this.analyser.smoothingTimeConstant = this.smoothness;
        // FFT buffer
        this.data = new Float32Array(this.analyser.frequencyBinCount);
        this.byteData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    defineFBins(pitch: number) {
        for (let i = 0; i < this.refFBins.length; i += 1) {
            this.fBins[i] = this.refFBins[i] * pitch;
        }
    }

    async startMic() {
        // Restart
        this.stopSample();

        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        this.sample = this.context.createMediaStreamSource(this.stream);
        this.sample.connect(this.analyser);

        this.working = true;
    }

    update() {
        if (!this.working) {
            return false;
        }

        // Short-term power spectrum
        this.analyser.getFloatFrequencyData(this.data);
        this.analyser.getByteFrequencyData(this.byteData);
        // Analyze energies
        this.binAnalysis();
        // Calculate lipsync blenshape weights
        this.lipAnalysis();

        // Volume
        const volume =
            this.byteData.reduce((prev, current) => prev + current, 0) /
            this.byteData.length;

        // Return weights/volume
        return {
            bsw: this.lipsyncBSW,
            energy: this.energy,
            volume,
            float: this.data,
            byte: this.byteData,
        };
    }

    stop() {
        this.stopSample();
        this.working = false;
    }

    stopSample() {
        // If microphone input
        if (this.stream) {
            const tracks = this.stream.getTracks();
            for (let i = 0; i < tracks.length; i += 1) {
                if (tracks[i].kind === 'audio') {
                    tracks[i].stop();
                }
            }
            this.stream = null;
        }
    }

    private binAnalysis() {
        // Signal properties
        const nfft = this.analyser.frequencyBinCount;
        const fs = this.context.sampleRate;

        // Energy of bins
        for (let binInd = 0; binInd < this.fBins.length - 1; binInd += 1) {
            // Start and end of bin
            const indxIn = Math.round((this.fBins[binInd] * nfft) / (fs / 2));
            const indxEnd = Math.round(
                (this.fBins[binInd + 1] * nfft) / (fs / 2)
            );

            // Sum of freq values
            this.energy[binInd] = 0;
            for (let i = indxIn; i < indxEnd; i++) {
                // data goes from -25 to -160 approx
                // default threshold: 0.45
                let value = this.threshold + (this.data[i] + 20) / 140;
                // Zeroes negative values
                value = value > 0 ? value : 0;

                this.energy[binInd] += value;
            }
            // Divide by number of sumples
            this.energy[binInd] /= indxEnd - indxIn;
        }
    }

    private lipAnalysis() {
        if (this.energy !== undefined) {
            let value = 0;

            // Kiss blend shape
            // When there is energy in the 1 and 2 bin, blend shape is 0
            value = (0.5 - this.energy[2]) * 2;
            if (this.energy[1] < 0.2) value = value * (this.energy[1] * 5);
            value = Math.max(0, Math.min(value, 1)); // Clip
            this.lipsyncBSW[0] = value;

            // Lips closed blend shape
            value = this.energy[3] * 3;
            value = Math.max(0, Math.min(value, 1)); // Clip
            this.lipsyncBSW[1] = value;

            // Jaw blend shape
            value = this.energy[1] * 0.8 - this.energy[3] * 0.8;
            value = Math.max(0, Math.min(value, 1)); // Clip
            this.lipsyncBSW[2] = value;
        }
    }
}
