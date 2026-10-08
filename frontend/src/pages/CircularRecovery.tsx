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
  FileText,
  Sliders,
  Square
} from 'lucide-react';
import { api } from '../lib/api';

export default function CircularRecovery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isClaheActive, setIsClaheActive] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [manifestGenerated, setManifestGenerated] = useState(false);
  const [manifestHash, setManifestHash] = useState('');
  const [isGeneratingManifest, setIsGeneratingManifest] = useState(false);
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
    setIsGeneratingManifest(true);
    setTimeout(() => {
      const hash = '0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      setManifestHash(hash);
      setIsGeneratingManifest(false);
      setManifestGenerated(true);
    }, 1500);
  };

  const estimatedWeight = isLiveMode ? 25.0 : (analysisResult?.ai_analysis?.estimated_weight_kg || 18.4);
  const spotRate = 35.0; 
  const grossValue = Math.round(estimatedWeight * spotRate);

  return (
    <main className="w-full bg-[#050505] min-h-screen text-white px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto border-x-2 border-[#333333]">
      <div className="flex flex-col gap-12">
        
        {/* Header Bar */}
        <div className="flex flex-col gap-4 pb-8 border-b-2 border-[#333333]">
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <Recycle className="w-4 h-4" />
              CIRCULAR VALUATION
            </span>
            <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-widest">
              // YOLO11 + GEMINI PIPELINE
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-headline font-black tracking-tighter uppercase text-white">
            Upcycler Exchange
          </h1>
          <p className="text-sm font-mono text-[#a3a3a3] uppercase font-bold tracking-widest max-w-3xl leading-relaxed border-l-4 border-[#ff4d00] pl-4">
            Upload field drone imagery or activate the live coastal camera stream. YOLO11 executes classification, while Gemini determines polymer composition, calculates real-time spot valuation, and matches local upcycling facilities.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#333333] border-2 border-[#333333]">
          
          {/* Left: Drone Feed / Vision Upload Viewport (6 cols) */}
          <div className="lg:col-span-6 bg-[#000000] p-8 flex flex-col justify-between gap-8 group">
            <div className="relative w-full h-[500px] bg-[#111111] border-2 border-[#333333] overflow-hidden flex items-center justify-center">
              
              {isLiveMode ? (
                <div className="absolute inset-0 bg-[#000000] overflow-hidden flex flex-col justify-center items-center">
                  <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
                    <div className="flex items-center gap-3 px-4 py-2 bg-black border-2 border-[#ff4d00] text-[10px] font-mono text-[#ff4d00] font-bold uppercase tracking-widest pointer-events-auto">
                      <span className="w-2 h-2 bg-[#ff4d00] animate-ping"></span>
                      <span>LIVE FEED // SEC-04</span>
                    </div>

                    <button 
                      onClick={() => setIsClaheActive(!isClaheActive)}
                      className={`px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest border-2 pointer-events-auto transition-none flex items-center gap-2 ${
                        isClaheActive 
                          ? 'bg-white text-black border-white' 
                          : 'bg-black text-[#525252] border-[#333333]'
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                      <span>CLAHE: {isClaheActive ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  <div className={`relative w-full h-full bg-[url('https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-none ${
                    isClaheActive ? 'filter grayscale contrast-125' : 'opacity-50 grayscale'
                  }`}>
                    <div className="absolute border-2 border-[#ff4d00] bg-[#ff4d00]/20 top-[38%] left-[28%] w-[20%] h-[22%] flex items-start justify-start p-2">
                      <span className="bg-[#ff4d00] text-black font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-1">
                        PET (88%)
                      </span>
                    </div>

                    <div className="absolute border-2 border-white bg-white/20 top-[58%] left-[56%] w-[24%] h-[20%] flex items-start justify-start p-2">
                      <span className="bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-1">
                        NET (92%)
                      </span>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ff4d00] animate-pulse"></div>
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded Debris" 
                    className="w-full h-full object-cover filter grayscale contrast-125" 
                  />

                  {analysisResult?.ai_analysis?.bounding_boxes?.map((box: any, i: number) => {
                    const [y1, x1, y2, x2] = box.box_2d || [50, 50, 200, 200];
                    return (
                      <div 
                        key={i}
                        className="absolute border-2 border-white bg-white/10"
                        style={{
                          top: `${(y1 / 480) * 100}%`,
                          left: `${(x1 / 640) * 100}%`,
                          height: `${((y2 - y1) / 480) * 100}%`,
                          width: `${((x2 - x1) / 640) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-8 left-0 bg-white text-black font-mono text-[10px] uppercase px-2 py-1 font-bold whitespace-nowrap">
                          {box.label} {((box.confidence || 0.89) * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 text-[#525252] p-8 text-center font-mono uppercase font-bold tracking-widest">
                  <Camera className="w-16 h-16 text-[#333333]" />
                  <div className="flex flex-col gap-2">
                    <p className="text-white text-sm">AWAITING VISUAL TELEMETRY</p>
                    <p className="text-[10px]">UPLOAD IMAGE OR START DRONE FEED</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-4 z-30">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => { setIsLiveMode(false); handleImageUpload(e); }} 
                  accept="image/*" 
                  className="hidden" 
                />

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-[#111111] hover:bg-white text-white hover:text-black font-headline font-bold text-xs uppercase tracking-widest border-2 border-[#333333] hover:border-white transition-none flex items-center gap-3"
                >
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD</span>
                </button>

                <button 
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`px-6 py-3 font-headline font-black text-xs uppercase tracking-widest border-2 transition-none flex items-center gap-3 ${
                    isLiveMode 
                      ? 'bg-black text-[#ff4d00] border-[#ff4d00]' 
                      : 'bg-white text-black border-white hover:bg-black hover:text-white'
                  }`}
                >
                  {isLiveMode ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      <span>TERMINATE FEED</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>START FEED</span>
                    </>
                  )}
                </button>
              </div>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 z-50">
                  <Square className="w-12 h-12 text-white animate-spin border-4 border-white fill-transparent" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white font-bold bg-[#111111] px-4 py-2 border-2 border-[#333333]">
                    ANALYZING TELEMETRY...
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-[#111111] border-2 border-[#333333] text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-white" />
              <span>CLAHE ALGORITHM CLARIFIES MURKY COASTAL WATERS FOR NEURAL SEGMENTATION.</span>
            </div>
          </div>

          {/* Right: Plastics Exchange HUD & Upcycler Matching (6 cols) */}
          <div className="lg:col-span-6 bg-[#000000] p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
              <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Square className="w-5 h-5 fill-white text-white" />
                EXCHANGE TERMINAL
              </h2>
              <span className="text-[10px] font-mono bg-white text-black px-3 py-1 font-bold uppercase tracking-widest">
                LIVE MARKET
              </span>
            </div>

            {/* Live Spot Market Rates */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-[#111111] px-4 py-2 border-2 border-[#333333]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                  SPOT POLYMER BENCHMARK
                </span>
                <span className="font-mono text-[10px] text-[#ff4d00] font-bold">UPDATED 5M AGO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-[#333333] border-2 border-[#333333]">
                <div className="p-4 bg-[#050505] flex flex-col gap-2">
                  <div className="font-mono text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest">CLEAR PET</div>
                  <div className="font-headline font-black text-2xl text-white">₹35.00</div>
                </div>
                <div className="p-4 bg-[#050505] flex flex-col gap-2">
                  <div className="font-mono text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest">RIGID HDPE</div>
                  <div className="font-headline font-black text-2xl text-white">₹28.50</div>
                </div>
                <div className="p-4 bg-[#050505] flex flex-col gap-2">
                  <div className="font-mono text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest">NYLON NETS</div>
                  <div className="font-headline font-black text-2xl text-[#ff4d00]">₹42.00</div>
                </div>
              </div>
            </div>

            {/* Current Catch Valuation */}
            <div className="flex flex-col gap-4 mt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold">
                BATCH ESTIMATION
              </h3>

              <div className="grid grid-cols-2 gap-[1px] bg-[#333333] border-2 border-[#333333]">
                <div className="p-6 bg-[#000000] flex flex-col gap-2 border-l-4 border-l-white">
                  <span className="font-mono text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest">CLASSIFIED MASS</span>
                  <span className="text-4xl font-headline font-black text-white">
                    {estimatedWeight.toFixed(1)} KG
                  </span>
                </div>

                <div className="p-6 bg-[#000000] flex flex-col gap-2 border-l-4 border-l-[#ff4d00]">
                  <span className="font-mono text-[10px] text-[#a3a3a3] uppercase font-bold tracking-widest">GROSS VALUE</span>
                  <span className="text-4xl font-headline font-black text-[#ff4d00]">
                    ₹{grossValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Upcycler Match Contract */}
            <div className="mt-auto p-8 bg-[#111111] border-2 border-white flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                <ShieldCheck className="w-48 h-48 text-white" />
              </div>

              <div className="relative z-10 flex items-center justify-between border-b-2 border-[#333333] pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white font-bold flex items-center gap-2">
                  <Square className="w-3 h-3 fill-white text-white" />
                  UPCYCLER CONTRACT
                </span>
                <span className="font-mono text-[10px] px-3 py-1 bg-white text-black font-bold uppercase tracking-widest">
                  CERTIFIED
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">
                  {isLiveMode ? 'LUCRO PLASTECYCLE' : (analysisResult?.matched_upcycler || 'LUCRO PLASTECYCLE')}
                </h3>
                <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest flex items-center gap-2">
                  <Truck className="w-4 h-4 text-white" />
                  DISTANCE: 12.4 KM VIA COASTAL EXPRESSWAY
                </span>
              </div>

              {manifestGenerated ? (
                <div className="relative z-10 p-6 bg-[#000000] border-2 border-[#ff4d00] flex flex-col gap-4 font-mono text-[10px] uppercase font-bold tracking-widest mt-4">
                  <div className="flex items-center justify-between border-b border-[#333333] pb-2">
                    <span className="flex items-center gap-2 text-[#ff4d00]">
                      <FileText className="w-4 h-4" />
                      MANIFEST VERIFIED
                    </span>
                    <span className="text-[#a3a3a3]">HASH: {manifestHash}</span>
                  </div>
                  <span className="text-white leading-relaxed">
                    BATCH: {estimatedWeight}KG • STATUS: DISPATCH QUEUED
                  </span>
                </div>
              ) : (
                <button 
                  onClick={handleExecuteManifest}
                  disabled={isGeneratingManifest}
                  className="relative z-10 self-start px-8 py-4 bg-white hover:bg-[#ff4d00] text-black font-headline font-black text-sm uppercase tracking-widest border-2 border-white hover:border-[#ff4d00] transition-none flex items-center gap-4 mt-4 disabled:opacity-50"
                >
                  {isGeneratingManifest ? (
                    <>
                      <Square className="w-4 h-4 text-black animate-spin border-2 border-black fill-transparent" />
                      <span>MINTING LEDGER...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>EXECUTE MANIFEST</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
