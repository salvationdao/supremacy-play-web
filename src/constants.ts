// Envar stuff
export const VERSION = process.env.REACT_APP_COMMIT_REF || "development"
export const GAME_SERVER_HOSTNAME = process.env.REACT_APP_GAME_SERVER_HOSTNAME || "localhost:8084"
export const TOKEN_SALE_PAGE = process.env.REACT_APP_TOKEN_SALE_PAGE || "https://sale.supremacy.game/"
export const SUPREMACY_PAGE = process.env.REACT_APP_SUPREMACY_PAGE || "https://supremacy.game/"
export const PASSPORT_WEB = process.env.REACT_APP_PASSPORT_WEB || "http://localhost:5003/"
export const PASSPORT_SERVER_HOST = process.env.REACT_APP_PASSPORT_SERVER_HOST || "localhost:8086"
export const PASSPORT_SERVER_HOST_IMAGES = process.env.REACT_APP_SERVER_HOST_IMAGES || "http://localhost:8086"
export const VIDEO_SERVER_WEBSOCKET =
    process.env.REACT_APP_PASSPORT_SERVER_HOST || "wss://staging-watch.supremacy.game:5443/WebRTCAppEE/websocket"
export const VIDEO_SERVER_STREAM_ID = process.env.REACT_APP_PASSPORT_SERVER_HOST || "524280586954581049507513"
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

// UI related stuff
export const GAME_BAR_HEIGHT = 61
export const LIVE_CHAT_DRAWER_WIDTH = 340
export const LIVE_CHAT_DRAWER_BUTTON_WIDTH = 20
export const DRAWER_TRANSITION_DURATION = 250
export const MESSAGES_BUFFER_SIZE = 300
export const MAX_CHAT_MESSAGE_LENGTH = 280
export const UI_OPACITY = 0.96
export const GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS = 2000
export const NOTIFICATION_TIME = 38000
export const NOTIFICATION_LINGER = 400
export const CONTROLS_HEIGHT = 30
export const STREAM_ASPECT_RATIO_W_H = 16 / 9
export const MINI_MAP_DEFAULT_WIDTH = 230
export const MINI_MAP_DEFAULT_HEIGHT = 200

// Other stuff
export const NullUUID = "00000000-0000-0000-0000-000000000000"
export const TRAILER_VIDEO =
    "https://player.vimeo.com/progressive_redirect/playback/681913587/rendition/1080p?loc=external&signature=6d5bf3570be8bd5e9e57a6a786964a99d067957fbcf9e3a40b6914c085c9b3e9"

// Maintenance (ENVAR). The local stroage is a hack to let the team members in
export const UNDER_MAINTENANCE =
    process.env.REACT_APP_MAINTENANCE_PAGE == "true" && !localStorage.getItem("NinjaSecrets@!")
