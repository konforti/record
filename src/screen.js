const {desktopCapturer} = require('electron');

function addSource(source) {
    let option = document.createElement('option');
    option.value = source.id.replace(":", "");
    option.innerText = source.name;
    document.querySelector('select').appendChild(option);

    document.querySelector('select option[value="' + source.id.replace(":", "") + '"]').setAttribute('data-img-src', source.thumbnail.toDataURL());
}

function showSources() {
    desktopCapturer.getSources({types:['window', 'screen'] }, (error, sources) => {
        sources.forEach(item => {
            console.info("Name: " + item.name);
            addSource(item);
        });
    });

    const selectEl = document.querySelector('select');
    selectEl.addEventListener('change', setSource);
}

function onAccessApproved(desktop_id) {
    if (!desktop_id) {
        console.info('Desktop Capture access rejected.');
        return;
    }

    const gotStream = (stream) => {
        document.querySelector('#screen').src = URL.createObjectURL(stream);
        window.captureStream = stream;
    };

    const getUserMediaError = (e) => {
        console.info('getUserMediaError: ' + JSON.stringify(e, null, '---'));
    };

    console.info("Desktop sharing started.. desktop_id:" + desktop_id);
    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: desktop_id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
            }
        }
    }, gotStream, getUserMediaError);
}

function setSource() {
    const id = (document.querySelector('select').value).replace(/window|screen/g, (match) => `${match}:`);
    onAccessApproved(id);
}

(function() {
    setTimeout(() => {
        setSource();
    }, 1000);
})();

window.onload = showSources();
