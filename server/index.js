const express = require("express");
const { Server } = require("socket.io");

const app = express();
const io = new Server({ cors: true });

app.use(express.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("new Connection");

  socket.on("join-room", (data) => {
    const { email, roomId } = data;
    console.log(`User ${email} joined room ${roomId}`);
    emailToSocketMapping.set(email, socket.id);
    socketToEmailMapping.set(socket.id, email);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { email });
  });

  socket.on("call-user", (data) => {
    const { email, offer } = data;
    const from = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(email);
    socket.to(socketId).emit("incomming-call", { from, offer });
  });

  socket.on("call-accepted", (data) => {
    const { email, answer } = data;
    const socketId = emailToSocketMapping.get(email);
    socket.to(socketId).emit("call-accepted", { answer });
  });
});

app.listen(8000, () =>
  console.log(`Express server is listning at http://localhost:${8000}`)
);
io.listen(8001, () =>
  console.log(`Socket server is listning at http://localhost:${8001}`)
);
