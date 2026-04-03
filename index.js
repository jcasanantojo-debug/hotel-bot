const express = require('express'); 
const app = express(); 
app.use(express.json()); 
 
app.get('/webhook', (req, res) => { 
  if (req.query['hub.verify_token'] === 'hotel_bot_token_2024') { 
    res.send(req.query['hub.challenge']); 
  } else { res.sendStatus(403); } 
}); 
 
app.post('/webhook', async (req, res) => { 
  res.sendStatus(200); 
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]; 
  if (msg) console.log('Mensaje:', msg.text?.body, 'De:', msg.from); 
}); 
 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log('Bot en puerto ' + PORT)); 
