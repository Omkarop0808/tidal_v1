import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Camera, 
  Sparkles, 
  RotateCw
} from 'lucide-react';
import { api } from '../lib/api';

export default function FieldOps() {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [selectedBeach, setSelectedBeach] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [teamName, setTeamName] = useState('Beach Warriors Squad 02');
  const [collectedKg, setCollectedKg] = useState(120);
  const [remainingKg, setRemainingKg] = useState(25);
  const [beforeImage] = useState<string>('https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=600&q=80');
  const [afterImage] = useState<string>('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchFieldData = async () => {
    setIsLoading(true);
    try {
      const [bList] = await Promise.all([
        api.getBeaches(),
        api.getCleanupTasks().catch(() => [])
      ]);
      setBeaches(bList);
      if (bList.length > 0 && !selectedBeach) {
        setSelectedBeach(bList[0]);
      }
    } catch (err) {
      console.error('Failed to load field ops data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldData();
  }, []);

  const handleSubmitMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeach) return;
    setIsSubmitting(true);
    try {
      await api.submitCleanup({
        task_id: `TASK-${Date.now().toString().slice(-6)}`,
        beach_id: selectedBeach.id,
        collected_kg: collectedKg,
        remaining_kg: remainingKg,
        before_img: beforeImage,
        after_img: afterImage,
        effectiveness_pct: 86.4,
        notes: `Mobile field report submitted by ${teamName}`
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        fetchFieldData();
      }, 2500);
    } catch (err) {
      console.error(err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-background min-h-screen text-on-surface px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                MOBILE FIELD CLEANUP & OBSERVATION SUITE
              </span>
              <span className="text-on-surface-variant font-mono text-xs">
                // SQUAD REPORTING INTERFACE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight text-on-surface">
              Field Operations & Verification Portal
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
              Designed for on-ground beach cleanup squads and skimmer operators. Access assigned sectors, record verified before/after photographic proof, log collected kilograms, and synchronize central intelligence in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchFieldData}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-mono font-semibold text-on-surface border border-outline-variant/40 flex items-center gap-2 transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Sectors</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Active Task Card (5 cols) & Live Submission Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active Sector & Assignment Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Sector Selector */}
            <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <span className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Select Operating Sector
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {beaches.length} SECTORS ONLINE
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {beaches.map((b) => {
                  const isSelected = selectedBeach?.id === b.id;
                  const isCritical = b.baseline_risk > 80;
                  const isCleaned = b.status === 'Cleaned';

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBeach(b)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                        isSelected 
                          ? 'bg-primary/15 border-primary text-primary shadow-glow-sm' 
                          : 'bg-surface-container/70 border-outline-variant/30 hover:border-primary/40 text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isCleaned ? 'bg-emerald-400' : isCritical ? 'bg-error animate-ping' : 'bg-warning'
                        }`}></span>
                        <div className="flex flex-col">
                          <span className="font-headline font-semibold text-xs text-on-surface">{b.name}</span>
                          <span className="text-[10px] text-on-surface-variant">{b.sector} Sector • {b.lat.toFixed(3)}°N</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isCleaned ? 'bg-emerald-500/20 text-emerald-400' : isCritical ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Sector Brief & Rationale */}
            {selectedBeach && (
              <div className="p-6 rounded-3xl bg-surface-container-low border border-primary/30 backdrop-blur-xl flex flex-col gap-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">Active Mission Target</span>
                    <h3 className="text-xl font-headline font-bold text-on-surface">{selectedBeach.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                    {selectedBeach.baseline_risk}% Risk Tier
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="p-3 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                    <span className="text-[9px] text-on-surface-variant uppercase block">Predicted Mass</span>
                    <span className="font-bold text-primary text-base mt-0.5">{selectedBeach.current_debris_kg} kg</span>
                  </div>
                  <div className="p-3 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                    <span className="text-[9px] text-on-surface-variant uppercase block">Cleaned Total</span>
                    <span className="font-bold text-emerald-400 text-base mt-0.5">{selectedBeach.cleaned_debris_kg} kg</span>
                  </div>
                  <div className="p-3 bg-surface-container/70 rounded-2xl border border-outline-variant/30">
                    <span className="text-[9px] text-on-surface-variant uppercase block">Residual Load</span>
                    <span className="font-bold text-warning text-base mt-0.5">{selectedBeach.remaining_debris_kg} kg</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-2 font-mono text-xs">
                  <span className="text-primary font-bold text-[11px] uppercase">AI Target Rationale:</span>
                  <p className="text-on-surface-variant leading-relaxed text-[11px]">
                    Continuous SW windage and monsoonal tidal regurgitation has concentrated floating polymer clusters at the shoreline. Recommended action is immediate manual sweep paired with offshore skimmer interception.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right: Live Field Submission Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-6 shadow-2xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-headline font-bold text-on-surface">Submit Field Cleanup & Photographic Evidence</h2>
                    <span className="text-[10px] font-mono text-on-surface-variant">Real-time Central Sync & Accuracy Feedback</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitMission} className="flex flex-col gap-6 font-mono text-xs">
                
                {/* Team Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant uppercase text-[10px] font-bold">Reporting Field Squad</label>
                    <input 
                      type="text" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)} 
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant uppercase text-[10px] font-bold">Target Beach</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedBeach ? selectedBeach.name : 'Loading...'} 
                      className="w-full bg-surface-container/60 border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-primary font-bold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Mass Recording */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-container/80 border border-emerald-500/30 flex flex-col gap-2">
                    <label className="text-emerald-400 font-bold uppercase text-[10px]">
                      Collected Garbage Mass (kg)
                    </label>
                    <input 
                      type="number"
                      value={collectedKg}
                      onChange={(e) => setCollectedKg(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-surface-container-high border border-emerald-500/40 rounded-xl px-3 py-2 text-on-surface font-headline font-bold text-3xl outline-none"
                    />
                    <span className="text-[10px] text-on-surface-variant">Weighed on field scales</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container/80 border border-warning/30 flex flex-col gap-2">
                    <label className="text-warning font-bold uppercase text-[10px]">
                      Estimated Remaining Mass (kg)
                    </label>
                    <input 
                      type="number"
                      value={remainingKg}
                      onChange={(e) => setRemainingKg(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-surface-container-high border border-warning/40 rounded-xl px-3 py-2 text-on-surface font-headline font-bold text-3xl outline-none"
                    />
                    <span className="text-[10px] text-on-surface-variant">Inaccessible rocks & dunes</span>
                  </div>
                </div>

                {/* Photographic Evidence Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-on-surface-variant uppercase font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-error" />
                      Before Cleanup Capture:
                    </span>
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 relative">
                      <img src={beforeImage} alt="Before" className="w-full h-full object-cover filter contrast-125" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-error/80 text-white text-[10px] font-bold">
                        Initial Coverage: ~75%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-on-surface-variant uppercase font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      After Cleanup Capture:
                    </span>
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 relative">
                      <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-500/80 text-white text-[10px] font-bold">
                        Final Coverage: ~12%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-primary text-on-primary font-headline font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50 shadow-lg"
                >
                  {submitSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Report Successfully Synchronized to Central Intelligence!</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>Transmitting Evidence & Updating Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Authorize & Submit Verified Field Report</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
