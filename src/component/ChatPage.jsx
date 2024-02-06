import { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';

import ChatMessage from "./ChatMessage.jsx";
import { Button, TextField, Container, Box } from '@mui/material';

function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [newClient, setNewClient] = useState(null);
  const messageInputRef = useRef();
 

  useEffect(() => {
    var url = "ws://localhost:8080/ws";
    var client = Stomp.client(url);
  
    const onConnect = () => {
      const joinMessage = {
        sender: username,
        content: username + " connected",
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
        content: username + " disconnected",
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
    if (messageInputRef.current.value && newClient) {
      const chatMessage = {
        sender: username,
        content: messageInputRef.current.value,
        type: 'CHAT',
      };
      newClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(chatMessage) });
      messageInputRef.current.value = '';
    }
  };

  return (
    <Container>
      <Box>
        { 
          messages.map((m, index) => (
          <ChatMessage key={index} message={m} username={username} />
        ))}
      <TextField inputRef={messageInputRef} placeholder="Type a message..." />
      <Button onClick={sendMessage}>Send</Button>
      </Box>
    </Container>
  );
}
export default ChatPage;