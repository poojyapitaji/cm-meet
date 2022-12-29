import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();

  const [stream, setStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleUserJoined = useCallback(
    async ({ email }) => {
      const offer = await createOffer();
      socket.emit("call-user", { email, offer });
      setRemoteEmailId(email);
      console.log(`new user joined ${email}`);
    },
    [socket, createOffer]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`incomming call from ${from} . Offer :`, offer);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", { email: from, answer });
      setRemoteEmailId(from)
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
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setStream(stream);
  }, []);

  const handleNegotiationNeeded = useCallback(() => {
    const localOffer = peer.localDescription;
    socket.emit('call-user', { email: remoteEmailId, offer: localOffer })
  }, [peer.localDescription, remoteEmailId, socket]);

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
    peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
    return () => {
      peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
    }
  }, [peer, handleNegotiationNeeded]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <React.Fragment>
      <h4>You are connected to : {remoteEmailId}</h4>
      <button onClick={e => sendStream(stream)}>Send Stream</button>
      <ReactPlayer url={stream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </React.Fragment>
  );
};
export default Room;
