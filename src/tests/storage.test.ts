import { describe, it, expect, beforeEach } from 'vitest';
import { saveDraft, loadDraft, clearDraft, exportDraftToken, importDraftToken, INITIAL_FORM_STATE } from '../utils/storage';
import type { FormState } from '../types/loanForm';

describe('Storage & Application Token Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and load application draft state from LocalStorage', () => {
    const testState: FormState = {
      ...INITIAL_FORM_STATE,
      currentStep: 3,
      step2: { ...INITIAL_FORM_STATE.step2, fullName: 'Test User' },
    };

    const saved = saveDraft(testState);
    expect(saved).toBe(true);

    const loaded = loadDraft();
    expect(loaded).not.toBeNull();
    expect(loaded?.currentStep).toBe(3);
    expect(loaded?.step2.fullName).toBe('Test User');
  });

  it('should clear draft from LocalStorage', () => {
    saveDraft(INITIAL_FORM_STATE);
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it('should export and import encrypted application token', () => {
    const state: FormState = {
      ...INITIAL_FORM_STATE,
      step1: { loanType: 'home', loanAmount: 4000000, tenureMonths: 180, purpose: 'Buy Flat' },
    };

    const token = exportDraftToken(state);
    expect(token.length).toBeGreaterThan(20);

    const restored = importDraftToken(token);
    expect(restored).not.toBeNull();
    expect(restored?.step1.loanType).toBe('home');
    expect(restored?.step1.loanAmount).toBe(4000000);
  });
});
