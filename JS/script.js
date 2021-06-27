var stream = document.getElementById("stream");
var capture = document.getElementById("capture");

var cameraStream = null;
let failureCount = 0;

function startStreaming() {
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

(async function restartStreaming() {
  await stopStreaming();
  await startStreaming();
})();

async function captureStream() {

  if (cameraStream !== null) {
    const ctx = capture.getContext('2d');
    const img = new Image();

    ctx.drawImage(stream, 0, 0, capture.width, capture.height);

    img.src = capture.toDataURL("image/png");
    img.width = 320;

    const QRImage = await dataURLtoFile(img.src, 'QR.png');

    console.log({QRImage});

    ScanCode(QRImage);
  }
}

function dataURLtoFile(dataurl, filename) {
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
  html5QrCode.scanFile(file, /* showImage= */true)
    .then(qrCodeMessage => {
      console.log(qrCodeMessage);
      failureCount = 0;
      window.location = 'https://webwaale.com';
    })
    .catch(err => {
      failureCount++;
      if (failureCount <= 50) {
        captureStream();
      } else {
        failureCount = 0;
        console.log(`Error scanning file. Reason: ${err}`)
        alert(err)
        alert('Unable to scan QR code');
      }
    });
}