// // api/ttsProxy.js
// const axios = require('axios');

// module.exports = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   try {
//     const playhtOptions = {
//       method: 'POST',
//       url: 'https://api.play.ht/api/v2/tts/stream',
//       headers: {
//         accept: 'audio/mpeg',
//         'content-type': 'application/json',
//         AUTHORIZATION: 'Bearer c82a9d7e0e2f4c6a92d34be3ccf150d7',
//         'X-USER-ID': 'vvO6woKp0TP1PvV24dg1xg6Xxds2'
//       },
//       data: {
//         voice_engine: 'PlayHT2.0-turbo',
//         text: req.body.text, // Ensure req.body.text is provided
//         voice: req.body.voice, // Ensure req.body.voice is provided
//         output_format: 'mp3',
//         sample_rate: '44100',
//         speed: 1,
//       },
//       responseType: 'arraybuffer'
//     };

//     const audioResponse = await axios.request(playhtOptions);
//     res.setHeader('Content-Type', 'audio/mpeg');
//     res.send(audioResponse.data);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   }
// };