import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import './App.css'
import logo from '/logo2.png'

function Uploaded() {
  const [sourceLang, setSourceLang] = useState('EN');
  const [targetLang, setTargetLang] = useState('EN-GB');
  const location = useLocation();
  const content = location.state?.content || 'No content';
  const fn = localStorage.getItem('filename');
  console.log("File Content: ", content);
  
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
          <p className="textCont">{content}</p>
        </div>
        <div>
          <label className="opts">Translation Options:</label>
        </div>
        <div>
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