export const GAME_SERVER_HOSTNAME = process.env.REACT_APP_GAME_SERVER_HOST || "localhost:8084"
export const PASSPORT_WEB = process.env.REACT_APP_PASSPORT_WEB || "http://localhost:5003"
export const PASSPORT_SERVER_HOSTNAME = process.env.REACT_APP_PASSPORT_SERVER_HOST || "localhost:8086"
export const LOG_API_CALLS = true
export const UI_OPACITY = 0.96
export const NOTIFICATION_TIME = 28000
export const NOTIFICATION_LINGER = 400
export const STREAM_ASPECT_RATIO_W_H = 16 / 9
export const NullUUID = "00000000-0000-0000-0000-000000000000"
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
export const GAMEBAR_HEIGHT = 61
export const CONTROLS_HEIGHT = 30
export const LIVE_CHAT_DRAWER_WIDTH = 320
export const SIDE_BARS_WIDTH = 35
