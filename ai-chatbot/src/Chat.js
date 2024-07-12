import React, { useState } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, fromUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await axios.post('https://api.dialogflow.com/v1/query?v=20150910', {
          query: input,
          lang: 'en',
          sessionId: '12345'
        }, {
          headers: {
            'Authorization': `Bearer YOUR_DIALOGFLOW_CLIENT_ACCESS_TOKEN`
          }
        });

        const botMessage = { text: response.data.result.fulfillment.speech, fromUser: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message to Dialogflow:', error);
        const errorMessage = { text: 'Sorry, something went wrong.', fromUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

      setInput('');
    }
  };

  return (
    <Container>
      <Paper style={{ height: '70vh', overflow: 'auto', padding: '1rem' }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.text}
                secondary={message.fromUser ? 'You' : 'Bot'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <TextField
        fullWidth
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
      />
      <Button onClick={sendMessage}>Send</Button>
    </Container>
  );
};

export default Chat;
