import { v4 as uuidv4 } from 'uuid';
import { ScheduledReflectiveMessage } from '../types';

/**
 * TimeGappedDeliveryQueue
 * Implements reflective time-gapped pacing to prevent cognitive flooding and emotional dependency.
 * Enforces structured delays (e.g. 2 hours, 1 day) between therapeutic prompts.
 */
export class TimeGappedDeliveryQueue {
  private queue: Map<string, ScheduledReflectiveMessage> = new Map();

  public parseDelayString(delay: string): number {
    const clean = delay.trim().toLowerCase();
    const match = clean.match(/^(\d+)\s*(minute|min|hour|hr|day|d)s?$/);
    if (!match) {
      return 60 * 60 * 1000; // Default 1 hour
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit.startsWith('min')) return value * 60 * 1000;
    if (unit.startsWith('h')) return value * 60 * 60 * 1000;
    if (unit.startsWith('d')) return value * 24 * 60 * 60 * 1000;
    return value * 1000;
  }

  public scheduleReflectiveMessage(
    patientId: string,
    content: string,
    delay: string,
    clinicalObjective: string
  ): ScheduledReflectiveMessage {
    const delayMs = this.parseDelayString(delay);
    const scheduledDeliveryTime = new Date(Date.now() + delayMs).toISOString();

    const msg: ScheduledReflectiveMessage = {
      id: uuidv4(),
      patientId,
      delayMs,
      scheduledDeliveryTime,
      content,
      clinicalObjective,
      isDelivered: false
    };

    this.queue.set(msg.id, msg);
    return msg;
  }

  public getPendingDeliveries(now = new Date()): ScheduledReflectiveMessage[] {
    const pending: ScheduledReflectiveMessage[] = [];
    for (const msg of this.queue.values()) {
      if (!msg.isDelivered && new Date(msg.scheduledDeliveryTime) <= now) {
        pending.push(msg);
      }
    }
    return pending;
  }

  public markDelivered(messageId: string): void {
    const msg = this.queue.get(messageId);
    if (msg) {
      msg.isDelivered = true;
    }
  }
}
