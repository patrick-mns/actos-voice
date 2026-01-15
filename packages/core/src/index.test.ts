import { describe, it, expect, vi } from 'vitest';
import { createActosVoice } from '../src/index';

describe('ActosVoice core', () => {
  it('should initialize with asr and llm providers', () => {
    const mockASR = {
      id: 'mock-asr',
      state: 'idle',
      start: vi.fn(),
      stop: vi.fn(),
      onTranscript: vi.fn(),
      onError: vi.fn()
    } as any;

    const mockLLM = {
      id: 'mock-llm',
      state: 'unloaded',
      init: vi.fn(),
      processText: vi.fn(),
    } as any;

    const lib = createActosVoice({
      asr: mockASR,
      llm: mockLLM
    });

    expect(lib).toBeDefined();
    expect(mockASR.onTranscript).toHaveBeenCalled();
  });
});
