import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';
import Simulate from './pages/Simulate';
import Hotspots from './pages/Hotspots';
import FieldOps from './pages/FieldOps';
import CircularRecovery from './pages/CircularRecovery';
import ModelLab from './pages/ModelLab';
import OceanGPTWidget from './components/chat/OceanGPTWidget';

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Router>
      <div className="bg-background text-on-surface flex min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
        <Sidebar 
          mobileOpen={mobileNavOpen} 
          onCloseMobile={() => setMobileNavOpen(false)} 
        />
        
        <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full overflow-x-hidden">
          <Header onToggleMobile={() => setMobileNavOpen(prev => !prev)} />
          
          <main className="relative pt-16 flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="/hotspots" element={<Hotspots />} />
              <Route path="/field-ops" element={<FieldOps />} />
              <Route path="/circular-recovery" element={<CircularRecovery />} />
              <Route path="/model-lab" element={<ModelLab />} />
            </Routes>
          </main>
        </div>

        <OceanGPTWidget />
      </div>
    </Router>
  );
}

export default App;
