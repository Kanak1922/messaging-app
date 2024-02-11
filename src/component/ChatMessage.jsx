import Avatar from 'react-avatar';
import { Box } from '@mui/material';


function ChatMessage({ message, username }) {

  return message.type === "CHAT" ? (
    <Box sx={{
      width: "96%",
      margin: '4px 0',
      display: 'flex',
      flexDirection: "column",
      alignItems: message.sender === username ? 'flex-end' : 'flex-start',
    }}>
      <Box sx={{
        maxWidth: "80%",
        margin: "2px",
        padding: "8px",
        display: 'flex',
        width: "fit-content",
        flexDirection: "column",
        border: "1px solid gray",
        backgroundColor: "#03030380",
        borderRadius: message.sender === username ? "4px 0px 4px 4px" : "0px 4px 4px 4px",
      }}>

        <Box sx={{
          gap: 1,
          display: 'flex',
          padding: "4px",
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Avatar
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`}
            name={message.sender} size="25" round={true}
          />
          <h4
            style={{
              color: message.sender === username ? "yellow" : "#ffa2ff",
            }}
          >
            {message.sender}
          </h4>
        </Box>
        <Box sx={{
          // backgroundColor: message.sender === username ? '#17333f' : '',
          color: 'white',
          borderRadius: '12px',
          padding: '10px',
          maxWidth: "100%",
          wordWrap: "break-word"
        }}>
          <p>{message.content}</p>
        </Box>

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
        color: message.type === "CONNECT" ? "#13BD13" : "#FF3131",
      }}>
        <p>{message.content}</p>
      </Box>
    </Box>
  );
}

export default ChatMessage;
