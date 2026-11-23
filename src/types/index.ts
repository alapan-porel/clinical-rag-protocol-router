export type TherapeuticFramework = 'CBT' | 'DBT' | 'ACT' | 'Somatic' | 'Mindfulness';

export interface ProtocolPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: number;
  goals: string[];
  interventions: string[];
  homeworkAssigned: string[];
}

export interface ClinicalProtocolDefinition {
  protocolId: string;
  name: string;
  framework: TherapeuticFramework;
  description: string;
  targetConditions: string[];
  contraindications: string[];
  durationWeeks: number;
  phases: ProtocolPhase[];
}

export interface PatientTrajectory {
  patientId: string;
  activeProtocolId: string;
  currentPhase: number;
  currentWeek: number;
  completedInterventions: string[];
  pendingHomework: string[];
  lastSessionDate: string;
}

export interface ScheduledReflectiveMessage {
  id: string;
  patientId: string;
  delayMs: number;
  scheduledDeliveryTime: string;
  content: string;
  clinicalObjective: string;
  isDelivered: boolean;
}
