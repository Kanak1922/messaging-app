import { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatMessage from "./ChatMessage.jsx";
import { Button, TextField, Container, Box } from '@mui/material';

function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const messageInputRef = useRef();
  const [tempMessage, setTempMessages] = useState({});


  useEffect(() => {
    var url = "ws://localhost:8080/ws";
    var client = Stomp.client(url);
    client.onConnect= ()=>{
      const joinMessage = {
        sender: username,
        type: 'CONNECT',
      };
      client.publish({ destination: '/app/addUser', body: JSON.stringify(joinMessage) });
      client.subscribe('/topic/public', message => {
        const newMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, newMessage]);

      });
      console.log("connected to web socket.");
    };

    client.onDisconnect=()=>{
      if (client.connected) {
        const leaveMessage = {
          sender: username,
          type: 'DISCONNECT',
        };
        client.publish({ destination: '/app/addUser', body: JSON.stringify(leaveMessage) });
      }
    };
    
    client.activate();
    setClient(client);

    return () => {
      client.deactivate();
    };
  }, [username]);

  const sendMessage = () => {
    if (messageInputRef.current.value && client) {
      const chatMessage = {
        sender: username,
        content: messageInputRef.value,
        type: 'CHAT',
      };
      client.publish({ destination: '/app/sendMessage', body: JSON.stringify(chatMessage) });
      messageInputRef.current.value = '';
    }
  };

  return (
    <Container>
      <Box>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} username={username} />
        ))}
      
      <TextField inputRef={messageInputRef} placeholder="Type a message..." />
      <Button onClick={sendMessage}>Send</Button>
      </Box>
      {/* <form onSubmit={sendMessage}>
        <TextField inputRef={messageInputRef} placeholder="Type a message..." />
        <Button type="submit">Send</Button>
      </form> */}
    </Container>
  );
}

export default ChatPage;