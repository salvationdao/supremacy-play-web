export const GAME_SERVER_HOSTNAME = process.env.REACT_APP_GAME_SERVER_HOST || 'localhost:8084'
export const PASSPORT_WEB = process.env.REACT_APP_PASSPORT_WEB || 'http://localhost:5003'
export const PASSPORT_SERVER_HOSTNAME = process.env.REACT_APP_PASSPORT_SERVER_HOST || 'localhost:8086'
export const STREAM_SITE = process.env.REACT_APP_STREAM_SITE || ''
export const LOG_API_CALLS = true
export const UI_OPACITY = 0.93
export const NOTIFICATION_TIME = 20000
export const NOTIFICATION_LINGER = 400
export const NullUUID = '00000000-0000-0000-0000-000000000000'
export const SENTRY_CONFIG = {
    DSN: process.env.REACT_APP_SENTRY_DSN_FRONTEND,
    RELEASE: process.env.REACT_APP_SENTRY_CURRENT_RELEASE_NAME,
    ENVIRONMENT: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    get SAMPLERATE(): number {
        const rate = Number(process.env.REACT_APP_SENTRY_SAMPLERATE)

        // Check rate is a number between 0 and 1
        if (isNaN(rate) || rate > 1 || rate < 0) {
            return 0.01
        }
        return rate
    },
}
