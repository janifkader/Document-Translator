const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // files will be saved to uploads/

app.post('/upload', upload.single('filename'), async (req, res) => {
  console.log(req.file); // contains file info
  const fn = req.file.path;
  fs.readFile(fn, 'utf8', (err, data) => {
    if (err) {
      console.error('Read error:', err);
      return res.status(500).json({ error: 'Failed to read file' });
    }
    res.json({ content: data });
  });
});

app.post('/trans', async (req, res) => {
  const { text, source, target } = req.body;
  if (!text || !source || !target) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = new URLSearchParams();
  params.append("auth_key", "8f3e49b2-ba9f-4f72-b461-ccdb9a397ff1:fx");
  params.append("text", text);
  params.append("source_lang", source);
  params.append("target_lang", target);

  try {
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const translatedText = response.data.translations[0].text;
    //console.log("Translated Text:", response.data);
    //console.log("TARGETED: ", params.get("target_lang"));
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});