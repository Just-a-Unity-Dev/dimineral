export const audioCtx = new AudioContext();
export let buffer: AudioBuffer | null = null;

export function play(path: string) {
    const request = new XMLHttpRequest();
    request.open("GET", "/audio/" + path);
    request.responseType = "arraybuffer";
    request.onload = function() {
        const undecodedAudio = request.response;
        audioCtx.decodeAudioData(undecodedAudio, (data) => buffer = data);
    };
    request.send();

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
}
