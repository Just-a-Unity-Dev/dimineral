// this is massive shitcode. for the love of god. refactor this. please.
// if you do this I will cut off your legs
// eslint-disable-next-line
export const paths: string[] = [
    "sfx/select.wav",
    "sfx/notify.wav",
    "sfx/boom1.wav",
    "sfx/boom2.wav",
    "sfx/death.wav",
    "sfx/fire.wav",
    "sfx/sift.wav",
    "sfx/good.wav",
    "sfx/warp.wav",
]
export let samples: (AudioBuffer | undefined)[] = [];
export let audioCtx: AudioContext;

/**
 * Returns an audio buffer
 * @param path string
 * @returns AudioBuffer
 */
export async function getAudioFile(path: string): Promise<AudioBuffer | null> {
    if (audioCtx != null) {
        const response = await fetch("/astrionics/audio/" + path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    return null;
}

/**
 * Sets up samples
 */
export async function setupSamples() {
    if (samples.length > 1) return;
    const audioBuffers: AudioBuffer[] = [];

    for (const path of paths) {
        const sample = await getAudioFile(path);
        if (sample != null) {
            audioBuffers.push(<AudioBuffer>sample);
        }
    }

    samples = audioBuffers;
}

/**
 * Plays a sound with the sample in `paths`
 * @param sample string
 * @example
 * // plays fire.wav
 * play("sfx/fire.wav")
 */
export async function play(sample: string) {
    setupSamples();
    try {
        const sampleSource = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.5;
        gainNode.connect(audioCtx.destination);
        sampleSource.connect(gainNode);

        sampleSource.buffer = <AudioBuffer>samples[paths.findIndex(path => path == sample)];
        sampleSource.start(0);
    } catch {
        // console.log("Unable to play sound, have you interacted with the DOM or in a testing environment?")
    }
}

/**
 * Initializes audio
 */
export function initAudio() {
    try {
        audioCtx = new AudioContext();
    }
    catch (e) {
        // to satisfy mister linter
    }
}
