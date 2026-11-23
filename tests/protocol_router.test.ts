import { createStandardProtocolRouter, TimeGappedDeliveryQueue, RAGContextBuilder } from '../src';
import fixtures from '../fixtures/protocol_fixtures.json';

describe('Clinical Protocol State Machine Router', () => {
  const router = createStandardProtocolRouter();

  it('loads all 4 bundled clinical protocols', () => {
    expect(router.getProtocol('CBT_Depression')).toBeDefined();
    expect(router.getProtocol('DBT_Emotional_Regulation')).toBeDefined();
    expect(router.getProtocol('ACT_Anxiety_Acceptance')).toBeDefined();
    expect(router.getProtocol('Somatic_Trauma_Grounding')).toBeDefined();
  });

  it('recommends first intervention in phase 1 for new trajectory', () => {
    const decision = router.routeNextStep(fixtures.trajectory_cbt_week1 as any);
    expect(decision.nextPhase).toBe(1);
    expect(decision.isTransitionRequired).toBe(false);
    expect(decision.recommendedIntervention).toBeDefined();
  });

  it('advances trajectory to phase 2 upon phase 1 completion', () => {
    const decision = router.routeNextStep(fixtures.trajectory_cbt_phase1_complete as any);
    expect(decision.isTransitionRequired).toBe(true);
    expect(decision.nextPhase).toBe(2);
    expect(decision.clinicalRationale).toContain('Phase 1 completed successfully');
  });
});

describe('TimeGappedDeliveryQueue', () => {
  const queue = new TimeGappedDeliveryQueue();

  it('correctly calculates millisecond delays for reflective pacing', () => {
    expect(queue.parseDelayString('30 minutes')).toBe(30 * 60 * 1000);
    expect(queue.parseDelayString('2 hours')).toBe(2 * 60 * 60 * 1000);
    expect(queue.parseDelayString('1 day')).toBe(24 * 60 * 60 * 1000);
  });

  it('schedules message and prevents immediate delivery', () => {
    const msg = queue.scheduleReflectiveMessage('pt_200', 'Notice what thoughts came up during lunch.', '2 hours', 'CBT Thought Observation');
    expect(msg.isDelivered).toBe(false);
    expect(queue.getPendingDeliveries().length).toBe(0);
  });
});
