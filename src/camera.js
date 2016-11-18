const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

let sourceBuffer;

const constraints = {
    audio: true,
    video: true
};

function handleSuccess(stream) {
    const gumVideo = document.querySelector('video#capture');
    console.info('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
        gumVideo.src = window.URL.createObjectURL(stream);
    } else {
        gumVideo.src = stream;
    }
}

function handleError(error) {
    console.error('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(handleSuccess).catch(handleError);

function handleSourceOpen(event) {
    console.info('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.info('Source buffer: ', sourceBuffer);
}