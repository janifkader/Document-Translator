import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import './App.css'
import logo from '/logo2.png'

function Uploaded() {
  const [sourceLang, setSourceLang] = useState('EN'); // Variables for source language
  const [targetLang, setTargetLang] = useState('EN-GB'); // Variables for target lanuage
  const location = useLocation();
  const content = location.state?.content || 'No content';
  const fn = localStorage.getItem('filename'); // Retrieve filename from local storage
  console.log("File Content: ", content);
  
  /*
   * Compresses the necessary info (languages, content) into JSON format.
   * Sends the JSON to the Node serverr to communicate with the API.
   * DeepL API handles the translation.
   * Waits for translation and then displays it.
   */
  const handleTranslate = async () => {
    const response = await fetch('http://localhost:3000/trans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        source: sourceLang,
        target: targetLang
      }),
    });
  
    const data = await response.json();
    console.log('Translated text:', data.translatedText);
    document.getElementsByClassName("textCont")[0].textContent = data.translatedText;
  };
  
  return (
      <>
        <div>
          <a href="http://localhost:5173">
            <img src={logo} className="logo" alt="Readme logo" />
          </a>
        </div>
        <div>
          <h1>{fn}</h1>
        </div>
        <div>
          <p className="textCont">{content}</p> {/* Where the file content will be displayed */}
        </div>
        <div>
          <label className="opts">Translation Options:</label>
        </div>
        <div> {/* Dropdown menu to select translation languages */}
          <select className="drops" name="src" id="src" value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              <option value="EN">English</option>
              <option value="FR">French</option>
              <option value="ES">Spanish</option>
              <option value="JA">Japanese</option>
            </select>
            <label className="opts"> → </label>
            <select className="drops" name="tar" id="tar" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              <option value="EN-GB">English</option>
              <option value="FR">French</option>
              <option value="ES">Spanish</option>
              <option value="JA">Japanese</option>
            </select>
        </div>
        <div>
          <button className="custom-file-upload" onClick={handleTranslate}>Submit</button>
        </div>
      </>
    );
  }
  
  export default Uploaded;