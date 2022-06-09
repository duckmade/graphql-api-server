// Patreon API
export const PATREON_HOST = "https://www.patreon.com"
export const PATREON_ID = process.env.PATREON_ID || ""
export const PATREON_SECRET = process.env.PATREON_SECRET || ""

// SendInBlue API
export const SENDINBLUE_HOST = "https://api.sendinblue.com"
export const SENDINBLUE_KEY = process.env.SENDINBLUE_KEY || ""

// Common
export const IS_PROD = process.env.NODE_ENV === "production"
export const PORT = 4000
export const SUB_PATH = process.env.SUB_PATH || "/api"
export const HOST = process.env.HOST || `http://localhost:${PORT}`
export const ORIGINS = (process.env.ORIGINS || "*").split(",")
ORIGINS.push(PATREON_HOST, SENDINBLUE_HOST)
