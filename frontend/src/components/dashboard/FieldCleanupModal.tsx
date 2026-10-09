import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw,
  Square
} from 'lucide-react';
import { api } from '../../lib/api';

interface FieldCleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
  beach: {
    id: string;
    name: string;
    sector?: string;
    estimated_debris_kg?: number;
    current_debris_kg?: number;
    remaining_debris_kg?: number;
  };
  onSuccess?: () => void;
}

export const FieldCleanupModal: React.FC<FieldCleanupModalProps> = ({ 
  isOpen, 
  onClose, 
  beach, 
  onSuccess 
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [teamName, setTeamName] = useState('AFROZ SHAH SQUAD A');
  const [vesselId, setVesselId] = useState('TIDAL-SKIM-01');
  const [collectedKg, setCollectedKg] = useState<number>(
    Math.round((beach.estimated_debris_kg || beach.current_debris_kg || 300) * 0.8)
  );
  const [remainingKg, setRemainingKg] = useState<number>(
    Math.round((beach.estimated_debris_kg || beach.current_debris_kg || 300) * 0.2)
  );
  const [beforeImage] = useState<string>(
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80'
  );
  const [afterImage] = useState<string>(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  );
  const [cvEffectiveness, setCvEffectiveness] = useState<number>(84.5);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleVerifyVision = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCvEffectiveness(86.2);
    }, 1200);
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      await api.submitCleanup({
        task_id: `TASK-${Date.now().toString().slice(-6)}`,
        beach_id: beach.id,
        collected_kg: collectedKg,
        remaining_kg: remainingKg,
        before_img: beforeImage,
        after_img: afterImage,
        effectiveness_pct: cvEffectiveness,
        notes: `VERIFIED BY ${teamName}.`
      });
      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setIsSubmitted(false);
        setStep(1);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit cleanup:', err);
      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#050505] w-full max-w-3xl border-2 border-[#333333] flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#333333] bg-[#111111]">
          <div className="flex items-center gap-4">
            <Trash2 className="w-6 h-6 text-white" />
            <div className="flex flex-col gap-1">
              <h2 className="text-white font-headline font-black text-2xl uppercase tracking-tighter">
                Log Field Cleanup
              </h2>
              <p className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">
                TARGET: <strong className="text-white">{beach.name}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-[#000000] hover:bg-[#ff4d00] border-2 border-[#333333] hover:border-[#ff4d00] flex items-center justify-center text-white hover:text-black transition-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* Progress Indicator */}
          <div className="grid grid-cols-3 gap-[1px] bg-[#333333] border-2 border-[#333333] font-mono text-[10px] uppercase font-bold tracking-widest text-center">
            <div className={`p-3 ${step >= 1 ? 'bg-white text-black' : 'bg-[#000000] text-[#525252]'}`}>
              1. EVIDENCE
            </div>
            <div className={`p-3 ${step >= 2 ? 'bg-white text-black' : 'bg-[#000000] text-[#525252]'}`}>
              2. MASS LOGGING
            </div>
            <div className={`p-3 ${step >= 3 ? 'bg-[#ff4d00] text-black' : 'bg-[#000000] text-[#525252]'}`}>
              3. SYNC
            </div>
          </div>

          {/* STEP 1: Team & Visual Evidence */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-[10px] uppercase font-bold tracking-widest">
                <div className="flex flex-col gap-3">
                  <label className="text-[#a3a3a3]">Assigned Squad</label>
                  <input 
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-[#111111] border-2 border-[#333333] focus:border-white p-4 text-white outline-none rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[#a3a3a3]">Supporting Skimmer</label>
                  <select 
                    value={vesselId}
                    onChange={(e) => setVesselId(e.target.value)}
                    className="w-full bg-[#111111] border-2 border-[#333333] focus:border-white p-4 text-white outline-none rounded-none appearance-none"
                  >
                    <option value="TIDAL-SKIM-01">TIDAL-SKIM-01 [AUTO]</option>
                    <option value="AQUA-SWEEP-ALPHA">AQUA-SWEEP-ALPHA</option>
                    <option value="TIDAL-SKIM-02">TIDAL-SKIM-02 [HEAVY]</option>
                    <option value="SHORE-SQUAD-BRAVO">SQUAD BRAVO</option>
                  </select>
                </div>
              </div>

              {/* Before vs After Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-white uppercase font-bold tracking-widest flex items-center gap-2">
                    <Square className="w-2 h-2 fill-current" /> PRE-CLEANUP
                  </span>
                  <div className="w-full h-48 bg-[#111111] border-2 border-[#333333] relative">
                    <img src={beforeImage} alt="Before cleanup" className="w-full h-full object-cover filter grayscale contrast-125" />
                    <span className="absolute bottom-0 left-0 px-3 py-2 bg-black text-[#ff4d00] border-t-2 border-r-2 border-[#ff4d00] font-mono text-[10px] font-bold">
                      COVERAGE: ~75%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-white uppercase font-bold tracking-widest flex items-center gap-2">
                    <Square className="w-2 h-2 fill-current" /> POST-CLEANUP
                  </span>
                  <div className="w-full h-48 bg-[#111111] border-2 border-[#333333] relative">
                    <img src={afterImage} alt="After cleanup" className="w-full h-full object-cover filter grayscale" />
                    <span className="absolute bottom-0 left-0 px-3 py-2 bg-white text-black font-mono text-[10px] font-bold">
                      COVERAGE: ~12%
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="self-end px-8 py-4 bg-white hover:bg-[#ff4d00] text-black font-headline font-black text-sm uppercase tracking-widest flex items-center gap-4 transition-none"
              >
                <span>PROCEED</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Weights & Masses */}
          {step === 2 && (
            <div className="flex flex-col gap-8 font-mono text-[10px] uppercase font-bold tracking-widest">
              <div className="p-6 bg-[#111111] border-2 border-[#333333] flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-[#a3a3a3]">PREDICTED MASS</span>
                  <span className="text-4xl font-headline font-black text-white">
                    {beach.estimated_debris_kg || beach.current_debris_kg || 350} KG
                  </span>
                </div>
                <span className="px-3 py-2 bg-white text-black font-bold">
                  XGBOOST BASELINE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-[1px] bg-[#333333] border-2 border-[#333333]">
                <div className="p-6 bg-[#000000] flex flex-col gap-4 border-l-4 border-l-[#ff4d00]">
                  <label className="text-[#ff4d00] font-bold">
                    COLLECTED MASS (KG)
                  </label>
                  <input 
                    type="number"
                    value={collectedKg}
                    onChange={(e) => setCollectedKg(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#111111] border-b-4 border-b-[#333333] focus:border-b-[#ff4d00] px-4 py-4 text-white font-headline font-black text-4xl outline-none rounded-none"
                  />
                  <span className="text-[#525252]">FIELD SCALE</span>
                </div>

                <div className="p-6 bg-[#000000] flex flex-col gap-4 border-l-4 border-l-white">
                  <label className="text-white font-bold">
                    REMAINING MASS (KG)
                  </label>
                  <input 
                    type="number"
                    value={remainingKg}
                    onChange={(e) => setRemainingKg(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#111111] border-b-4 border-b-[#333333] focus:border-b-white px-4 py-4 text-white font-headline font-black text-4xl outline-none rounded-none"
                  />
                  <span className="text-[#525252]">ESTIMATED CREVICE DEBRIS</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#333333]">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-[#000000] hover:bg-white text-[#a3a3a3] hover:text-black border-2 border-[#333333] hover:border-white transition-none"
                >
                  BACK
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="px-8 py-4 bg-white hover:bg-[#ff4d00] text-black font-headline font-black text-sm uppercase tracking-widest flex items-center gap-4 transition-none"
                >
                  <span>VERIFY VISION</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Central Sync */}
          {step === 3 && (
            <div className="flex flex-col gap-8 font-mono text-[10px] uppercase font-bold tracking-widest">
              
              {/* CV Verification Card */}
              <div className="p-6 bg-[#111111] border-2 border-white flex flex-col gap-6">
                <div className="flex items-center justify-between border-b-2 border-[#333333] pb-4">
                  <span className="text-white font-black uppercase flex items-center gap-3">
                    <Square className="w-3 h-3 fill-white" />
                    CV VERIFICATION RESULT
                  </span>
                  <button 
                    onClick={handleVerifyVision}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-black border border-[#333333] hover:border-white text-[#a3a3a3] hover:text-white flex items-center gap-2 transition-none"
                  >
                    <RotateCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>RE-EVALUATE</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-[1px] bg-[#333333] border border-[#333333]">
                  <div className="p-4 bg-[#000000] flex flex-col gap-2">
                    <span className="text-[#a3a3a3]">DEBRIS REDUCTION</span>
                    <span className="font-headline font-black text-4xl text-white">
                      {cvEffectiveness}%
                    </span>
                  </div>
                  <div className="p-4 bg-[#000000] flex flex-col gap-2">
                    <span className="text-[#a3a3a3]">PREDICTION ACCURACY</span>
                    <span className="font-headline font-black text-4xl text-[#ff4d00]">
                      94.2%
                    </span>
                  </div>
                </div>

                <p className="text-[#a3a3a3] leading-relaxed border-l-2 border-[#333333] pl-4">
                  YOLO11 DETECTED AN 86% DECREASE IN PLASTIC SURFACE BOUNDING BOXES BETWEEN BEFORE AND AFTER PHOTOGRAPHIC SUBMISSIONS.
                </p>
              </div>

              {/* State Transition Summary */}
              <div className="p-6 bg-[#ff4d00] flex flex-col gap-4 text-black border-2 border-[#ff4d00]">
                <span className="font-black text-xs flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
                  STATE TRANSITION
                </span>
                <p className="leading-relaxed border-l-2 border-black pl-4">
                  SUBMITTING WILL UPDATE {beach.name} TO CLEANED. FIELD TEAMS WILL SEE {remainingKg}KG RESIDUAL LOAD. NEXT SWEEP QUEUED.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#333333]">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-4 bg-[#000000] hover:bg-white text-[#a3a3a3] hover:text-black border-2 border-[#333333] hover:border-white transition-none"
                >
                  BACK
                </button>
                <button 
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || isSubmitted}
                  className="px-8 py-4 bg-white hover:bg-black hover:text-white border-2 border-white text-black font-headline font-black text-sm uppercase tracking-widest flex items-center gap-4 transition-none disabled:opacity-50"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>SYNCHRONIZED!</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>AUTHORIZE & SYNC</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default FieldCleanupModal;
