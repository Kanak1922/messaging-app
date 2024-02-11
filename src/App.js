import "./App.css"
import { useState } from 'react';
import UsernamePage from './component/UsernamePage.jsx';
import ChatPage from './component/ChatPage.jsx';

function App() {
  const [username, setUsername] = useState("");

  return (
    <main style={{
      width: "100vw",
      height: "100vh"
    }}
    >
      {
        username ? (
          <>
            <ChatPage username={username} />
          </>
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
