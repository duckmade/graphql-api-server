// Common
export const PROD = process.env.NODE_ENV === "production"
export const DEBUG = process.env.DEBUG
export const HOST = PROD ? "0.0.0.0" : "localhost"
export const PORT = 4000
export const BASE_PATH = process.env.BASE_PATH || ""
export const ORIGINS = (process.env.ORIGINS || "*").split(",")

// Patreon API
export const PATREON_HOST = "https://www.patreon.com"
export const PATREON_ID = process.env.PATREON_ID || ""
export const PATREON_SECRET = process.env.PATREON_SECRET || ""
export const PATREON_CALLBACK =
  `${process.env.PATREON_CALLBACK}${BASE_PATH}` || ""

// SendInBlue API
export const SENDINBLUE_HOST = "https://api.sendinblue.com"
export const SENDINBLUE_KEY = process.env.SENDINBLUE_KEY || ""

// Add all APIs to the origins list
ORIGINS.push(PATREON_HOST, SENDINBLUE_HOST)

// Check mandatory env variables
if (!PATREON_ID) {
  console.log("MISSING REQUIRED ENV VARS. Please set PATREON_ID.")
}
if (!PATREON_SECRET) {
  console.log("MISSING REQUIRED ENV VARS. Please set PATREON_SECRET.")
}
if (!PATREON_CALLBACK) {
  console.log("MISSING REQUIRED ENV VARS. Please set PATREON_CALLBACK.")
}
if (!SENDINBLUE_KEY) {
  console.log("MISSING REQUIRED ENV VARS. Please set SENDINBLUE_KEY.")
}
