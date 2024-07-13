const express = require('express');
const multer = require('multer');
const poppler = require('pdf-poppler');
const tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// OCR route for PDF
app.post('/convert-pdf', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = file.path;

  try {
    // Convert PDF to images
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const options = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: 'converted',
      page: 1 // Convert only the first page
    };

    await poppler.convert(filePath, options);

    // Get list of converted images (expecting only one)
    const files = fs.readdirSync(outputDir);
    const imageFileName = files[0]; 

    // Perform OCR on the converted image
    const imagePath = path.join(outputDir, imageFileName);
    const { data: { text } } = await tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m),
    });

    const image = `output/${imageFileName}`;

    res.send({ image, ocrResult: { text } });

    // Clean up: delete uploaded PDF file and converted image
    fs.unlinkSync(filePath);
    fs.unlinkSync(imagePath);
  } catch (err) {
    console.error('Error converting PDF or performing OCR:', err);
    res.status(500).send('Error converting PDF or performing OCR.');
  }
});

// OCR route for images
app.post('/convert-image', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = file.path;

  try {
    // Perform OCR on the uploaded image
    const { data: { text } } = await tesseract.recognize(filePath, 'eng', {
      logger: (m) => console.log(m),
    });

    res.send({ ocrResult: { text } });

    // Clean up: delete uploaded image file
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Error performing OCR on image:', err);
    res.status(500).send('Error performing OCR on image.');
  }
});

// Serve static files from the output directory
app.use('/output', express.static(path.join(__dirname, 'output')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
