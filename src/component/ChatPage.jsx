import { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatMessage from "./ChatMessage.jsx";
import { Button, TextField, Container, Box } from '@mui/material';

function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [newClient, setNewClient] = useState(null);
  const messageInputRef = useRef();
  const [tempMessage, setTempMessages] = useState({});
  const joinMessage = {
    sender: username,
    content: username+" connected",
    type: 'CONNECT',
  };

  useEffect(() => {
    var url = "ws://localhost:8080/ws";
    var client = Stomp.client(url);
    client.onConnect= ()=>{
      
      client.publish({ destination: '/app/addUser', body: JSON.stringify(joinMessage) });
      client.subscribe('/topic/public',(message) => {
        console.log("Message body ");
        console.log(message.body);
        
        const newMessage = JSON.parse(message.body);
        console.log(newMessage);

        console.log("new Message body");
        console.log(newMessage.payload);
        setMessages(prevMessages => [...prevMessages, newMessage.payload]);
      });
      console.log("connected to web socket.");
    };

    client.onDisconnect=()=>{
      if (client.connected) {
        const leaveMessage = {
          sender: username,
          content: username+" disconnected",
          type: 'DISCONNECT',
        };
        client.publish({ destination: '/app/addUser', body: JSON.stringify(leaveMessage)});
      }
    };
    
    client.activate();
    setNewClient(client);

    return () => {
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
      setTempMessages(chatMessage);
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