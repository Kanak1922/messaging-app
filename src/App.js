import "./App.css"
import { useState } from 'react';
import UsernamePage from './component/UsernamePage.jsx';
import ChatWindow from './component/ChatWindow.jsx';

function App() {
  const [username, setUsername] = useState("");

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      {
        username ? (
          <div
            id={"container__chats"}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <ChatWindow username={username} />
          </div>
        ) : (
          <>
            <UsernamePage setUsername={setUsername} />
          </>
        )
      }
    </main>
  );
}

export default App;
