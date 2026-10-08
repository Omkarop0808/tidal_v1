import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { SplitScreenSlider } from '../Vision/SplitScreenSlider';

export function DiagnosticsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`absolute top-16 right-4 w-96 bg-surface-container-low/95 backdrop-blur-2xl border border-outline-variant/50 shadow-2xl rounded-3xl transition-all duration-300 z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)]'
    }`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -left-12 bg-surface-container-low/95 border-y border-l border-outline-variant/50 text-primary p-3 rounded-l-2xl shadow-xl hover:bg-surface-container transition-all flex items-center justify-center"
        aria-label="Toggle Vision Diagnostics"
      >
        <Eye className="w-5 h-5 text-primary" />
      </button>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-on-surface font-headline font-bold text-sm">Vision Diagnostics</h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">CLAHE + YOLO11</span>
        </div>
        
        <div className="text-xs font-mono text-on-surface-variant flex flex-col gap-1">
          <p className="text-on-surface font-semibold">Drone Feed: Sector 04 (Versova Creek Outfall)</p>
          <p className="text-[11px] text-on-surface-variant/80">Real-time contrast-enhanced underwater debris classification.</p>
        </div>

        {/* Split Screen Slider */}
        <div className="rounded-2xl overflow-hidden border border-outline-variant/40">
          <SplitScreenSlider 
            originalImage="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=500&q=80"
            enhancedImage="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=500&q=80&sat=150&con=150"
            bounding_boxes={[
              { x_min: 20, y_min: 30, x_max: 40, y_max: 50, class_name: "plastic", confidence: 0.92 },
              { x_min: 60, y_min: 45, x_max: 85, y_max: 65, class_name: "net", confidence: 0.85 }
            ]}
          />
        </div>
        
        {/* SHAP Feature Contribution Box */}
        <div className="bg-surface-container/70 p-4 rounded-2xl border border-outline-variant/40 flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">SHAP Explainability</span>
            <span className="text-[10px] text-primary">XGBoost Weights</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-on-surface">
                <span>Onshore Wind (+32.5)</span>
                <span className="text-error font-bold">+80%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full w-[80%]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-on-surface">
                <span>Current Velocity (-7.5)</span>
                <span className="text-secondary font-bold">20%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DiagnosticsPanel;
