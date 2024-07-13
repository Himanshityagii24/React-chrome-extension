import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests

const Translate = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hind
  const translateText = async () => {
    // Replace 'YOUR_API_KEY' with your OpenAI API key
    const apiKey = '';
    const apiUrl = '';

    try {
      const response = await axios.post(apiUrl, {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that translates text into different languages.' },
          { role: 'user', content: `Translate the following text to ${targetLanguage}: ${inputText}` }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.status === 200) {
        setTranslatedText(response.data.choices[0].message.content.trim());
      } else {
        console.error('Error translating text:', response.statusText);
      }
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  return (
    <div>
      <div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate..."
          rows={4}
          cols={50}
        />
        <br />
        <label>Select Language:</label>{' '}
        <select value={targetLanguage} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          {/* Add more options based on the languages you want to support */}
        </select>
        <br />
        <button onClick={translateText}>Translate</button>
      </div>
      <div>
        <h3>Translated Text:</h3>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default Translate;
