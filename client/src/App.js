import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Room />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
