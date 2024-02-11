import { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import EmojiPicker from 'emoji-picker-react';
import ChatMessage from "./ChatMessage.jsx";
import { Button, TextField, Container, Box } from '@mui/material';

function ChatPage({ username }) {

  const lastElementRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newClient, setNewClient] = useState(null);

  useEffect(() => {
    var url = process.env.REACT_APP_WEBSOCKET_URL;
    var client = Stomp.client(url);

    const onConnect = () => {
      const joinMessage = {
        sender: username,
        content: `${username} connected`,
        type: 'CONNECT',
      };

      client.publish({ destination: '/app/addUser', body: JSON.stringify(joinMessage) });
      client.subscribe('/topic/public', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage.payload]);
      });
      console.log("connected to web socket.");
    };

    const onDisconnect = () => {
      const leaveMessage = {
        sender: username,
        content: `${username} disconnected`,
        type: 'DISCONNECT',
      };
      client.publish({ destination: '/app/addUser', body: JSON.stringify(leaveMessage) });
    };

    client.onConnect = onConnect;
    client.onDisconnect = onDisconnect;

    // Attach the event listener for beforeunload
    const handleBeforeUnload = () => {
      // Disconnect before unloading the page
      if (client.connected) {
        onDisconnect();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Activate the client
    client.activate();
    setNewClient(client);

    // Detach the event listener and deactivate the client when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      client.deactivate();
    };
  }, [username]);


  const sendMessage = () => {
    if (messageInput && newClient) {
      const chatMessage = {
        sender: username,
        content: messageInput,
        type: 'CHAT',
      };
      newClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(chatMessage) });
      setMessageInput("")
      setEmoji(false)
    }
  };

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container
      id={"container__chats"}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "8px"
      }}>
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "scroll",
        }}
      >
        {
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                width: "100%",
              }}
              ref={index === messages.length - 1 ? lastElementRef : null}
            >
              <ChatMessage
                message={message}
                username={username}
              />
            </div>
          ))
        }
      </Box>
      <form style={{
        width: "100%",
        margin: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
      >
        <TextField
          value={messageInput}
          style={{
            width: "96%",
            background: "white",
          }}
          autoComplete={'off'}
          onChange={(event) => {
            setMessageInput(event.target.value)
          }}
          placeholder="Type a message..."
        />
        <div style={{
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            bottom: "60px",
            right: "-96px",
            display: emoji ? "block" : "none"
          }}>
            <EmojiPicker
              onEmojiClick={(data) => {
                setMessageInput((preState) => {
                  return preState + data.emoji
                })
              }}
            />
          </div>
          <Button
            type="button"
            color={emoji ? "error" : "secondary"}
            variant="outlined"
            sx={{
              width: '48px',
              height: '48px',
              marginLeft: "4px",
              borderRadius: '36px',
            }}
            onClick={() => {
              setEmoji((prevState) => !prevState)
            }}
          >
            <img
              src="/smile.png"
              alt="emoji"
              style={{
                width: "28px",
                height: "28px"
              }}
            />
          </Button>
        </div>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          sx={{
            marginLeft: "2px",
            width: '96px',
            height: '48px',
            borderRadius: '36px',
          }}
        >
          Send
        </Button>
      </form>
    </Container>
  );
}
export default ChatPage;
