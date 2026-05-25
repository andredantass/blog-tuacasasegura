interface SiteConfig {
  site: string
  author: string
  title: string
  description: string
  lang: string
  ogLocale: string
  shareMessage: string
  paginationSize: number
}

export const siteConfig: SiteConfig = {
  site: 'https://tuacasablindada.com.br',
  author: 'Tua Casa Blindada',
  title: 'Tua Casa Blindada',
  description: 'Dicas e conteúdo sobre segurança residencial, blindagem e proteção para sua casa.',
  lang: 'pt-BR',
  ogLocale: 'pt_BR',
  shareMessage: 'Compartilhe este artigo',
  paginationSize: 6
}
