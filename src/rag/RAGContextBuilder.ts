import { PatientTrajectory, ClinicalProtocolDefinition } from '../types';
import { MockVectorRetriever, VectorSearchResult } from './VectorRetriever';

export interface ConstructedClinicalContext {
  systemPromptEnvelope: string;
  retrievedProtocolSnippets: string[];
  activePhaseGuidance: string;
  guardrails: string[];
}

/**
 * RAGContextBuilder
 * Builds clinically grounded LLM prompt contexts combining protocol specifications,
 * patient trajectory state, retrieved therapeutic exercises, and clinical boundaries.
 */
export class RAGContextBuilder {
  private retriever: MockVectorRetriever;

  constructor(retriever?: MockVectorRetriever) {
    this.retriever = retriever || new MockVectorRetriever();
  }

  public buildPromptContext(
    patientMessage: string,
    protocol: ClinicalProtocolDefinition,
    trajectory: PatientTrajectory
  ): ConstructedClinicalContext {
    const currentPhase = protocol.phases.find(p => p.phaseNumber === trajectory.currentPhase);
    const phaseName = currentPhase ? currentPhase.phaseName : 'General Guidance';

    const searchResults: VectorSearchResult[] = this.retriever.search(patientMessage, 2);
    const retrievedSnippets = searchResults.map(r => `[Protocol Ref: ${r.chunk.protocolId}]: ${r.chunk.text}`);

    const guardrails = [
      'Maintain non-diagnostic therapeutic presence',
      'Never prescribe or alter medications',
      'Validate emotional experience before introducing cognitive challenges',
      'Enforce protocol homework accountability'
    ];

    const systemPromptEnvelope = `You are a clinical therapeutic assistant operating within the evidence-based ${protocol.framework} framework.
Current Active Protocol: ${protocol.name}
Patient State: Phase ${trajectory.currentPhase} (${phaseName}), Week ${trajectory.currentWeek}.
Target Conditions: ${protocol.targetConditions.join(', ')}.

MANDATORY CLINICAL GUARDRAILS:
${guardrails.map(g => `- ${g}`).join('\n')}
`;

    return {
      systemPromptEnvelope,
      retrievedProtocolSnippets: retrievedSnippets,
      activePhaseGuidance: `Focus on active interventions: ${currentPhase ? currentPhase.interventions.join(', ') : 'Consolidation'}.`,
      guardrails
    };
  }
}
