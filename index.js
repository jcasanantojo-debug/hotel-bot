const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = '1tyRhHmcidb12DTuRLDqEHIsOy4rfMNf_7Iyal1UVFFA';

async function getSheetData(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const res = await axios.get(url);
  const json = JSON.parse(res.data.substring(47).slice(0, -2));
  const rows = json.table.rows;
  const cols = json.table.cols.map(c => c.label);
  return rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => { obj[cols[i]] = cell ? cell.v : ''; });
    return obj;
  });
}

async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
    { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'hotel_bot_token_2024') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (msg) {
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase().trim();
    console.log('Mensaje:', text, 'De:', from);

    try {
      if (text.includes('hola') || text.includes('buenos') || text === 'menu' || text === 'menú') {
        await sendMessage(from,
          '🌴 *Bienvenido al Hotel Entre Palmas*\n' +
          'Calle 12 N14-21, Santa Fe, Antioquia\n' +
          'Atención las 24 horas ✅\n\n' +
          'Por favor elige una opción:\n\n' +
          '1️⃣ Habitaciones y precios\n' +
          '2️⃣ Servicios del hotel\n' +
          '3️⃣ Preguntas frecuentes\n' +
          '4️⃣ Hacer una reserva\n' +
          '5️⃣ Hablar con un asesor'
        );

      } else if (text === '1' || text.includes('habitacion') || text.includes('habitación') || text.includes('precio')) {
        const habitaciones = await getSheetData('habitaciones');
        let respuesta = '🛏️ *Nuestras Habitaciones*\n\n';
        habitaciones.forEach(h => {
          respuesta += `*${h.tipo}*\n`;
          respuesta += `💰 $${Number(h.precio).toLocaleString('es-CO')} por noche\n`;
          respuesta += `👥 ${h.capacidad}\n`;
          respuesta += `✅ ${h.descripcion}\n\n`;
        });
        respuesta += 'Escribe *4* para hacer una reserva.';
        await sendMessage(from, respuesta);

      } else if (text === '2' || text.includes('servicio')) {
        const servicios = await getSheetData('servicios');
        let respuesta = '🌟 *Nuestros Servicios*\n\n';
        servicios.forEach(s => {
          respuesta += `*${s.servicio}*\n`;
          respuesta += `🕐 ${s.horario}\n`;
          respuesta += `${s.descripcion}\n\n`;
        });
        await sendMessage(from, respuesta);

      } else if (text === '3' || text.includes('pregunta') || text.includes('info')) {
        const faqs = await getSheetData('faq');
        let respuesta = '❓ *Preguntas Frecuentes*\n\n';
        faqs.forEach(f => {
          respuesta += `*${f.Pregunta}*\n${f.Respuesta}\n\n`;
        });
        await sendMessage(from, respuesta);

      } else if (text === '4' || text.includes('reserva')) {
        await sendMessage(from,
          '📅 *Hacer una Reserva*\n\n' +
          'Por favor indícanos:\n\n' +
          '📌 Fecha de llegada\n' +
          '📌 Fecha de salida\n' +
          '📌 Número de personas\n' +
          '📌 Tipo de habitación\n\n' +
          'Un asesor confirmará tu reserva a la brevedad. 🙏'
        );

      } else if (text === '5' || text.includes('asesor') || text.includes('humano')) {
        await sendMessage(from,
          '👤 *Hablar con un Asesor*\n\n' +
          'Te conectamos con nuestro equipo:\n' +
          '📱 WhatsApp: 3108234989\n\n' +
          'Horario de atención: 24 horas ✅\n' +
          'En breve uno de nuestros asesores te atenderá. 🙏'
        );

      } else {
        await sendMessage(from,
          '👋 Hola, soy el asistente del *Hotel Entre Palmas*.\n\n' +
          'Escribe *hola* o *menú* para ver nuestras opciones. 🌴'
        );
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot Hotel Entre Palmas escuchando en puerto ${PORT}`);
});