const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhook', (req, res) => {
  const token = 'hotel_bot_token_2024';
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const msg = req.body.entry?.[0]
    ?.changes?.[0]?.value?.messages?.[0];
  if (msg) {
    console.log('Mensaje recibido:', msg.text?.body);
    console.log('De:', msg.from);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot del hotel escuchando en puerto ${PORT}`);
});