import io from 'socket.io-client';

const socket = io.connect('http://localhost:9999');

function recvMsg(e) {
    socket.on('datamsg', data => console.log(data));
}

function sendMsg(e) {
    socket.emit('test  data');
}

export { recvMsg };
































