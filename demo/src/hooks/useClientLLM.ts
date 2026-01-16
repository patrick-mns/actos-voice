import { useState, useRef, useCallback } from 'react';
import * as webllm from '@mlc-ai/web-llm';
import { PROMPTS } from '../i18n';

// WebGPU type declaration
declare global {
    interface Navigator {
        gpu?: unknown;
    }
}

// Small and fast model - Llama 3.2 1B is ideal for tool calling
const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

export type Language = 'en' | 'pt';

export interface ToolCallResult {
    tool: string | null;
    args: Record<string, string> | null;
    response: string;
}

export interface UseClientLLMReturn {
    isLoading: boolean;
    isReady: boolean;
    loadProgress: number;
    loadStatus: string;
    error: string | null;
    language: Language;
    initLLM: () => Promise<void>;
    processText: (text: string) => Promise<ToolCallResult | null>;
    setLanguage: (lang: Language) => void;
}

export function useClientLLM(): UseClientLLMReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [loadStatus, setLoadStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>('en');
    
    const engineRef = useRef<webllm.MLCEngine | null>(null);

    const initLLM = useCallback(async () => {
        if (engineRef.current || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Verifica suporte a WebGPU
            if (!navigator.gpu) {
                throw new Error('WebGPU não suportado neste browser. Use Chrome 113+ ou Edge 113+');
            }

            const engine = new webllm.MLCEngine();
            
            // Callback de progresso
            engine.setInitProgressCallback((progress) => {
                setLoadProgress(progress.progress * 100);
                setLoadStatus(progress.text);
            });

            await engine.reload(MODEL_ID);
            
            engineRef.current = engine;
            setIsReady(true);
            
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao carregar LLM';
            setError(message);
            console.error('❌ Erro LLM:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const processText = useCallback(async (text: string): Promise<ToolCallResult | null> => {
        if (!engineRef.current) {
            console.warn('⚠️ LLM não inicializado');
            return null;
        }

        try {
            const response = await engineRef.current.chat.completions.create({
                messages: [
                    { role: 'system', content: PROMPTS[language] },
                    { role: 'user', content: text }
                ],
                temperature: 0.1,
                max_tokens: 150,
            });

            const content = response.choices[0]?.message?.content || '';
            
            // Parse JSON da resposta
            try {
                // Tenta extrair JSON da resposta
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]) as ToolCallResult;
                    return parsed;
                }
            } catch (parseErr) {
                console.warn('⚠️ Falha ao parsear JSON:', parseErr);
            }

            // Fallback: resposta sem tool
            return {
                tool: null,
                args: null,
                response: content
            };

        } catch (err) {
            console.error('❌ Erro ao processar:', err);
            return null;
        }
    }, [language]);

    return {
        isLoading,
        isReady,
        loadProgress,
        loadStatus,
        error,
        language,
        initLLM,
        processText,
        setLanguage,
    };
}
