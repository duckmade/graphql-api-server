// Common
export const PROD = process.env.NODE_ENV === "production"
export const DEBUG = process.env.DEBUG
export const HOST = PROD ? "0.0.0.0" : "localhost"
export const PORT = 4000
export const SUB_PATH = process.env.SUB_PATH || ""
export const ORIGINS = (process.env.ORIGINS || "*").split(",")

// Patreon API
export const PATREON_HOST = "https://www.patreon.com"
export const PATREON_ID = process.env.PATREON_ID || ""
export const PATREON_SECRET = process.env.PATREON_SECRET || ""
export const PATREON_CALLBACK = process.env.PATREON_CALLBACK || ""

// SendInBlue API
export const SENDINBLUE_HOST = "https://api.sendinblue.com"
export const SENDINBLUE_KEY = process.env.SENDINBLUE_KEY || ""

ORIGINS.push(PATREON_HOST, SENDINBLUE_HOST)
