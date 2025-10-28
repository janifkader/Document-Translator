import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import axios from "axios";
import pdf from "pdf-parse";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const uploadedFiles = [];

/*
 * Function to delete all of the uploaded files stored in /uploads
 * After the user exits.
 */
function cleanupUploads() {
  uploadedFiles.forEach(filePath => {
    fs.unlink(filePath, err => {
      if (err) {
        console.error(`Failed to delete ${filePath}:`, err);
      } else {
        console.log(`Deleted: ${filePath}`);
      }
    });
  });
}


/*
 * Store the content of files uploaded by the userS.
 */
app.post('/upload', upload.single('filename'), function (req, res){
  console.log(req.file);
  const fn = req.file.path;
  uploadedFiles.push(fn);
  fs.readFile(fn, 'utf8', function (err, data) {
    if (err) {
      console.error('Read error:', err);
      return res.status(500).json({ error: 'Failed to read file' });
    }
    res.json({ content: data }); // Return the file content
  });
});

app.post('/upload/pdf', upload.single('filename'), function(req, res) {
  const fn = req.file.path;
  uploadedFiles.push(fn);
  fs.readFile(fn, 'utf8', function (err, data) {
    if (err) {
      console.error('Read error:', err);
      return res.status(500).json({ error: 'Failed to read file' });
    }
    const dataBuffer = fs.readFileSync(req.body);
    pdf(dataBuffer).then(function (text) {
      return res.json({ content: text });
    });
    return res.status(500).json({ error: 'Failed to transcribe file' });
  });
});

/*
 * Receive the text and language information from the React program.
 * Embed those parameters and send them to the DeepL API to handle translation.
 * Return the translation to React.
 */
app.post('/trans', async (req, res) => {
  const { text, source, target } = req.body;
  if (!text || !source || !target) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = new URLSearchParams(); // Embed parameters
  params.append("auth_key", "8f3e49b2-ba9f-4f72-b461-ccdb9a397ff1:fx");
  params.append("text", text);
  params.append("source_lang", source);
  params.append("target_lang", target);

  try {
    const response = await axios.post( // Send an API request for translation.
      'https://api-free.deepl.com/v2/translate',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const translatedText = response.data.translations[0].text; // Retrieve the translation.
    res.json({ translatedText }); // Return the translation.
  } 
  catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', () => { // Clean up the uploads after user exists.
  console.log('\nShutting down server...');
  cleanupUploads();
  process.exit();
});