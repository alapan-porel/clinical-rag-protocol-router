import { ClinicalProtocolDefinition, PatientTrajectory } from '../types';

export interface RouteDecision {
  nextPhase: number;
  nextWeek: number;
  recommendedIntervention: string;
  assignedHomework: string[];
  isTransitionRequired: boolean;
  clinicalRationale: string;
}

/**
 * TherapyProtocolRouter
 * Deterministic finite state-machine router orchestrating therapeutic trajectories across multi-week clinical programs.
 */
export class TherapyProtocolRouter {
  private protocols: Map<string, ClinicalProtocolDefinition> = new Map();

  constructor(protocols?: ClinicalProtocolDefinition[]) {
    if (protocols) {
      protocols.forEach(p => this.registerProtocol(p));
    }
  }

  public registerProtocol(proto: ClinicalProtocolDefinition): void {
    this.protocols.set(proto.protocolId.toLowerCase(), proto);
  }

  public getProtocol(id: string): ClinicalProtocolDefinition | undefined {
    return this.protocols.get(id.toLowerCase());
  }

  public routeNextStep(trajectory: PatientTrajectory): RouteDecision {
    const proto = this.getProtocol(trajectory.activeProtocolId);
    if (!proto) {
      throw new Error(`Protocol '${trajectory.activeProtocolId}' is not registered.`);
    }

    const currentPhaseDef = proto.phases.find(
      p => p.phaseNumber === trajectory.currentPhase || (p as any).week === trajectory.currentPhase
    );
    if (!currentPhaseDef) {
      throw new Error(`Invalid phase ${trajectory.currentPhase} for protocol ${proto.protocolId}`);
    }

    // Determine if phase completion criteria met
    const interventionsDone = trajectory.completedInterventions || [];
    const allInterventionsCompleted = currentPhaseDef.interventions.every(i => interventionsDone.includes(i));

    if (allInterventionsCompleted && trajectory.currentPhase < proto.phases.length) {
      // Transition to next phase
      const nextPhase = trajectory.currentPhase + 1;
      const nextPhaseDef = proto.phases.find(p => p.phaseNumber === nextPhase)!;
      return {
        nextPhase,
        nextWeek: trajectory.currentWeek + 1,
        recommendedIntervention: nextPhaseDef.interventions[0],
        assignedHomework: nextPhaseDef.homeworkAssigned,
        isTransitionRequired: true,
        clinicalRationale: `Phase ${trajectory.currentPhase} completed successfully. Progressing patient to Phase ${nextPhase}: ${nextPhaseDef.phaseName}.`
      };
    }

    // Continue within current phase
    const nextIntervention = currentPhaseDef.interventions.find(i => !interventionsDone.includes(i)) || currentPhaseDef.interventions[0];

    return {
      nextPhase: trajectory.currentPhase,
      nextWeek: trajectory.currentWeek,
      recommendedIntervention: nextIntervention,
      assignedHomework: currentPhaseDef.homeworkAssigned,
      isTransitionRequired: false,
      clinicalRationale: `Continuing consolidation in Phase ${trajectory.currentPhase} (${currentPhaseDef.phaseName}).`
    };
  }
}
