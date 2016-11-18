let mediaRecorder;
let captureRecorder;

const recordedBlobs = {
    camera: [],
    screen: [],
};

const recordButton = document.querySelector('button#record');
const downloadButton = document.querySelector('button#download');

recordButton.onclick = toggleRecording;
downloadButton.onclick = download;

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.camera.push(event.data);
    }
}
function handleDataAvailable1(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.screen.push(event.data);
    }
}

function handleStop(event) {
    console.info('Recorder stopped: ', event);
}

function toggleRecording() {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        downloadButton.disabled = false;
    }
}

function startRecording() {
    let options = {mimeType: 'video/webm;codecs=vp9'};

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
        captureRecorder = new MediaRecorder(window.captureStream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
            + e + '. mimeType: ' + options.mimeType);
        return;
    }
    console.info('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    captureRecorder.ondataavailable = handleDataAvailable1;
    mediaRecorder.start(10); // collect 10ms of data
    captureRecorder.start(10); // collect 10ms of data
    console.info('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
    captureRecorder.stop();
    console.info('Recorded Blobs: ', recordedBlobs);
}

function download() {

    downloadUrl('camera');
    downloadUrl('screen');
}

function downloadUrl(source) {
    const blob = new Blob(recordedBlobs[source], {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'camera.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}