const base = import.meta.env.BASE_URL

export const sitePath = (path = '') => `${base}${path.replace(/^\/+/, '')}`
export const siteRoot = base.endsWith('/') ? base.slice(0, -1) : base
