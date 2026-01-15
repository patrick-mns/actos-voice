import { useState, useCallback, useEffect, useRef } from 'react';
import { ActosVoiceController } from '@actos-voice/core';
import type { ActosVoiceConfig } from '@actos-voice/core';

export function useActosVoice(config: ActosVoiceConfig) {
  const [isListening, setIsListening] = useState(false);
  const [llmState, setLlmState] = useState(config.llm.state);
  const [asrState, setAsrState] = useState(config.asr.state);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [partialTranscript, setPartialTranscript] = useState('');

  // Use a ref for the controller to keep it stable
  const controllerRef = useRef<ActosVoiceController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new ActosVoiceController(config);
  }
  const controller = controllerRef.current;

  // Sync config changes
  useEffect(() => {
    controller.updateConfig(config);
  }, [config, controller]);

  useEffect(() => {
    // Sync states via callbacks
    if (config.llm.onStateChange) {
      config.llm.onStateChange((state) => setLlmState(state));
    }
    if (config.asr.onStateChange) {
      config.asr.onStateChange((state) => setAsrState(state));
    }
  }, [config.llm, config.asr]);

  useEffect(() => {
    // Listen to transcripts via the controller
    const unsubscribe = controller.onTranscript((text, isFinal) => {
      if (isFinal && text.trim().length > 0) {
        setTranscripts(prev => [...prev, text]);
        setPartialTranscript('');
      } else if (!isFinal) {
        setPartialTranscript(text);
      }
    });

    // Listen to LLM progress
    if (config.llm.onProgress) {
      config.llm.onProgress((progress, status) => {
        setLoadProgress(progress);
        setLoadStatus(status);
        if (progress === 100) setLlmState('ready');
      });
    }

    return () => {
      unsubscribe();
    };
  }, [controller, config.llm]);

  const start = useCallback(async () => {
    await controller.start();
    setIsListening(true);
  }, [controller]);

  const stop = useCallback(async () => {
    await controller.stop();
    setIsListening(false);
    setPartialTranscript('');
  }, [controller]);

  return {
    start,
    stop,
    isListening,
    llmState,
    asrState,
    loadProgress,
    loadStatus,
    transcripts,
    setTranscripts,
    partialTranscript,
    controller // Optionally export controller if needed
  };
}
