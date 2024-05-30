import { createClient } from '@deepgram/sdk';

const deepgramApiKey = 'a2fb93bead86e4241e0d7fef32f61af25c272f58'; // Replace with your API key

export const transcribeAudio = async (audioBlob) => {
  const deepgram = createClient(deepgramApiKey);
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch('https://api.deepgram.com/v1/listen', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${deepgramApiKey}`,
      'Content-Type': 'audio/wav',
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};