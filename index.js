const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

async function send(to, body) {
  await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: { body: body }
  }, { headers: { Authorization: 'Bearer ' + TOKEN } });
}

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'hotel_bot_token_2024') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg || msg.type !== 'text') return;
  const from = msg.from;
  const text = msg.text.body.toLowerCase().trim();
  console.log('Mensaje:', text, 'De:', from);
  try {
    if (text.includes('hola') || text === 'menu') {
      await send(from, 'Bienvenido al Hotel Entre Palmas!\n\n1 - Habitaciones y precios\n2 - Servicios\n3 - Preguntas frecuentes\n4 - Reservas\n5 - Hablar con asesor');
    } else if (text === '1' || text.includes('habitacion') || text.includes('precio')) {
      await send(from, 'Nuestras Habitaciones:\n\n- Doble: $430.000/noche\n- Triple: $630.000/noche\n- Suite Deluxe con Banera: $490.000/noche\n\nTodas incluyen desayuno e impuesto.');
    } else if (text === '2' || text.includes('servicio')) {
      await send(from, 'Nuestros Servicios:\n\n- Restaurante: 7am-10pm\n- Recepcion: 24 horas\n- WiFi gratis\n- Parqueadero disponible');
    } else if (text === '3' || text.includes('pregunta')) {
      await send(from, 'Preguntas Frecuentes:\n\n- Check-in: 3pm\n- Check-out: 12pm\n- Direccion: Calle 12 N14-21, Santa Fe, Antioquia\n- Mascotas: No permitidas\n- Pagos: Efectivo y transferencia');
    } else if (text === '4' || text.includes('reserva')) {
      await send(from, 'Para reservar indicanos:\n- Fecha de llegada\n- Fecha de salida\n- Numero de personas\n- Tipo de habitacion\n\nUn asesor confirmara tu reserva.');
    } else if (text === '5' || text.includes('asesor')) {
      await send(from, 'Contacta a nuestro asesor:\nWhatsApp: 3108234989\nHorario: 24 horas');
    } else {
      await send(from, 'Hola! Soy el asistente del Hotel Entre Palmas. Escribe hola para ver el menu.');
    }
  } catch(e) {
    console.error('Error:', e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bot Hotel Entre Palmas en puerto ' + PORT));
