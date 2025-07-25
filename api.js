// Import Express.js
const axios = require('axios');
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', async(req, res) => {
  const body = req.body

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  ){
    const message = body.entry[0].changes[0].value.messages[0]
    const from = message.from
    const text = message.text?.body || ''

    console.log(`Mensagem recebida de ${from} : ${text}`)

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`
      , {
        messaging_product: 'whatsapp',
        to: from,
        text: {
          body: `Olá! Eu sou um vendedor da NGS`
        }
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
           'Content-Type': 'application/json',
        }
      })
      console.log("Mensagem enviada com sucesso!")
    } catch (error) {
      console.error('Erro ao enviar resposta:', error.response?.data || error.message);
    }
  }
  res.sendStatus(200)
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});