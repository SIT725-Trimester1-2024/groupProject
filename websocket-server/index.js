const express = require("express");
const socket = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const server = app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
const io = socket(server);
//a map to store all the connected users userId:socketId
let connectedUsers = new Map();
//init socket.io
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    //listen for user id
    socket.on('userId', (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(connectedUsers);
    });
});

//api to send notification to user
app.post('/send-notification', (req, res) => {
    const { userId, message } = req.body;
    const socketId = connectedUsers.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification', message);
        return res.status(200).send('Notification sent');
    }
    return res.status(404).send('User not connected');
});