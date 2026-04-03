const express = require('express'); 
const axios = require('axios'); 
const app = express(); 
app.use(express.json()); 
const TOKEN = process.env.WHATSAPP_TOKEN; 
const PHONE_ID = process.env.PHONE_NUMBER_ID; 
app.get('/webhook', (req, res) => { 
  if (req.query['hub.verify_token'] === 'hotel_bot_token_2024') { 
    res.send(req.query['hub.challenge']); 
  } else { res.sendStatus(403); } 
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
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Bienvenido al Hotel Entre Palmas!\n\n1 - Habitaciones y precios\n2 - Servicios\n3 - Preguntas frecuentes\n4 - Reservas\n5 - Hablar con asesor' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
  try { 
    if (text.includes('hola') || text === 'menu') { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Bienvenido al Hotel Entre Palmas!\n\n1 - Habitaciones y precios\n2 - Servicios\n3 - Preguntas frecuentes\n4 - Reservas\n5 - Hablar con asesor' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else if (text === '1' || text.includes('habitacion') || text.includes('precio')) { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Nuestras Habitaciones:\n\n- Habitacion Doble: $430.000/noche\n- Habitacion Triple: $630.000/noche\n- Suite Deluxe con Banera: $490.000/noche\n\nTodas incluyen desayuno para pareja e impuesto.' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else if (text === '2' || text.includes('servicio')) { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Nuestros Servicios:\n\n- Restaurante: 7am-10pm\n- Recepcion: 24 horas\n- WiFi: Gratis\n- Parqueadero: Disponible' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else if (text === '3' || text.includes('pregunta')) { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Preguntas Frecuentes:\n\n- Check-in: 3pm\n- Check-out: 12pm\n- Direccion: Calle 12 N14-21, Santa Fe, Antioquia\n- Mascotas: No permitidas\n- Pagos: Efectivo y transferencia' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else if (text === '4' || text.includes('reserva')) { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Para reservar indicanos:\n- Fecha de llegada\n- Fecha de salida\n- Numero de personas\n- Tipo de habitacion\n\nUn asesor confirmara tu reserva.' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else if (text === '5' || text.includes('asesor')) { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Te conectamos con un asesor:\nWhatsApp: 3108234989\nHorario: 24 horas' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } else { 
      await axios.post('https://graph.facebook.com/v22.0/' + PHONE_ID + '/messages', { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: 'Hola! Soy el asistente del Hotel Entre Palmas. Escribe hola para ver el menu.' } }, { headers: { Authorization: 'Bearer ' + TOKEN } }); 
    } 
  } catch(e) { console.error('Error:', e.message); } 
}); 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log('Bot Hotel Entre Palmas en puerto ' + PORT)); 
