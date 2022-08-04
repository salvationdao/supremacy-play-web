import BigNumber from "bignumber.js"

const USE_PROD = false

// Envar stuff
export const STAGING_OR_DEV_ONLY = process.env.REACT_APP_ENVIRONMENT !== "production"
export const DEV_ONLY = process.env.REACT_APP_ENVIRONMENT !== "production" && process.env.REACT_APP_ENVIRONMENT !== "staging"
export const CAPTCHA_KEY = process.env.REACT_APP_CAPTCHA_SITE_KEY || "87f715ba-98ff-43da-b970-cfc30fd7c5a0"
const VERSION = process.env.REACT_APP_COMMIT_REF || "development"
const TOKEN_SALE_PAGE = process.env.REACT_APP_TOKEN_SALE_PAGE || "https://passport.xsyn.io/external/buy"
const SUPREMACY_PAGE = process.env.REACT_APP_SUPREMACY_PAGE || "https://supremacy.game/"
const HANGAR_PAGE = STAGING_OR_DEV_ONLY ? "https://hangar.supremacygame.dev/" : "https://hangar.supremacy.game/"
const VIDEO_SERVER_WEBSOCKET = process.env.REACT_APP_PASSPORT_SERVER_HOST || "wss://staging-watch.supremacy.game:5443/WebRTCAppEE/websocket"
const VIDEO_SERVER_STREAM_ID = process.env.REACT_APP_PASSPORT_SERVER_HOST || "524280586954581049507513"
let GAME_SERVER_HOSTNAME = process.env.REACT_APP_GAME_SERVER_HOSTNAME || "api.supremacygame.io"
let PASSPORT_WEB = process.env.REACT_APP_PASSPORT_WEB || "https://passport.xsyndev.io/"
let PASSPORT_SERVER_HOST = process.env.REACT_APP_PASSPORT_SERVER_HOST || "passport.supremacygame.io"
let PASSPORT_SERVER_HOST_IMAGES = process.env.REACT_APP_SERVER_HOST_IMAGES || "https://api.supremacygame.io"

if (USE_PROD) {
    GAME_SERVER_HOSTNAME = process.env.REACT_APP_GAME_SERVER_HOSTNAME || "api.supremacy.game"
    PASSPORT_WEB = process.env.REACT_APP_PASSPORT_WEB || "https://passport.xsyn.io/"
    PASSPORT_SERVER_HOST = process.env.REACT_APP_PASSPORT_SERVER_HOST || "api.xsyn.io"
    PASSPORT_SERVER_HOST_IMAGES = process.env.REACT_APP_SERVER_HOST_IMAGES || "https://api.xsyn.io"
}

export {
    VERSION,
    GAME_SERVER_HOSTNAME,
    TOKEN_SALE_PAGE,
    SUPREMACY_PAGE,
    HANGAR_PAGE,
    PASSPORT_WEB,
    PASSPORT_SERVER_HOST,
    PASSPORT_SERVER_HOST_IMAGES,
    VIDEO_SERVER_WEBSOCKET,
    VIDEO_SERVER_STREAM_ID,
}

export const SENTRY_CONFIG = {
    DSN: process.env._SENTRY_DSN_FRONTEND,
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
export const GAME_BAR_HEIGHT = 5.9 // rem
export const RIGHT_DRAWER_WIDTH = 38 // rem
export const CONTROLS_HEIGHT = 3.0 // rem
export const BOTTOM_NAV_HEIGHT = 85 // rem

export const DRAWER_TRANSITION_DURATION = 250
export const MESSAGES_BUFFER_SIZE = 500
export const MAX_CHAT_MESSAGE_LENGTH = 280
export const NOTIFICATION_TIME = 30000
export const NOTIFICATION_LINGER = 400
export const MAX_BAN_PROPOSAL_REASON_LENGTH = 150

// Game stuff
export const VOTING_OPTION_COSTS = [
    {
        percentage: 0.0001, // 0.01%
        minCost: new BigNumber(0.01),
    },
    {
        percentage: 0.001, // 0.1%
        minCost: new BigNumber(0.1),
    },
    {
        percentage: 0.01, // 1%
        minCost: new BigNumber(1),
    },
]

export enum FactionIDs {
    RM = "98bf7bb3-1a7c-4f21-8843-458d62884060",
    ZHI = "880db344-e405-428d-84e5-6ebebab1fe6d",
    BC = "7c6dde21-b067-46cf-9e56-155c88a520e2",
}

// Other stuff
export const NullUUID = "00000000-0000-0000-0000-000000000000"
export const TRAILER_VIDEO =
    "https://player.vimeo.com/progressive_redirect/playback/681913587/rendition/1080p?loc=external&signature=6d5bf3570be8bd5e9e57a6a786964a99d067957fbcf9e3a40b6914c085c9b3e9#t=10"

// Maintenance (ENVAR). The local storage is a hack to let the team members in
export const UNDER_MAINTENANCE = process.env.REACT_APP_MAINTENANCE_PAGE === "true" && !localStorage.getItem("NinjaSecrets@!")

export const PRISMIC_ACCESS_TOKEN = process.env.REACT_APP_PRISMIC_ACCESS_TOKEN

// note: telegram notifications does not work on develop
export const TELEGRAM_BOT_URL = process.env.REACT_APP_TELEGRAM_BOT_URL || "https://t.me/SupremacyNotifyBot"

export const BATTLE_ARENA_OPEN = STAGING_OR_DEV_ONLY

// stripe
export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
