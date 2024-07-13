import React, { useState } from 'react';
import axios from 'axios';

const OCRPage = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setText('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setText('');

    if (!file) {
      setError('Please select a file');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const isPDF = file.type === 'application/pdf';
      const url = isPDF ? 'http://localhost:5000/convert-pdf' : 'http://localhost:5000/ocr';
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (isPDF) {
        setImages(response.data.images || []);
        setOcrResults(response.data.ocrResults || []);
      } else {
        setText(response.data.text);
      }
    } catch (error) {
      console.error('Error processing file:', error.message);
      setError('Error processing file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>OCR Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {text && <div><h2>Extracted Text:</h2><p>{text}</p></div>}
      {images.length > 0 && (
        <div>
          <h2>Extracted Text from Images:</h2>
          {images.map((image, index) => (
            <div key={index}>
              <img src={`http://localhost:5000/${image}`} alt={`Page ${index + 1}`} />
              <p>OCR Text: {ocrResults[index]?.text || 'No OCR result available'}</p>
            </div>
          ))}
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default OCRPage;
