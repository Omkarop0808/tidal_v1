import type { TrajectoryFrame } from '../store';

/**
 * Internal interface for Simulation Scenario Results.
 * Independent of API payload structure.
 */
export interface SimulationResult {
  predictedAccumulationKg: number;
  peakRiskTimeHours: number;
  curveData: number[];
  aiConfidence: number;
  baselineTrajectory: TrajectoryFrame[];
  interventionTrajectory: TrajectoryFrame[];
}
