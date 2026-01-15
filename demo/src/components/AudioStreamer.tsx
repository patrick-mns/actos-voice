import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { webSpeech } from '@actos-voice/asr-webspeech';
import { webLLM } from '@actos-voice/llm-webllm';
import { useActosVoice } from '@actos-voice/react';
import type { Language } from '@actos-voice/core';
import { getSystemPrompt, getTools, UI_STRINGS } from '../i18n';

const AudioStreamer = () => {
    const [bgColor, setBgColor] = useState('#191414');
    const [language, setLanguage] = useState<Language>('en');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const scrollEndRef = useRef<HTMLDivElement>(null);
    const [toolLogs, setToolLogs] = useState<string[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);

    const t = UI_STRINGS[language];

    const stopAction = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyWindow = window as any;
        if (typeof anyWindow.__stopVoice === 'function') {
            anyWindow.__stopVoice();
        }
        setToolLogs(prev => [...prev, `close_session()`]);
    }, []);

    const tools = useMemo(() => getTools(language, {
        set_bg_color: ({ color }) => {
            setBgColor(color);
            setToolLogs(prev => [...prev, `set_bg_color(${color})`]);
        },
        toggle_sidebar: ({ open }) => {
            setShowSidebar(open);
            setToolLogs(prev => [...prev, `toggle_sidebar(${open})`]);
        },
        open_modal: () => {
            setIsModalOpen(true);
            setModalContent("Esta é uma ação disparada por voz!");
            setToolLogs(prev => [...prev, `open_modal()`]);
        },
        close_modal: () => {
            setIsModalOpen(false);
            setToolLogs(prev => [...prev, `close_modal()`]);
        },
        close_session: stopAction
    }), [language, stopAction]);

    // Configuração dos provedores
    const asr = useMemo(() => webSpeech(), []);
    const llm = useMemo(() => webLLM({
        modelId: "Llama-3.2-1B-Instruct-q4f16_1-MLC"
    }), []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (llm as any).updateConfig === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (llm as any).updateConfig({
                systemPrompt: getSystemPrompt(language, tools)
            });
        }
    }, [language, tools, llm]);

    const { 
        start, 
        stop, 
        isListening, 
        llmState, 
        asrState, 
        loadProgress, 
        loadStatus,
        transcripts,
        setTranscripts,
        partialTranscript 
    } = useActosVoice({ 
        asr, 
        llm,
        language,
        tools
    });

    // Sincroniza o ref de stop para ser usado nas tools
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__stopVoice = stop;
    }, [stop]);

    useEffect(() => {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts, partialTranscript]);


    // Styles objects
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row' as const,
            height: '100vh',
            width: '100vw',
            backgroundColor: bgColor,
            transition: 'background-color 1s ease',
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            overflow: 'hidden',
        },
        sidebar: {
            width: showSidebar ? '350px' : '0px',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            borderRight: showSidebar ? '1px solid rgba(255,255,255,0.1)' : 'none',
            display: 'flex',
            flexDirection: 'column' as const,
            padding: showSidebar ? '30px' : '0px',
            gap: '25px',
            overflowY: 'auto' as const,
            overflowX: 'hidden' as const,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: showSidebar ? 1 : 0,
            position: 'relative' as const,
        },
        toggleBtn: {
            position: 'absolute' as const,
            top: '20px',
            left: showSidebar ? '365px' : '20px',
            zIndex: 100,
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        mainContent: {
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column' as const,
            position: 'relative' as const,
        },
        lyricsContainer: {
            flex: 1,
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            overflowY: 'auto' as const,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'flex-start', 
            alignItems: 'center',
            gap: '20px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            textAlign: 'center' as const,
        },
        lineHistory: {
            fontSize: '1.6rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            transition: 'all 0.4s ease',
            lineHeight: 1.4,
        },
        lineActive: {
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#FFFFFF',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
            lineHeight: 1.4,
            animation: 'pulse 2s infinite ease-in-out',
        },
        controls: {
            padding: '40px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '15px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
        },
        button: {
            padding: '18px 40px',
            fontSize: '1.1rem',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        },
        btnConnect: {
            backgroundColor: '#1db954',
            color: 'white',
        },
        btnRecord: {
            backgroundColor: '#e91429',
            color: 'white',
        },
        statusIndicator: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
        },
        card: {
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '0.9rem',
        },
        modal: {
            position: 'fixed' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            color: '#111827',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            textAlign: 'center' as const,
            minWidth: '400px',
            maxWidth: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px',
            animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar Toggles */}
            <button 
                style={styles.toggleBtn}
                onClick={() => setShowSidebar(!showSidebar)}
            >
                {showSidebar ? '←' : '→'}
            </button>

            {/* Modal de Teste */}
            {isModalOpen && (
                <>
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)', 
                        backdropFilter: 'blur(8px)',
                        zIndex: 999,
                        animation: 'fadeIn 0.2s ease-out'
                    }} onClick={() => setIsModalOpen(false)} />
                    <div style={styles.modal}>
                        <div style={{
                            width: '48px', height: '48px', backgroundColor: '#ecfdf5', 
                            borderRadius: '50%', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', margin: '0 auto 10px', color: '#10b981'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h2 style={{
                            margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 800,
                            letterSpacing: '-0.025em'
                        }}>{t.systemActive}</h2>
                        <p style={{
                            fontSize: '1rem', color: '#4b5563', margin: 0, 
                            fontWeight: 400, lineHeight: 1.6
                        }}>{modalContent}</p>
                        <button 
                            style={{
                                ...styles.button, 
                                backgroundColor: '#111827', 
                                color: 'white', 
                                margin: '10px auto 0',
                                padding: '12px 24px',
                                fontSize: '0.95rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            {t.confirm}
                        </button>
                    </div>
                </>
            )}

            {/* PAINEL ESQUERDO: CONFIG & TOOLS */}
            <aside style={styles.sidebar}>
                <header style={{ flexShrink: 0 }}>
                    <h1 style={{fontSize: '1.8rem', margin: 0, letterSpacing: '-1px'}}>
                        {t.title} 
                        <span style={{
                            fontSize: '0.6rem',
                            backgroundColor: '#1db954',
                            color: 'black',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            verticalAlign: 'middle',
                            marginLeft: '8px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            display: 'inline-block'
                        }}>
                            Experimental
                        </span>
                    </h1>
                    <p style={{fontSize: '0.8rem', opacity: 0.6, marginTop: '5px'}}>{t.subtitle}</p>
                </header>

                <div style={styles.card}>
                    <div style={{fontWeight: 700, marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                        <span>{t.coreSettings}</span>
                        <div style={{
                            ...styles.statusIndicator,
                            backgroundColor: llmState === 'ready' ? '#1db954' : '#666',
                            boxShadow: llmState === 'ready' ? '0 0 10px #1db954' : 'none'
                        }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px'}}>{t.language}</label>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                                    backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer'
                                }}
                            >
                                <option value="pt">Português</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px'}}>{t.llmStatus}</label>
                            {llmState === 'loading' ? (
                                <div style={{fontSize: '0.8rem', color: '#ffc107'}}>
                                    {t.llmWait} {loadStatus} ({Math.round(loadProgress)}%)
                                </div>
                            ) : (
                                <div style={{fontSize: '0.8rem', color: llmState === 'ready' ? '#1db954' : '#666'}}>
                                    {llmState === 'ready' ? t.llmOnline : t.llmOffline}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{...styles.card, flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div style={{fontWeight: 700, marginBottom: '15px'}}>{t.capabilities}</div>
                    
                    <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <li>{t.capColor}</li>
                        <li>{t.capSidebar}</li>
                        <li>{t.capModalOpen}</li>
                        <li>{t.capModalClose}</li>
                        <li>{t.capSession}</li>
                    </ul>

                    <div style={{marginTop: 'auto', paddingTop: '20px'}}>
                         <div style={{fontSize: '0.7rem', opacity: 0.5, marginBottom: '10px'}}>{t.lastToolCalls}</div>
                         <div style={{
                             backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px',
                             fontSize: '0.75rem', fontFamily: 'monospace', color: '#1db954', minHeight: '100px'
                         }}>
                             {toolLogs.length === 0 ? `> ${t.idle}` : toolLogs.slice(-3).map((l, i) => (
                                 <div key={i} style={{marginBottom: '5px'}}>{`> ${l}`}</div>
                             ))}
                         </div>
                    </div>
                </div>

                <div style={{...styles.card, marginTop: '10px'}}>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: '#1db954',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                    }}>
                        {t.npmInstall}
                    </div>
                </div>

                <div style={{textAlign: 'center', marginTop: '20px', paddingBottom: '10px'}}>
                    <div style={{fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)'}}>
                        {t.createdBy}
                    </div>
                    <a 
                        href={t.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{fontSize: '0.7rem', opacity: 0.4, marginTop: '2px', color: 'inherit', textDecoration: 'none'}}
                    >
                        {t.github}
                    </a>
                </div>
            </aside>

            {/* PAINEL CENTRAL: INTERAÇÃO */}
            <main style={styles.mainContent}>
                {/* GitHub Link Button */}
                <a 
                    href={t.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 100,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    {t.gitRepo}
                </a>

                <div style={styles.lyricsContainer}>
                    <div style={{height: '20%', flexShrink: 0}}></div>
                    
                    {transcripts.map((line: string, index: number) => (
                        <div key={index} style={styles.lineHistory}>
                            {line}
                        </div>
                    ))}
                    
                    <div style={styles.lineActive} ref={scrollEndRef}>
                        {partialTranscript || (isListening ? t.listening : '')}
                    </div>
                    
                    <div style={{height: '20%', flexShrink: 0}}></div>
                </div>

                <div style={styles.controls}>
                    {asrState === 'error' ? (
                        <div style={{...styles.card, backgroundColor: 'rgba(233, 20, 41, 0.2)', color: '#ff6b6b'}}>
                            {t.voiceError}
                        </div>
                    ) : llmState === 'unloaded' ? (
                        <button style={{...styles.button, ...styles.btnConnect}} onClick={start}>
                            {t.initAI}
                        </button>
                    ) : llmState === 'loading' ? (
                        <button style={{...styles.button, backgroundColor: '#333', color: '#888', cursor: 'wait'}} disabled>
                            {t.llmWait} ({Math.round(loadProgress)}%)
                        </button>
                    ) : !isListening ? (
                        <button style={{...styles.button, ...styles.btnConnect}} onClick={start}>
                            {t.startTalking}
                        </button>
                    ) : (
                        <div style={{display: 'flex', gap: '15px'}}>
                            <button style={{...styles.button, ...styles.btnRecord}} onClick={stop}>
                                {t.stopSession}
                            </button>
                            <button 
                                style={{...styles.button, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '15px 25px'}}
                                onClick={() => setTranscripts([])}
                            >
                                {t.clear}
                            </button>
                        </div>
                    )}
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px'}}>
                        <div style={{
                            ...styles.statusIndicator,
                            backgroundColor: isListening ? '#1db954' : '#666',
                            boxShadow: isListening ? '0 0 10px #1db954' : 'none'
                        }}></div>
                        <span style={{fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px'}}>
                            {isListening ? t.streaming : t.waiting}
                        </span>
                    </div>
                </div>
            </main>
            
            {/* Simple CSS animation injection */}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                /* Hide Scrollbar */
                ::-webkit-scrollbar { width: 0px; background: transparent; }
            `}</style>
        </div>
    );
};

export default AudioStreamer;
