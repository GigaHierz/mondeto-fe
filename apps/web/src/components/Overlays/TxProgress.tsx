'use client'

import type { TxStep } from '@/hooks/useBuyPixels'

const PF = "'Press Start 2P', monospace"

interface TxProgressProps {
  step: TxStep
}

type StepState = 'done' | 'active' | 'pending'

interface StepDef {
  label: string
  getState: (step: TxStep) => StepState
}

const steps: StepDef[] = [
  {
    label: 'FUNDS UNLOCKED',
    getState: (step) =>
      ['buying', 'confirming', 'success'].includes(step) ? 'done' : 'active',
  },
  {
    label: 'LOCKING IT IN...',
    getState: (step) =>
      ['confirming', 'success'].includes(step)
        ? 'done'
        : step === 'buying'
          ? 'active'
          : 'pending',
  },
  {
    label: 'SEALING THE DEAL...',
    getState: (step) =>
      step === 'success'
        ? 'done'
        : step === 'confirming'
          ? 'active'
          : 'pending',
  },
]

function StepCircle({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--button-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 8, fontFamily: PF, color: 'var(--button-text)' }}>ok</span>
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div
        className="animate-spin-slow"
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '2px solid var(--text)',
          borderTopColor: 'transparent',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: '2px solid var(--border)',
        opacity: 0.4,
      }}
    />
  )
}

export default function TxProgress({ step }: TxProgressProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
      {steps.map((s) => {
        const state = s.getState(step)
        const color =
          state === 'done' ? 'var(--text)' : state === 'active' ? 'var(--text)' : 'var(--text-muted)'
        return (
          <div
            key={s.label}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <StepCircle state={state} />
            <span style={{ fontSize: 7, fontFamily: PF, color, letterSpacing: 1 }}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
