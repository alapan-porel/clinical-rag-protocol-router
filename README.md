# Clinical Protocol State-Machine Router & Reflective Time-Gapped Delivery Queue

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg)](https://www.typescriptlang.org/)
[![Therapeutic Frameworks](https://img.shields.io/badge/Modalities-CBT%20%7C%20DBT%20%7C%20ACT%20%7C%20Somatic-blueviolet.svg)](#bundled-clinical-protocols)

A deterministic clinical state-machine router and reflective time-gapped message delivery engine. Built to manage multi-week evidence-based psychotherapy programs, transition patient trajectories across structured treatment phases, and prevent conversational flooding through therapeutically paced delivery queues.

---

## Architectural Workflow

```
 [ Patient State Trajectory ]
              │
              ▼
   ┌────────────────────────────────────────────────────────┐
   │ 1. TherapyProtocolRouter (Finite State Machine)        │
   │    ├─ Evaluates Homework & Completed Interventions     │
   │    ├─ Triggers Phase Progression (CBT / DBT / ACT)    │
   │    └─ Emits Next Deterministic Clinical Objective      │
   └──────────────────────────┬─────────────────────────────┘
                              │
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │ 2. Time-Gapped Reflective Delivery Queue               │
   │    ├─ Enforces Deliberate Cognitive Pacing (2h / 1d)   │
   │    ├─ Prevents Habitual Flooding / Co-dependency       │
   │    └─ Dispatches Timed Homework Reminders              │
   └──────────────────────────┬─────────────────────────────┘
                              │
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │ 3. Clinical RAG Context Builder                        │
   │    ├─ DSM-5 Criteria & Protocol Snippet Injection      │
   │    └─ Non-Diagnostic Clinical Safety Envelopes         │
   └────────────────────────────────────────────────────────┘
```

---

## Bundled Clinical Protocols

1. **`CBT_Depression.json`**: 12-week Cognitive Behavioral Therapy protocol targeting Major Depressive Disorder (MDD). Covers behavioral activation, cognitive distortions identification, cognitive restructuring, and relapse prevention.
2. **`DBT_Emotional_Regulation.json`**: 10-week Dialectical Behavior Therapy protocol covering Wise Mind, TIPP crisis survival skills, distress tolerance, and DEAR MAN boundary communication.
3. **`ACT_Anxiety_Acceptance.json`**: 8-week Acceptance and Commitment Therapy protocol targeting chronic anxiety, psychological flexibility, cognitive defusion, and values-committed action.
4. **`Somatic_Trauma_Grounding.json`**: 6-week Somatic grounding protocol for autonomic nervous system regulation, orienting, and vagal stabilization.

---

## Installation & Quickstart

```bash
npm install
npm run build
npm test
```

### Usage Example

```typescript
import { createStandardProtocolRouter, TimeGappedDeliveryQueue } from 'clinical-rag-protocol-router';

// 1. Initialize Protocol Router
const router = createStandardProtocolRouter();

// 2. Evaluate Trajectory Progression
const decision = router.routeNextStep({
  patientId: 'patient_42',
  activeProtocolId: 'CBT_Depression',
  currentPhase: 1,
  currentWeek: 3,
  completedInterventions: [
    'Psychoeducation on Depression and CBT Model',
    'Behavioral Activation - Activity Scheduling',
    'Mood Monitoring and Baseline Tracking',
    'Identifying Automatic Thoughts'
  ],
  pendingHomework: [],
  lastSessionDate: '2026-11-20T10:00:00Z'
});

console.log(decision.nextPhase); // 2
console.log(decision.clinicalRationale); 
// "Phase 1 completed successfully. Progressing patient to Phase 2: Cognitive Restructuring & Core Beliefs."

// 3. Schedule Time-Gapped Reflective Practice
const queue = new TimeGappedDeliveryQueue();
const msg = queue.scheduleReflectiveMessage(
  'patient_42',
  'Take 3 minutes to log one automatic thought that occurred during work today.',
  '2 hours',
  'CBT Thought Logging Practice'
);
```

---

## License

Apache-2.0. Cleanroom extraction and packaging release.
