// Check mandatory ENV variables
if (
  !process.env.PATREON_ID ||
  !process.env.PATREON_SECRET ||
  !process.env.SENDINBLUE_KEY ||
  !process.env.SMTP_TO_NAME ||
  !process.env.SMTP_TO_EMAIL
) {
  console.log(
    "MISSING REQUIRED ENV VARS. Please remember to set PATREON_ID, PATREON_SECRET, SENDINBLUE_KEY, SMTP_TO_NAME and SMTP_TO_EMAIL."
  )
}

// Common
export const PROD = process.env.NODE_ENV === "production"

// HTTP Server
export const SERVER_HOST = PROD ? "0.0.0.0" : "localhost"
export const SERVER_PORT = 4000
export const SERVER_BASE_PATH = process.env.BASE_PATH || ""
export const SERVER_CORS_ORIGINS = (process.env.CORS_ORIGINS || "*").split(",")

// Patreon API
export const PATREON_HOST = "https://www.patreon.com"
export const PATREON_ID = process.env.PATREON_ID || ""
export const PATREON_SECRET = process.env.PATREON_SECRET || ""

// SendInBlue API & email
export const SENDINBLUE_HOST = "https://api.sendinblue.com"
export const SENDINBLUE_KEY = process.env.SENDINBLUE_KEY || ""
export const SMTP_TO_NAME = process.env.SMTP_TO_NAME || ""
export const SMTP_TO_EMAIL = process.env.SMTP_TO_EMAIL || ""

// Add all external hosts to the origins list when necessary
SERVER_CORS_ORIGINS.push(PATREON_HOST, SENDINBLUE_HOST)
!PROD && SERVER_CORS_ORIGINS.push("https://studio.apollographql.com")
