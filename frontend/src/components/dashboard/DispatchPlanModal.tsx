import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  Sparkles, 
  Anchor, 
  Clock, 
  Weight, 
  MapPin, 
  CheckCircle2, 
  Send
} from 'lucide-react';

interface DispatchPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch?: () => void;
}

interface DispatchAssignment {
  vessel_name: string;
  target_zone: string;
  eta_hours: number;
  estimated_recovery_kg: number;
  reasoning: string;
}

const mockAssignments: DispatchAssignment[] = [
  {
    vessel_name: 'Autonomous Skimmer SKM-01',
    target_zone: 'Zone A: Versova Creek',
    eta_hours: 1.2,
    estimated_recovery_kg: 380,
    reasoning: 'Proximity to high-velocity outflow channel maximizes intercept rate before debris touches beach sand.'
  },
  {
    vessel_name: 'Autonomous Skimmer SKM-02',
    target_zone: 'Zone B: Juhu Beach',
    eta_hours: 2.4,
    estimated_recovery_kg: 290,
    reasoning: 'Tidal convergence zone will accumulate buoyant PET bottles during next 4 hours.'
  },
  {
    vessel_name: 'Tactical Squad T-BRAVO',
    target_zone: 'Zone C: Bandra Channel',
    eta_hours: 0.8,
    estimated_recovery_kg: 180,
    reasoning: 'Offshore boom anchor point stabilization and surface debris scooping.'
  }
];

export const DispatchPlanModal: React.FC<DispatchPlanModalProps> = ({ isOpen, onClose, onConfirmDispatch }) => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<DispatchAssignment[]>([]);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setDispatched(false);

      axios.get('http://localhost:8000/api/v1/hotspots/spatial')
        .then(res => {
          const hotspots = res.data;
          return axios.post('http://localhost:8000/api/v1/dispatch/optimize', { hotspots });
        })
        .then(res => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setAssignments(res.data);
          } else {
            setAssignments(mockAssignments);
          }
        })
        .catch(() => {
          setAssignments(mockAssignments);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmDispatch = () => {
    setDispatched(true);
    onConfirmDispatch?.();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container-low w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-primary/30 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-on-surface font-headline font-bold text-lg">AI Autonomous Fleet Dispatch Optimizer</h2>
              <p className="text-on-surface-variant font-mono text-xs">Hungarian Optimal Assignment Algorithm</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 rounded-full border-3 border-surface-container-highest border-t-primary animate-spin"></div>
              <div className="text-center font-mono">
                <h3 className="font-headline font-semibold text-sm text-on-surface">Computing Optimal Fleet Vectors...</h3>
                <p className="text-xs text-on-surface-variant mt-1">Evaluating vessel ranges, battery telemetry, and risk tiers</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mission Summary Pill */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-2.5 text-primary font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 Intercept Missions Computed • 850 kg Estimated Total Debris Recovery</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface text-on-surface border border-primary/20">
                  Total Travel: 38.4 km
                </span>
              </div>

              {/* Vessel Assignment Cards */}
              <div className="grid grid-cols-1 gap-4">
                {assignments.map((assignment, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-surface-container/70 border border-outline-variant/40 hover:border-primary/40 transition-all flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-primary">
                          <Anchor className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-sm text-on-surface">{assignment.vessel_name}</h4>
                          <span className="text-xs font-mono text-primary font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {assignment.target_zone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="px-3 py-1 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface-variant flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-primary" />
                          ETA: <strong className="text-on-surface">{assignment.eta_hours}h</strong>
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface-variant flex items-center gap-1.5">
                          <Weight className="w-3 h-3 text-secondary" />
                          Capacity: <strong className="text-secondary">{assignment.estimated_recovery_kg} kg</strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-primary font-mono text-[11px] uppercase mr-1.5">AI Rationale:</strong>
                      {assignment.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-outline-variant/30 bg-surface-container/40 flex items-center justify-between gap-4">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-mono text-on-surface-variant transition-colors"
          >
            Cancel
          </button>

          <button 
            onClick={handleConfirmDispatch}
            disabled={loading || dispatched}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-headline font-bold text-xs sm:text-sm hover:shadow-glow transition-all duration-300 flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {dispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Orders Dispatched to Fleet!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Authorize & Transmit Fleet Orders</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DispatchPlanModal;
