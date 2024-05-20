
const socket = io('/');
const myPeer = new Peer();

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

myPeer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(myStream => {
    addVideoStream(myVideo, myStream);
    
    myPeer.on('call', (call) => {
        call.answer(myStream);

        const userVideo = document.createElement('video');
        call.on('stream', (userStream) => {
            addVideoStream(userVideo, userStream);
        });

        call.on('close', () => {
            userVideo.remove();
        });
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, myStream);
    });
})



const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    
    const userVideo = document.createElement('video');
    call.on('stream', (userStream) => {
        addVideoStream(userVideo, userStream);
    });

    call.on('close', () => {
        userVideo.remove()
    });
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}