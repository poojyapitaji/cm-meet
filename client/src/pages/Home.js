import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/Socket";

const Home = () => {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();
  const { socket } = useSocket();

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  const handleSubmit = () => {
    socket.emit("join-room", { email, roomId });
  };

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  return (
    <React.Fragment>
      <h1>Home Page</h1>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <br />
      <input
        type="number"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room id"
      />
      <br />
      <button type="submit" onClick={handleSubmit}>
        Create Room
      </button>
    </React.Fragment>
  );
};

export default Home;
