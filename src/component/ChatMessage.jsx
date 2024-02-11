import Avatar from 'react-avatar';
import { Box } from '@mui/material';


function ChatMessage({ message, username }) {


  return message.type === "CHAT" ? (
    <Box sx={{
      width: "96%",
      margin: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: message.sender === username ? 'flex-end' : 'flex-start',
    }}>
      <Box sx={{
        display: 'flex',
        gap: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <Avatar name={message.sender} size="35" round={true} />
        <h4>{message.sender}</h4>
      </Box>
      <Box sx={{
        backgroundColor: message.sender === username ? 'primary.main' : 'secondary.main',
        color: 'white',
        borderRadius: '12px',
        padding: '10px',
        maxWidth: '80%',
      }}>
        <p>{message.content}</p>
      </Box>
    </Box>
  ) : (
    <Box sx={{
      margin: '8px',
      width: "100%",
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      flexDirection: 'column',
    }}>
      <Box sx={{
        padding: '10px',
        borderRadius: '12px',
        color: message.type === "CONNECT" ? "green" : "#FF3131",
      }}>
        <p>{message.content}</p>
      </Box>
    </Box>
  );
}

export default ChatMessage;
