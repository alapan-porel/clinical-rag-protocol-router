export * from './types';
export * from './router/TherapyProtocolRouter';
export * from './messaging/TimeGappedDeliveryQueue';
export * from './rag/VectorRetriever';
export * from './rag/RAGContextBuilder';

import fs from 'fs';
import path from 'path';
import { TherapyProtocolRouter } from './router/TherapyProtocolRouter';
import { ClinicalProtocolDefinition } from './types';

/**
 * createStandardProtocolRouter
 * Factory loading the 4 bundled therapeutic modality protocols (CBT, DBT, ACT, Somatic).
 */
export function createStandardProtocolRouter(): TherapyProtocolRouter {
  const protocolsDir = path.join(__dirname, '..', 'protocols');
  const definitions: ClinicalProtocolDefinition[] = [];

  if (fs.existsSync(protocolsDir)) {
    const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(protocolsDir, file), 'utf-8');
        definitions.push(JSON.parse(content));
      } catch (err) {
        console.warn(`Failed loading protocol ${file}:`, err);
      }
    }
  }

  return new TherapyProtocolRouter(definitions);
}
