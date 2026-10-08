import { useState, useRef } from 'react';

interface SplitScreenSliderProps {
  originalImage: string;
  enhancedImage: string;
  bounding_boxes?: any[];
}

export function SplitScreenSlider({ originalImage, enhancedImage, bounding_boxes }: SplitScreenSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  return (
    <div 
      className="relative w-full h-64 bg-surface-container-lowest rounded-2xl overflow-hidden cursor-ew-resize select-none border border-outline-variant/40 shadow-inner"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Background (Raw Original) */}
      <img 
        src={originalImage} 
        alt="Raw Turbid Optical Feed" 
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Foreground (Enhanced / CLAHE + YOLO) */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={enhancedImage} 
          alt="Enhanced CLAHE Feed" 
          className="absolute top-0 left-0 w-full h-full object-cover filter contrast-125"
          draggable={false}
        />
        
        {/* Render bounding boxes if provided */}
        {bounding_boxes && bounding_boxes.map((box, idx) => (
          <div 
            key={idx}
            className="absolute border-2 border-primary bg-primary/20 rounded-md shadow-glow-sm"
            style={{
              left: `${box.x_min}%`,
              top: `${box.y_min}%`,
              width: `${box.x_max - box.x_min}%`,
              height: `${box.y_max - box.y_min}%`
            }}
          >
            <span className="absolute -top-5 left-0 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              {box.class_name} {(box.confidence * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Slider Divider Line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-glow-sm"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-surface-container-low border border-primary text-primary rounded-full shadow-2xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-primary rounded-full"></div>
            <div className="w-0.5 h-3 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="absolute bottom-2.5 left-2.5 bg-surface-container-low/90 backdrop-blur-md text-on-surface-variant font-mono text-[10px] px-2.5 py-1 rounded-lg border border-outline-variant/40">
        Raw Turbid
      </div>
      <div className="absolute bottom-2.5 right-2.5 bg-primary/90 text-on-primary font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
        CLAHE + YOLO11
      </div>
    </div>
  );
}

export default SplitScreenSlider;
