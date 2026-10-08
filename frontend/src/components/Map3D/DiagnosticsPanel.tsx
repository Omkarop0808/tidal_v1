import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { SplitScreenSlider } from '../Vision/SplitScreenSlider';

export function DiagnosticsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`absolute top-20 right-6 w-96 bg-black border-2 border-[#333333] shadow-2xl transition-all duration-0 z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'
    }`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -left-12 bg-black border-2 border-r-0 border-[#333333] text-white p-3 hover:bg-white hover:text-black transition-none flex items-center justify-center"
        aria-label="Toggle Vision Diagnostics"
      >
        <Eye className="w-5 h-5" />
      </button>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center text-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-white font-headline font-black text-sm uppercase tracking-tighter">VISION DIAGNOSTICS</h2>
          </div>
          <span className="text-[10px] font-mono text-black font-bold uppercase bg-white px-2 py-1 tracking-widest">CLAHE + YOLO11</span>
        </div>
        
        <div className="text-[10px] font-mono text-[#a3a3a3] flex flex-col gap-2 tracking-widest uppercase">
          <p className="text-white font-bold">DRONE FEED: SECTOR 04 (VERSOVA CREEK)</p>
          <p className="text-[#525252]">REAL-TIME CONTRAST-ENHANCED UNDERWATER DEBRIS CLASSIFICATION.</p>
        </div>

        {/* Split Screen Slider */}
        <div className="border-2 border-[#333333] overflow-hidden grayscale">
          <SplitScreenSlider 
            originalImage="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=500&q=80"
            enhancedImage="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=500&q=80&sat=150&con=150"
            bounding_boxes={[
              { x_min: 20, y_min: 30, x_max: 40, y_max: 50, class_name: "plastic", confidence: 0.92 },
              { x_min: 60, y_min: 45, x_max: 85, y_max: 65, class_name: "net", confidence: 0.85 }
            ]}
          />
        </div>
        
        {/* Feature Contribution Box */}
        <div className="bg-[#111111] p-4 border-2 border-[#333333] flex flex-col gap-4 font-mono uppercase tracking-widest font-bold">
          <div className="flex items-center justify-between border-b-2 border-[#333333] pb-2">
            <span className="text-[10px] text-[#a3a3a3]">EXPLAINABILITY</span>
            <span className="text-[10px] text-white">XGBOOST WEIGHTS</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] text-white">
                <span>ONSHORE WIND (+32.5)</span>
                <span className="text-[#ff4d00]">+80%</span>
              </div>
              <div className="h-2 w-full bg-black border border-[#333333]">
                <div className="h-full bg-[#ff4d00] w-[80%]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] text-white">
                <span>CURRENT VELOCITY (-7.5)</span>
                <span className="text-white">20%</span>
              </div>
              <div className="h-2 w-full bg-black border border-[#333333]">
                <div className="h-full bg-white w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DiagnosticsPanel;
