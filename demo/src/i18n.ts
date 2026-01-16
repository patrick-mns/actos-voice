import type { Language, Tool } from '@actos-voice/core';

export const PROMPTS: Record<Language, string> = {
    en: `You are a playground assistant for the ActosVoice library.
    Respond ONLY with structured JSON.
    
    COLOR RULES:
    Always provide the color in HEX format (e.g., "#FF0000").
    
    Available tools:
    {{TOOLS}}
    
    IMPORTANT: If you are not certain about which tool to call, or if the user instruction does not clearly correspond to any tool, DO NOT use tool calling. In this case, set "tool" to null.
    
    Always return JSON in this format:
    {"tool": "tool_name" | null, "args": {"param": "value"}, "response": "Your conversational response"}
    
    Examples: 
    - "Change to red" -> {"tool": "set_bg_color", "args": {"color": "#FF0000"}, "response": "Got it, changing to red!"}
    - "Close menu" -> {"tool": "toggle_sidebar", "args": {"open": false}, "response": "Closing sidebar"}
    - "End conversation" -> {"tool": "close_session", "response": "Goodbye!"}
    - "Tell me a joke" -> {"tool": null, "response": "Why don't scientists trust atoms? Because they make up everything!"}`,
    pt: `Você é um assistente de playground para a biblioteca ActosVoice. 
    Responda APENAS com JSON estruturado.
    
    REGRAS DE CORES:
    Sempre forneça a cor no formato HEX (ex: "#FF0000").
    
    Ferramentas disponíveis:
    {{TOOLS}}

    IMPORTANTE: Se você não tiver certeza sobre qual ferramenta chamar, ou se a instrução do usuário não corresponder claramente a nenhuma ferramenta, NÃO use tool calling. Nesse caso, defina "tool" como null.
    
    Sempre retorne JSON neste formato:
    {"tool": "nome_da_ferramenta" | null, "args": {"param": "valor"}, "response": "Sua resposta conversacional"}
    
    Exemplos: 
    - "Mude para vermelho" -> {"tool": "set_bg_color", "args": {"color": "#FF0000"}, "response": "Pronto, mudei para vermelho!"}
    - "Fechar menu" -> {"tool": "toggle_sidebar", "args": {"open": false}, "response": "Fechando o menu"}
    - "Encerrar conversa" -> {"tool": "close_session", "response": "Até logo!"}
    - "Me conte uma piada" -> {"tool": null, "response": "Por que o livro de matemática se suicidou? Porque tinha muitos problemas!"}`
};

export const getSystemPrompt = (lang: Language, tools: Record<string, Tool>) => {
    const toolsList = Object.values(tools)
        .map((t, i) => `${i + 1}. ${t.name}(${t.parameters ? Object.keys(t.parameters).join(', ') : ''}) - ${t.description}`)
        .join('\n');
    return PROMPTS[lang].replace('{{TOOLS}}', toolsList);
};

export const getTools = (lang: Language, actions: Record<string, (args: any) => void>): Record<string, Tool> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const descriptions: Record<Language, Record<string, string>> = {
        en: {
            set_bg_color: 'Changes the background color.',
            toggle_sidebar: 'Opens or closes the sidebar menu.',
            open_modal: 'Opens a test modal.',
            close_modal: 'Closes the active modal.',
            close_session: 'Ends the voice session and stops listening.'
        },
        pt: {
            set_bg_color: 'Muda a cor de fundo.',
            toggle_sidebar: 'Abre ou fecha o menu lateral de configurações.',
            open_modal: 'Abre um modal de teste.',
            close_modal: 'Fecha o modal ativo.',
            close_session: 'Encerra a sessão de voz e para de ouvir.'
        }
    };

    const d = descriptions[lang];

    return {
        set_bg_color: {
            name: 'set_bg_color',
            description: d.set_bg_color,
            parameters: { color: { type: 'string', description: 'HEX Color' } },
            execute: (args) => actions.set_bg_color(args)
        },
        toggle_sidebar: {
            name: 'toggle_sidebar',
            description: d.toggle_sidebar,
            parameters: { open: { type: 'boolean' } },
            execute: (args) => actions.toggle_sidebar(args)
        },
        open_modal: {
            name: 'open_modal',
            description: d.open_modal,
            parameters: null,
            execute: () => actions.open_modal({})
        },
        close_modal: {
            name: 'close_modal',
            description: d.close_modal,
            parameters: null,
            execute: () => actions.close_modal({})
        },
        close_session: {
            name: 'close_session',
            description: d.close_session,
            parameters: null,
            execute: () => actions.close_session({})
        }
    };
};

export interface UIStrings {
    title: string;
    subtitle: string;
    coreSettings: string;
    language: string;
    llmStatus: string;
    llmWait: string;
    llmOnline: string;
    llmOffline: string;
    capabilities: string;
    capColor: string;
    capSidebar: string;
    capModalOpen: string;
    capModalClose: string;
    capSession: string;
    lastToolCalls: string;
    idle: string;
    listening: string;
    initAI: string;
    startTalking: string;
    stopSession: string;
    clear: string;
    streaming: string;
    waiting: string;
    systemActive: string;
    confirm: string;
    voiceError: string;
    npmInstall: string;
    createdBy: string;
    github: string;
    githubUrl: string;
    repoUrl: string;
    gitRepo: string;
    // Explain section
    explainTitle: string;
    explainMotivationTitle: string;
    explainMotivationDesc: string;
    explainAdvantagesTitle: string;
    explainAdvantage1: string;
    explainAdvantage2: string;
    explainAdvantage3: string;
    explainAdvantage4: string;
    explainHowTitle: string;
    explainHowDesc: string;
    explainStep1: string;
    explainStep2: string;
    explainStep3: string;
    explainStep4: string;
    explainUseCasesTitle: string;
    explainUseCase1: string;
    explainUseCase2: string;
    explainUseCase3: string;
    explainUseCase4: string;
}

export const UI_STRINGS: Record<Language, UIStrings> = {
    en: {
        title: 'ActosVoice',
        subtitle: 'The Modern Voice AI Library',
        coreSettings: 'CORE SETTINGS',
        language: 'LANGUAGE',
        llmStatus: 'LLM STATUS',
        llmWait: 'Wait...',
        llmOnline: 'System Online (Local)',
        llmOffline: 'Offline',
        capabilities: 'CAPABILITIES',
        capColor: '"Change background to blue"',
        capSidebar: '"Close sidebar"',
        capModalOpen: '"Open modal"',
        capModalClose: '"Close modal"',
        capSession: '"End session"',
        lastToolCalls: 'LAST TOOL CALLS',
        idle: 'idle',
        listening: 'Listening...',
        initAI: 'Initialize ActosVoice AI',
        startTalking: 'Start Talking',
        stopSession: 'Stop Session',
        clear: 'Clear',
        streaming: 'Streaming Real-time',
        waiting: 'Waiting Input',
        systemActive: 'System Active',
        confirm: 'Confirm',
        voiceError: 'Voice Recognition Error',
        npmInstall: 'npm install @actos-voice/react',
        createdBy: 'by Patrick',
        github: 'github.com/patrick-mns',
        githubUrl: 'https://github.com/patrick-mns',
        repoUrl: 'https://github.com/patrick-mns/actos-voice',
        gitRepo: 'Git Repo',
        // Explain section
        explainTitle: 'What is ActosVoice?',
        explainMotivationTitle: 'Why ActosVoice?',
        explainMotivationDesc: 'Most voice interfaces are rigid - they work with predefined commands. ActosVoice takes a different approach: it\'s a flexible framework that lets you build voice-controlled apps that actually understand what users want, not just what they say word-for-word.',
        explainAdvantagesTitle: 'Core Philosophy',
        explainAdvantage1: 'Plugin-based architecture - swap any component',
        explainAdvantage2: 'LLM-powered understanding - no rigid command matching',
        explainAdvantage3: 'Tool calling system - voice triggers any function',
        explainAdvantage4: 'Framework agnostic - React, Vue, vanilla JS, whatever',
        explainHowTitle: 'How It Works',
        explainHowDesc: 'ActosVoice is basically three pieces working together:',
        explainStep1: '1. ASR Provider - captures voice (any speech-to-text)',
        explainStep2: '2. LLM Provider - understands intent (any language model)',
        explainStep3: '3. Tool System - executes actions (your custom functions)',
        explainStep4: '4. You wire it up however you want',
        explainUseCasesTitle: 'Real Use Cases',
        explainUseCase1: 'Voice-controlled dashboards without training users',
        explainUseCase2: 'Accessibility layers for complex apps',
        explainUseCase3: 'Hands-free workflows for specialized environments',
        explainUseCase4: 'Prototyping conversational interfaces fast'
    },
    pt: {
        title: 'ActosVoice',
        subtitle: 'A Moderna Biblioteca de Voz AI',
        coreSettings: 'CONFIGURAÇÕES CORE',
        language: 'IDIOMA',
        llmStatus: 'STATUS DO LLM',
        llmWait: 'Aguarde...',
        llmOnline: 'Sistema Online (Local)',
        llmOffline: 'Offline',
        capabilities: 'CAPACIDADES',
        capColor: '"Mude o fundo para azul"',
        capSidebar: '"Fechar menu lateral"',
        capModalOpen: '"Abrir modal"',
        capModalClose: '"Fechar modal"',
        capSession: '"Encerrar sessão"',
        lastToolCalls: 'ÚLTIMAS CHAMADAS',
        idle: 'ocioso',
        listening: 'Ouvindo...',
        initAI: 'Inicializar ActosVoice AI',
        startTalking: 'Começar a Falar',
        stopSession: 'Parar Sessão',
        clear: 'Limpar',
        streaming: 'Streaming em Tempo Real',
        waiting: 'Aguardando Entrada',
        systemActive: 'Sistema Ativo',
        confirm: 'Confirmar',
        voiceError: 'Erro no Reconhecimento de Voz',
        npmInstall: 'npm install @actos-voice/react',
        createdBy: 'by Patrick',
        github: 'github.com/patrick-mns',
        githubUrl: 'https://github.com/patrick-mns',
        repoUrl: 'https://github.com/patrick-mns/actos-voice',
        gitRepo: 'Repositório',
        // Explain section
        explainTitle: 'O que é o ActosVoice?',
        explainMotivationTitle: '🎯 Por que ActosVoice?',
        explainMotivationDesc: 'A maioria das interfaces de voz são rígidas - funcionam com comandos predefinidos. ActosVoice é diferente: é um framework flexível que te deixa construir apps controlados por voz que realmente entendem o que o usuário quer, não só o que ele diz palavra por palavra.',
        explainAdvantagesTitle: '⚡ Filosofia Central',
        explainAdvantage1: 'Arquitetura baseada em plugins - troque qualquer componente',
        explainAdvantage2: 'Compreensão via LLM - sem matching rígido de comandos',
        explainAdvantage3: 'Sistema de tool calling - voz dispara qualquer função',
        explainAdvantage4: 'Framework agnóstico - React, Vue, JS puro, tanto faz',
        explainHowTitle: '🔧 Como Funciona',
        explainHowDesc: 'ActosVoice são basicamente três peças trabalhando juntas:',
        explainStep1: '1. ASR Provider - captura voz (qualquer speech-to-text)',
        explainStep2: '2. LLM Provider - entende intenção (qualquer modelo)',
        explainStep3: '3. Tool System - executa ações (suas funções customizadas)',
        explainStep4: '4. Você conecta do jeito que quiser',
        explainUseCasesTitle: '💡 Casos de Uso Reais',
        explainUseCase1: 'Dashboards por voz sem treinar usuários',
        explainUseCase2: 'Camadas de acessibilidade para apps complexos',
        explainUseCase3: 'Workflows hands-free para ambientes especializados',
        explainUseCase4: 'Prototipagem rápida de interfaces conversacionais'
    }
};
