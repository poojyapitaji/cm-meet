import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer } = usePeer();

  const [stream, setStream] = useState(null);

  const handleUserJoined = useCallback(
    async ({ email }) => {
      const offer = await createOffer();
      socket.emit("call-user", { email, offer });
      console.log(`new user joined ${email}`);
    },
    [socket, createOffer]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`incomming call from ${from} . Offer :`, offer);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", { email: from, answer });
    },
    [socket, createAnswer]
  );

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      console.log(`call got accepted.`, answer);
      await setRemoteAnswer(answer);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStream = useCallback(async () => {
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // });
    
    console.log(await navigator);
    // setStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncommingCall]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <React.Fragment>
      Room
      <ReactPlayer url={stream} playing muted />
    </React.Fragment>
  );
};
export default Room;
