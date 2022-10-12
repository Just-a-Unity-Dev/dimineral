// if you do this I will cut off your legs
// eslint-disable-next-line
export let audioCtx: any;
export let buffer: AudioBuffer | null = null;

export function play(path: string) {
    if (audioCtx == null) return;
    const request = new XMLHttpRequest();
    request.open("GET", "/audio/" + path);
    request.responseType = "arraybuffer";
    request.onload = function() {
        const undecodedAudio = request.response;
        // eslint-disable-next-line
        // @ts-ignore
        audioCtx.decodeAudioData(undecodedAudio, (data) => buffer = data);
    };
    request.send();

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
}

export function initAudio() {
    try {
        audioCtx = new AudioContext();
    }
    catch (e) {
        // to satisfy mister linter
    }
}
