import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Search from './pages/Search';
import ARRoom from './pages/ARRoom';
import ARDemo from './pages/ARDemo';
import AIAnalysis from './pages/AIAnalysis';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ar-room" element={<ARRoom />} />
          <Route path="/ar-demo" element={<ARDemo />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;