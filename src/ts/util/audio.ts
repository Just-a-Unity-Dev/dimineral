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
export let samples: any;
export let audioCtx: any;

/**
 * Returns an audio buffer
 * @param path string
 * @returns audioBuffer
 */
export async function getAudioFile(path: string) {
    if (audioCtx != null) {
        const response = await fetch("/astrionics/audio/" + path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
}

/**
 * Returns an array of audio buffers
 * @returns audioBuffer[]
 */
export async function setupSamples() {
    const audioBuffers = [];

    for (const path of paths) {
        const sample = await getAudioFile(path);
        audioBuffers.push(sample);
    }

    return audioBuffers;
}

/**
 * Plays a sound with the sample in `paths`
 * @param sample string
 * @example
 * // plays fire.wav
 * play("sfx/fire.wav")
 */
export async function play(sample: string) {
    setupSamples().then(response => {
        if (audioCtx != null) {
            samples = response;

            const sampleSource = audioCtx.createBufferSource();
            sampleSource.buffer = samples[paths.findIndex(path => path == sample)];
            sampleSource.connect(audioCtx.destination);
            sampleSource.start(0);
        }
    });
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
