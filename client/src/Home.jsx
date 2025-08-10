import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '/logo2.png'
import './App.css'


function Home() {
  const [showSubmit, setShowSubmit] = useState(false)
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
        console.error("No file selected");
        return;
    }

    const formData = new FormData();
    formData.append('filename', file);

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    navigate('/uploaded', { state: { content: result.content } });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);  // <--- add this
    localStorage.setItem('filename', selectedFile.name);
    if (selectedFile) {
        setFile(selectedFile);
        setShowSubmit(true);
    }
    event.target.value = '';
  }

  return (
    <>
      <div>
        <a href="http://localhost:5173">
          <img src={logo} className="logo" alt="Readme logo" />
        </a>
      </div>
      <h1>Welcome to your new document translator</h1>
      <div className="card">
      {!showSubmit && (
        <label htmlFor="myFile" className="custom-file-upload" id="mainBut">
          Upload Document
        </label>
      )}
      {showSubmit && (
        <button onClick={handleUpload} className="custom-file-upload" id="secBut">
            Submit Translation
        </button>
      )}
      <input type="file" id="myFile" name="filename" style={{ display: 'none' }} onChange={handleFileChange}></input>
      </div>
      <p className="read-the-docs">
        Translate any .txt file with ReadMe
      </p>
    </>
  )
}

export default Home
