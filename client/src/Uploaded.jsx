import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import './App.css'
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '/logo2.png'

function Uploaded() {
  const [sourceLang, setSourceLang] = useState('EN'); 
  const [targetLang, setTargetLang] = useState('EN-GB'); 
  const [page, setPage] = useState(1);
  const [translations, setTranslations] = useState({});
  const location = useLocation();
  const fn = location.state?.filename || 'No filename';
  const pages = Array.isArray(location.state?.pages) ? location.state.pages : null;
  const initialContent = location.state?.content || 'No content';
  const originalText = pages ? pages[page - 1].text : initialContent;
  const textToDisplay = translations[page] || originalText;

  const handleNext = function () {
    if (pages && page < pages.length) {
      setPage(page + 1);
    }
  }

  const handlePrevious = function () {
    if (page > 1) {
      setPage(page - 1);
    }
  }

   /*
   * Compresses the necessary info (languages, content) into JSON format.
   * Sends the JSON to the Node serverr to communicate with the API.
   * DeepL API handles the translation.
   * Waits for translation and then displays it.
   */

  const handleTranslate = async () => {
    try {
      const response = await fetch('http://localhost:3000/trans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText, 
          source: sourceLang,
          target: targetLang
        }),
      });
  
      const data = await response.json();
      console.log('Translated text:', data.translatedText);
      setTranslations(prevTranslations => ({
        ...prevTranslations,
        [page]: data.translatedText 
      }));
      
    } catch (error) {
      console.error("Translation failed", error);
    }
  };
  
  const handleRevert = () => {
    setTranslations(prev => {
        const copy = { ...prev };
        delete copy[page];
        return copy;
    });
  }

  return (
      <>
        <div>
          <a href="/">
            <img src={logo} className="logo" alt="Readme logo" />
          </a>
        </div>
        <div>
          <h1>{fn}</h1>
        </div>
        <div>
          <p className="textCont">{textToDisplay}</p> 
        </div>
        
        {pages && (
            <div>
              {page === pages.length && <> <IconButton size="large" onClick={handlePrevious}>
                 <ArrowBackIcon sx={{ color: "#5073F0", fontSize: 40 }} /> 
              </IconButton> </> }
              {page === 1 && <> <IconButton size="large" onClick={handleNext}>
                 <ArrowForwardIcon sx={{ color: "#5073F0", fontSize: 40 }} />
              </IconButton> </> }
              <p style={{ color: "#5073F0", fontSize: "large", fontWeight: "bold" }}>Page {page} of {pages.length}</p>
            </div>
        )}

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
          <button className="custom-file-upload" onClick={handleTranslate}>
             { pages ? `Translate Page ${page}` : 'Translate' }
          </button>
          
          {/* Show a "Revert" button only if this specific page is currently translated */}
          {translations[page] && (
             <button className="custom-file-upload" onClick={handleRevert} style={{marginLeft: '10px'}}>
                Revert to Original
             </button>
          )}
        </div>
      </>
    );
  }
  
  export default Uploaded;