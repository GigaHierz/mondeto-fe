// Phase 1 logger: append-only JSONL on disk. Cheap, no infrastructure.
// Swap for Postgres (Neon) once we want dedup + multi-turn memory.

import { appendFile } from 'node:fs/promises'

const LOG_PATH = process.env.LOG_PATH ?? './tickets.jsonl'

export interface LogEntry {
  ts: string
  telegram_message_id: number
  telegram_user_id: number
  telegram_username?: string
  chat_id: number
  text: string
  category: string
  confidence: number
  reason: string
  draft?: unknown
}

export async function logEntry(entry: Omit<LogEntry, 'ts'>): Promise<void> {
  const full: LogEntry = { ts: new Date().toISOString(), ...entry }
  await appendFile(LOG_PATH, JSON.stringify(full) + '\n', 'utf8')
}
