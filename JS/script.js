// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById("btn-start");
var btnStop = document.getElementById("btn-stop");
var btnCapture = document.getElementById("btn-capture");

// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var snapshot = document.getElementById("snapshot");

// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);

// Start Streaming
function startStreaming() {

  var mediaSupport = 'mediaDevices' in navigator;

  if (mediaSupport && null == cameraStream) {

    const constraints = {
      video: {
        facingMode: { exact: "environment" }
      },
      audio: false,
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (mediaStream) {

        cameraStream = mediaStream;

        stream.srcObject = mediaStream;

        stream.play();
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
      });
  }
  else {

    alert('Your browser does not support media devices.');

    return;
  }
}

// Stop Streaming
function stopStreaming() {

  if (null != cameraStream) {

    var track = cameraStream.getTracks()[0];

    track.stop();
    stream.load();

    cameraStream = null;
  }
}

btnCapture.addEventListener("click", captureSnapshot);

function captureSnapshot() {

  if (null != cameraStream) {

    var ctx = capture.getContext('2d');
    var img = new Image();

    ctx.drawImage(stream, 0, 0, capture.width, capture.height);

    img.src = capture.toDataURL("image/png");
    img.width = 240;

    snapshot.innerHTML = '';

    snapshot.appendChild(img);
  }
}

function dataURItoBlob(dataURI) {

  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  var buffer = new ArrayBuffer(byteString.length);
  var data = new DataView(buffer);

  for (var i = 0; i < byteString.length; i++) {

    data.setUint8(i, byteString.charCodeAt(i));
  }

  return new Blob([buffer], { type: mimeString });
}