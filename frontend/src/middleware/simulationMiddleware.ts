import { api } from '../lib/api';
import { useSim } from '../store';
import type { SimulationResult } from '../interfaces/Simulation';

/**
 * Transforms raw API simulation response to internal store interfaces.
 */
export const runSimulationMiddleware = async (payload: any): Promise<SimulationResult> => {
  const response = await api.runSimulation(payload);
  
  if (!response) {
    throw new Error('Simulation response invalid');
  }

  // Map backend response to our internal "SimulationResult"
  const result: SimulationResult = {
    predictedAccumulationKg: response.predicted_accumulation_kg,
    peakRiskTimeHours: response.peak_risk_time_hours,
    curveData: response.curve_data,
    aiConfidence: response.ai_confidence,
    baselineTrajectory: response.trajectory_baseline,
    interventionTrajectory: response.trajectory_intervention,
  };

  // Update store directly using the store actions
  if (result.interventionTrajectory) {
    useSim.getState().setTrajectory(result.interventionTrajectory);
  }
  if (result.baselineTrajectory) {
    useSim.getState().setTrajectoryBaseline(result.baselineTrajectory);
  }

  return result;
};
