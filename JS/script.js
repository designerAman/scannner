var btnStart = document.getElementById("btn-start");
var btnStop = document.getElementById("btn-stop");
// var btnCapture = document.getElementById("btn-capture");

var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
// var snapshot = document.getElementById("snapshot");

btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
// btnCapture.addEventListener("click", captureStream);

var cameraStream = null;

function startStreaming() {
  alert('start');
  const mediaSupport = 'mediaDevices' in navigator;

  if (mediaSupport && null == cameraStream) {
    const constraints = {
      video: {
        facingMode: { exact: "environment" }
      },
      // video: true,
      audio: false,
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        cameraStream = mediaStream;
        stream.srcObject = mediaStream;
        stream.play();

        setTimeout(() => {
          captureStream();
        }, 2000);
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
      });
  } else {
    alert('Your browser does not support media devices.');
    return;
  }
}

function stopStreaming() {

  if (null != cameraStream) {

    var track = cameraStream.getTracks()[0];

    track.stop();
    stream.load();

    cameraStream = null;
  }
}

async function captureStream() {
  alert('start capturing');

  if (cameraStream !== null) {
    const ctx = capture.getContext('2d');
    const img = new Image();

    ctx.drawImage(stream, 0, 0, capture.width, capture.height);

    img.src = capture.toDataURL("image/png");
    img.width = 320;

    // snapshot.innerHTML = '';

    // snapshot.appendChild(img);

    const QRImage = await dataURLtoFile(img.src, 'QR.png');

    console.log(QRImage);

    ScanCode(QRImage);

    alert('completed scaning');
  }
}

function dataURLtoFile(dataurl, filename) {
  alert('start converting');

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const html5QrCode = new Html5Qrcode(/* element id */ "reader");

function ScanCode(file) {
  alert('start scanning');
  html5QrCode.scanFile(file, /* showImage= */true)
    .then(qrCodeMessage => {
      // success, use qrCodeMessage
      console.log(qrCodeMessage);
      alert(qrCodeMessage);
    })
    .catch(err => {
      // failure, handle it.
      console.log(`Error scanning file. Reason: ${err}`)
      alert(err);
      alert(JSON.stringify(err));
    });
}