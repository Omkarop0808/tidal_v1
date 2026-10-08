import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  ShieldCheck, 
  PlayCircle, 
  StopCircle, 
  Sparkles, 
  Recycle, 
  Truck, 
  CheckCircle2,
  FileText,
  Sliders
} from 'lucide-react';
import { api } from '../lib/api';

export default function CircularRecovery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isClaheActive, setIsClaheActive] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [manifestGenerated, setManifestGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setManifestGenerated(false);
      
      const formData = new FormData();
      formData.append('file', file);

      setIsAnalyzing(true);
      try {
        const result = await api.reportObservation(formData);
        setAnalysisResult(result);
      } catch (error) {
        console.error("Error analyzing image:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleExecuteManifest = () => {
    setManifestGenerated(true);
  };

  const estimatedWeight = isLiveMode ? 25.0 : (analysisResult?.ai_analysis?.estimated_weight_kg || 18.4);
  const spotRate = 35.0; // ₹35/kg
  const grossValue = Math.round(estimatedWeight * spotRate);

  return (
    <main className="w-full bg-background min-h-screen text-on-surface px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-8">
        
        {/* Header Bar */}
        <div className="flex flex-col gap-2 pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5" />
              CIRCULAR VALUATION & DOWNSTREAM EXCHANGE
            </span>
            <span className="text-on-surface-variant font-mono text-xs">
              // YOLO11 + GEMINI 2.5 FLASH DUAL-STAGE PIPELINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight text-on-surface">
            Marine Plastics Valuation & Upcycler Exchange
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            Upload field drone imagery or activate the live coastal camera stream. YOLO11 executes CLAHE-enhanced bounding-box classification, while Gemini determines polymer composition, calculates real-time spot valuation, and matches local upcycling facilities.
          </p>
        </div>

        {/* 2-Column Grid: Vision Input (6 cols) & Plastics Exchange HUD (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Drone Feed / Vision Upload Viewport (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative w-full h-[520px] bg-surface-container-low border-2 border-dashed border-outline-variant/40 rounded-3xl overflow-hidden flex items-center justify-center group shadow-2xl">
              
              {isLiveMode ? (
                <div className="absolute inset-0 bg-surface-container-lowest overflow-hidden flex flex-col justify-center items-center">
                  
                  {/* Top HUD Overlay */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-error/40 text-xs font-mono text-error font-semibold shadow-lg pointer-events-auto">
                      <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                      <span>LIVE DRONE FEED // SECTOR 04</span>
                    </div>

                    <button 
                      onClick={() => setIsClaheActive(!isClaheActive)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs border shadow-lg pointer-events-auto transition-colors flex items-center gap-1.5 ${
                        isClaheActive 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-surface-container-low/90 border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>CLAHE {isClaheActive ? 'ON (Turbid Filter)' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* Drone Viewport Image */}
                  <div className={`relative w-full h-full bg-[url('https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-all ${
                    isClaheActive ? 'filter contrast-125 saturate-125' : 'opacity-70'
                  }`}>
                    {/* Simulated live YOLO bounding boxes */}
                    <div className="absolute border-2 border-error bg-error/15 top-[38%] left-[28%] w-[20%] h-[22%] rounded-lg flex items-start justify-start p-1.5 shadow-glow-error">
                      <span className="bg-error text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                        PET Bottles (88%)
                      </span>
                    </div>

                    <div className="absolute border-2 border-primary bg-primary/15 top-[58%] left-[56%] w-[24%] h-[20%] rounded-lg flex items-start justify-start p-1.5 shadow-glow-sm">
                      <span className="bg-primary text-on-primary text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                        Nylon Net (92%)
                      </span>
                    </div>

                    {/* Laser scanning line animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(0,242,254,1)] animate-scan-line"></div>
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded Debris" 
                    className="w-full h-full object-cover filter contrast-125 saturate-150" 
                  />

                  {/* Bounding Boxes overlay */}
                  {analysisResult?.ai_analysis?.bounding_boxes?.map((box: any, i: number) => {
                    const [y1, x1, y2, x2] = box.box_2d || [50, 50, 200, 200];
                    return (
                      <div 
                        key={i}
                        className="absolute border-2 border-primary bg-primary/20 rounded-lg shadow-glow-sm"
                        style={{
                          top: `${(y1 / 480) * 100}%`,
                          left: `${(x1 / 640) * 100}%`,
                          height: `${((y2 - y1) / 480) * 100}%`,
                          width: `${((x2 - x1) / 640) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-primary text-on-primary text-[10px] font-mono px-2 py-0.5 rounded font-bold shadow-md">
                          {box.label} {((box.confidence || 0.89) * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-on-surface-variant p-8 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center border border-outline-variant/30 text-primary">
                    <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">Upload Debris Capture or Activate Drone Feed</p>
                    <p className="text-xs font-mono text-on-surface-variant mt-1">Supports High-Res JPG, PNG, and Turbid Underwater Imagery</p>
                  </div>
                </div>
              )}

              {/* Bottom Control Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => { setIsLiveMode(false); handleImageUpload(e); }} 
                  accept="image/*" 
                  className="hidden" 
                />

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-low/95 hover:bg-surface-container text-on-surface font-headline font-semibold text-xs border border-outline-variant/50 shadow-2xl flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4 text-primary" />
                  <span>Upload Image</span>
                </button>

                <button 
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`px-5 py-2.5 rounded-2xl font-headline font-bold text-xs flex items-center gap-2 shadow-2xl transition-all ${
                    isLiveMode 
                      ? 'bg-error text-white hover:bg-error/90 shadow-glow-error' 
                      : 'bg-gradient-to-r from-primary to-secondary text-on-primary hover:shadow-glow'
                  }`}
                >
                  {isLiveMode ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      <span>Stop Drone Feed</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Stream Live Camera</span>
                    </>
                  )}
                </button>
              </div>

              {/* Analyzing Spinner Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/85 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-50">
                  <div className="w-12 h-12 rounded-full border-3 border-surface-container-highest border-t-primary animate-spin"></div>
                  <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                    CLAHE Preprocessing & YOLO11 Detection in Progress...
                  </p>
                </div>
              )}
            </div>

            <span className="text-[11px] font-mono text-on-surface-variant text-center">
              Real-time CLAHE equalization actively clarifies murky coastal waters for neural segmentation.
            </span>
          </div>

          {/* Right: Plastics Exchange HUD & Upcycler Matching (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-on-surface flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-primary" />
                Plastics Exchange & Upcycler Contract
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                COMMODITY LIVE
              </span>
            </div>

            {/* Live Spot Market Rates */}
            <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant font-semibold">
                  Mumbai Spot Polymer Benchmark
                </span>
                <span className="text-[10px] font-mono text-primary">Updated 5m ago</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3.5 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                  <div className="text-[10px] text-on-surface-variant uppercase">Clear PET</div>
                  <div className="font-bold text-base text-primary mt-1">₹35.00 / kg</div>
                </div>
                <div className="p-3.5 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                  <div className="text-[10px] text-on-surface-variant uppercase">Rigid HDPE</div>
                  <div className="font-bold text-base text-secondary mt-1">₹28.50 / kg</div>
                </div>
                <div className="p-3.5 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                  <div className="text-[10px] text-on-surface-variant uppercase">Nylon Ghost Nets</div>
                  <div className="font-bold text-base text-emerald-400 mt-1">₹42.00 / kg</div>
                </div>
              </div>
            </div>

            {/* Current Catch Valuation */}
            <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                Batch Valuation Estimation
              </h3>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant uppercase">Classified Mass</span>
                  <span className="text-3xl font-headline font-bold text-on-surface">
                    {estimatedWeight.toFixed(1)} kg
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant uppercase">Gross Value</span>
                  <span className="text-3xl font-headline font-bold text-emerald-400">
                    ₹{grossValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Upcycler Match Contract */}
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden shadow-glow-success">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <ShieldCheck className="w-32 h-32 text-emerald-400" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Upcycler Match Contract
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CSR CERTIFIED
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-1">
                <h3 className="text-2xl font-headline font-bold text-on-surface">
                  {isLiveMode ? 'Lucro Plastecycle Pvt Ltd' : (analysisResult?.matched_upcycler || 'Lucro Plastecycle')}
                </h3>
                <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Facility Distance: 12.4 km via Coastal Expressway
                </span>
              </div>

              {manifestGenerated ? (
                <div className="relative z-10 p-4 rounded-2xl bg-surface-container/90 border border-emerald-500/50 flex flex-col gap-2 font-mono text-xs text-emerald-400">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Manifest #TIDAL-MNF-8829 Generated
                    </span>
                    <span className="text-[10px] text-on-surface-variant">Auth Key: 0x8F92...B2</span>
                  </div>
                  <span className="text-[11px] text-on-surface">
                    Batch: {estimatedWeight}kg PET • Recycler: Lucro Plastecycle • Status: Queued for Collection
                  </span>
                </div>
              ) : (
                <button 
                  onClick={handleExecuteManifest}
                  className="relative z-10 self-start px-6 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-headline font-bold text-xs border border-emerald-500/50 shadow-sm hover:shadow-glow-success transition-all duration-300 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Execute Material Transfer Manifest</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
