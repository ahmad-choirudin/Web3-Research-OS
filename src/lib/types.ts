export type Page = 'dashboard' | 'library' | 'protocols' | 'wallets' | 'analytics' | 'kanban' | 'assistant' | 'settings'
export type Go = (p: Page) => void
