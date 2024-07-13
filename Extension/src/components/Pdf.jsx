import React, { useState } from 'react';
import axios from 'axios';

const Pdf = () => {
  const [image, setImage] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImage(''); 
    setOcrResult(''); 
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file); // Ensure correct key ('file' based on backend)

    try {
      const response = await axios.post(
        file.type === 'application/pdf' ? 'http://localhost:5000/convert-pdf' : 'http://localhost:5000/convert-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (file.type === 'application/pdf') {
        setImage(response.data.image);
      }
      setOcrResult(response.data.ocrResult.text);

      console.log('OCR Result:', response.data.ocrResult.text);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>PDF/Image to Text with OCR</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload and Convert'}
      </button>
      {image && (
        <div>
          {image.endsWith('.pdf') ? (
            <embed src={`http://localhost:5000/${image}#toolbar=0`} width="800" height="600" type="application/pdf" />
          ) : (
            <img src={`http://localhost:5000/${image}`} alt="Converted Page" />
          )}
          <p>OCR Text: {ocrResult || 'No OCR result available'}</p>
        </div>
      )}
    </div>
  );
};

export default Pdf;
