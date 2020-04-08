'use strict';

const servers = null;  // might need to specify a STUN or TURN server here?

// Create peer connections and add behavior.
let pc = new RTCPeerConnection(servers);

pc.onicecandidate = (event) => {
    if (event.candidate) {
      drawsocket.send({
          'event': {
              key: 'onICEandiate',
              val: JSON.stringify(event.candidate)
          }
        });
    }
  }
  
async function handleWebRTCMessage(data) {
    const { message_type, content } = data;
    // ...
    if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
       await pc.addIceCandidate(content);
    }
}



const servers = null;  // Allows for RTC server configuration.

// Create peer connections and add behavior.
localPeerConnection = new RTCPeerConnection(servers);
trace('Created local peer connection object localPeerConnection.');

localPeerConnection.addEventListener('icecandidate', handleConnection);
localPeerConnection.addEventListener(
  'iceconnectionstatechange', handleConnectionChange);



// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));