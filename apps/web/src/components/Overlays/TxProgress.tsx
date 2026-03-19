'use client'

import React from 'react'
import type { TxStep } from '@/hooks/useBuyPixels'

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
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#2d6a4f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 9, color: 'white' }}>✓</span>
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div
        className="animate-spin-slow"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1.5px solid var(--text)',
          borderTopColor: 'transparent',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1.5px solid var(--border)',
      }}
    />
  )
}

export default function TxProgress({ step }: TxProgressProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
      {steps.map((s) => {
        const state = s.getState(step)
        const color =
          state === 'done' ? '#2d6a4f' : state === 'active' ? 'var(--text)' : 'var(--text-muted)'
        return (
          <div
            key={s.label}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <StepCircle state={state} />
            <span style={{ fontSize: 8, color, letterSpacing: 0.5 }}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
