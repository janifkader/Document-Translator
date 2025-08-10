import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Uploaded from './Uploaded.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/uploaded" element={<Uploaded />} />
    </Routes>
  );
}

export default App;