import { defineLocale } from './define-locale'

// Português (Brasil) — locale parcial. O que não estiver aqui cai para o inglês
// automaticamente (via defineLocale → merge sobre `en`). Traduzir incrementalmente:
// priorizamos o "chrome" mais visível (navegação, aparência, botões, onboarding,
// erros). Strings de marca ("Hermes"/"Nous Research") são reescritas no catálogo,
// então aqui usamos "Lex" ou termos neutros à vontade.
export const ptBr = defineLocale({
  common: {
    apply: 'Aplicar',
    back: 'Voltar',
    save: 'Salvar',
    saving: 'Salvando…',
    cancel: 'Cancelar',
    change: 'Alterar',
    choose: 'Escolher',
    clear: 'Limpar',
    close: 'Fechar',
    collapse: 'Recolher',
    confirm: 'Confirmar',
    connect: 'Conectar',
    connecting: 'Conectando',
    continue: 'Continuar',
    copied: 'Copiado',
    copy: 'Copiar',
    copyFailed: 'Falha ao copiar',
    delete: 'Excluir',
    docs: 'Documentação',
    done: 'Concluído',
    error: 'Erro',
    failed: 'Falhou',
    free: 'Grátis',
    loading: 'Carregando…',
    notSet: 'Não definido',
    refresh: 'Atualizar',
    remove: 'Remover',
    replace: 'Substituir',
    retry: 'Tentar novamente',
    run: 'Executar',
    send: 'Enviar',
    set: 'Definir',
    skip: 'Pular',
    update: 'Atualizar',
    on: 'Ligado',
    off: 'Desligado'
  },
  language: {
    label: 'Idioma',
    description: 'Escolha o idioma da interface do desktop.',
    saving: 'Salvando idioma…',
    saveError: 'Falha ao atualizar o idioma',
    switchTo: 'Trocar idioma',
    searchPlaceholder: 'Buscar idiomas…',
    noResults: 'Nenhum idioma encontrado'
  },
  settings: {
    closeSettings: 'Fechar configurações',
    exportConfig: 'Exportar configuração',
    importConfig: 'Importar configuração',
    resetToDefaults: 'Restaurar padrões',
    resetConfirm: 'Restaurar todas as configurações para os padrões?',
    exportFailed: 'Falha na exportação',
    resetFailed: 'Falha ao restaurar',
    nav: {
      providers: 'Provedores',
      providerAccounts: 'Contas',
      providerApiKeys: 'Chaves de API',
      gateway: 'Gateway',
      apiKeys: 'Ferramentas e Chaves',
      keysTools: 'Ferramentas',
      keysSettings: 'Configurações',
      mcp: 'MCP',
      archivedChats: 'Conversas Arquivadas',
      about: 'Sobre'
    },
    sections: {
      model: 'Modelo',
      chat: 'Chat',
      appearance: 'Aparência',
      workspace: 'Área de Trabalho',
      safety: 'Segurança',
      memory: 'Memória e Contexto',
      voice: 'Voz',
      advanced: 'Avançado'
    },
    searchPlaceholder: {
      config: 'Buscar configurações...',
      gateway: 'Conexão do gateway...',
      keys: 'Buscar chaves de API...',
      mcp: 'Buscar servidores MCP...',
      sessions: 'Buscar conversas arquivadas...'
    },
    modeOptions: {
      light: { label: 'Claro', description: 'Superfícies claras' },
      dark: { label: 'Escuro', description: 'Espaço de baixo brilho' },
      system: { label: 'Sistema', description: 'Seguir a aparência do sistema' }
    },
    appearance: {
      title: 'Aparência',
      intro:
        'Preferências de exibição (apenas no desktop). O modo controla o brilho; o tema controla a paleta de destaque e o estilo da conversa.',
      colorMode: 'Modo de Cor',
      colorModeDesc: 'Escolha um modo fixo ou deixe seguir a configuração do seu sistema.',
      toolViewTitle: 'Exibição de Ferramentas',
      toolViewDesc: 'Produto oculta os dados brutos; Técnico mostra entrada/saída completa.',
      product: 'Produto',
      productDesc: 'Atividade de ferramentas amigável, com resumos concisos.',
      technical: 'Técnico',
      technicalDesc: 'Inclui argumentos/resultados brutos e detalhes de baixo nível.',
      themeTitle: 'Tema',
      themeDesc: 'Apenas paletas do desktop. O modo selecionado é aplicado por cima.',
      themeProfileNote: (profile: string) => `Salvo para o perfil ${profile} — cada perfil mantém seu próprio tema.`
    }
  },
  onboarding: {
    headerTitle: 'Vamos configurar o Lex',
    headerDesc: 'Conecte um provedor de modelo para começar a conversar. A maioria das opções é um clique.',
    preparingInstall: 'O Lex está finalizando a instalação. Normalmente leva menos de um minuto na primeira vez.',
    starting: 'Iniciando o Lex…',
    lookingUpProviders: 'Buscando provedores...',
    collapse: 'Recolher',
    otherProviders: 'Outros provedores',
    haveApiKey: 'Tenho uma chave de API',
    chooseLater: 'Escolho um provedor depois',
    recommended: 'Recomendado',
    connected: 'Conectado',
    backToSignIn: 'Voltar ao login',
    getKey: 'Obter uma chave',
    replaceCurrent: 'Substituir o valor atual',
    pasteApiKey: 'Cole a chave de API',
    couldNotSave: 'Não foi possível salvar a credencial.',
    connecting: 'Conectando',
    update: 'Atualizar',
    signInFailed: 'Falha no login. Tente novamente.',
    pickDifferentProvider: 'Escolher outro provedor',
    signedIn: 'Já fiz login',
    copy: 'Copiar',
    defaultModel: 'Modelo padrão',
    freeTier: 'Plano gratuito',
    pro: 'Pro',
    free: 'Grátis',
    change: 'Alterar',
    startChatting: 'Começar'
  },
  errors: {
    genericFailure: 'Algo deu errado',
    boundaryTitle: 'Algo quebrou na interface',
    boundaryDesc: 'A tela encontrou um erro inesperado. Suas conversas e configurações estão seguras.',
    reloadWindow: 'Recarregar janela',
    openLogs: 'Abrir logs'
  },
  ui: {
    search: {
      clear: 'Limpar busca'
    },
    pagination: {
      label: 'paginação',
      previous: 'Anterior',
      previousAria: 'Ir para a página anterior',
      next: 'Próxima',
      nextAria: 'Ir para a próxima página'
    },
    sidebar: {
      title: 'Barra lateral',
      description: 'Exibe a barra lateral móvel.',
      toggle: 'Alternar barra lateral'
    }
  }
})
