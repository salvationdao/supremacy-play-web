import { BattleArenaPage, ClaimPage, HangarPage, MarketplacePage, BillingHistoryPage, NotFoundPage } from "../pages"
import { SvgChat } from "../assets"
import { Box } from "@mui/system"
import { colors } from "../theme/theme"
import { StorefrontPage } from "../pages/StorefrontPage"
import { MarketplaceItemPage } from "../pages/MarketplaceItemPage"
import { MarketplaceSellPage } from "../pages/MarketplaceSellPage"
import { MechPage } from "../pages/MechPage"
import { WeaponPage } from "../pages/WeaponPage"
import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"
import { PlayerProfilePage } from "../components/PublicProfile/PlayerProfile"
import { BATTLE_ARENA_OPEN, STAGING_OR_DEV_ONLY } from "../constants"
import { LeaderboardPage } from "../pages/LeaderboardPage"
import { JobsPage } from "../pages/JobsPage"

/**
 * Left drawer
 */
interface RouteStruct {
    id: string
    path: string
    exact: boolean
    Component?: () => JSX.Element | null
    requireAuth: boolean
    authTitle?: string // If omitted, it'll have a default title
    authDescription?: string // If omitted, it'll have a default description
    requireFaction: boolean
    leftDrawer?: {
        enable: boolean
        label: string
        comingSoonLabel?: string
    }
    matchLeftDrawerID?: string // The /route which will make this button highlighted
    enable: boolean
}

export const ROUTES_MAP: { [name: string]: RouteStruct } = {
    home: {
        id: "home",
        path: "/",
        exact: true,
        Component: BattleArenaPage,
        requireAuth: false,
        requireFaction: false,
        leftDrawer: {
            enable: BATTLE_ARENA_OPEN,
            label: "Battle Arena",
            comingSoonLabel: "Returning Soon",
        },
        matchLeftDrawerID: "home",
        enable: true,
    },

    // Leaderboard
    leaderboard: {
        id: "leaderboard",
        path: "/leaderboard/:type?",
        exact: true,
        Component: LeaderboardPage,
        requireAuth: false,
        requireFaction: false,
        leftDrawer: {
            enable: true,
            label: "Leaderboard",
        },
        matchLeftDrawerID: "leaderboard",
        enable: true,
    },

    // Mech
    mech: {
        id: "mech",
        path: "/mech/:mechID?",
        exact: true,
        Component: MechPage,
        requireAuth: true,
        requireFaction: true,
        matchLeftDrawerID: "fleet",
        enable: true,
    },

    // Weapon
    weapon: {
        id: "weapon",
        path: "/weapon/:weaponID?",
        exact: true,
        Component: WeaponPage,
        requireAuth: true,
        requireFaction: true,
        matchLeftDrawerID: "fleet",
        enable: true,
    },

    // Fleet
    fleet: {
        id: "fleet",
        path: "/fleet/:type?",
        exact: true,
        Component: HangarPage,
        requireAuth: true,
        requireFaction: true,
        leftDrawer: {
            enable: true,
            label: "fleet",
        },
        matchLeftDrawerID: "fleet",
        enable: true,
    },

    // Storefront
    storefront: {
        id: "storefront",
        path: "/storefront/:type?",
        exact: true,
        Component: StorefrontPage,
        requireAuth: true,
        requireFaction: true,
        leftDrawer: {
            enable: true,
            label: "Storefront",
        },
        matchLeftDrawerID: "storefront",
        enable: true,
    },

    // Marketplace
    marketplace_sell: {
        id: "marketplace_sell",
        path: "/marketplace/sell",
        exact: true,
        Component: MarketplaceSellPage,
        requireAuth: true,
        requireFaction: true,
        matchLeftDrawerID: "marketplace",
        enable: !STAGING_OR_DEV_ONLY,
    },
    marketplace_item: {
        id: "marketplace_item",
        path: "/marketplace/:type/:id",
        exact: true,
        Component: MarketplaceItemPage,
        requireAuth: true,
        requireFaction: true,
        matchLeftDrawerID: "marketplace",
        enable: !STAGING_OR_DEV_ONLY,
    },
    marketplace: {
        id: "marketplace",
        path: "/marketplace/:type?",
        exact: true,
        Component: MarketplacePage,
        requireAuth: true,
        requireFaction: true,
        leftDrawer: {
            enable: true,
            label: "Marketplace",
        },
        matchLeftDrawerID: "marketplace",
        enable: !STAGING_OR_DEV_ONLY,
    },

    // Player profile
    player_profile: {
        id: "profile",
        path: "/profile/:playerGID",
        exact: true,
        Component: PlayerProfilePage,
        requireAuth: false,
        requireFaction: false,
        enable: true,
    },

    // Jobs
    jobs: {
        id: "jobs",
        path: "/jobs/:type?",
        exact: true,
        Component: JobsPage,
        requireAuth: true,
        requireFaction: true,
        leftDrawer: {
            enable: true,
            label: "Jobs",
        },
        matchLeftDrawerID: "jobs",
        enable: true,
    },

    // FIAT related
    billing_history: {
        id: "billing_history",
        path: "/billing-history",
        exact: true,
        Component: BillingHistoryPage,
        requireAuth: true,
        requireFaction: true,
        enable: true,
    },

    // Others
    claim: {
        id: "claim",
        path: "/claim",
        exact: true,
        Component: ClaimPage,
        requireAuth: true,
        authTitle: "Connect to XSYN to Claim Your Rewards",
        authDescription:
            "You will receive assets that are of Supremacy's next generation collection: Supremacy Nexus, which will allow you to equip your war machines to defeat your enemies in the battle arena.",
        requireFaction: true,
        enable: true,
    },

    not_found_page: {
        id: "not_found_page",
        path: "/404",
        exact: false,
        Component: NotFoundPage,
        requireAuth: false,
        requireFaction: false,
        enable: true,
    },
}

export const ROUTES_ARRAY: RouteStruct[] = []
for (const [, value] of Object.entries(ROUTES_MAP)) {
    ROUTES_ARRAY.push(value)
}

/**
 * Right drawer
 */
export enum RightDrawerHashes {
    None = "",
    LiveChat = "#live_chat",
    PlayerList = "#player_list",
}

export interface HashRouteStruct {
    id: string
    hash: string
    Component?: () => JSX.Element
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
    mountAllTime?: boolean
    requireAuth: boolean
}

export const HASH_ROUTES_MAP: { [name: string]: HashRouteStruct } = {
    live_chat: {
        id: "live_chat",
        hash: RightDrawerHashes.LiveChat,
        icon: <SvgChat size="1rem" sx={{ pt: ".3rem" }} />,
        label: "Live Chat",
        Component: LiveChat,
        requireAuth: false,
        mountAllTime: true,
    },
    active_players: {
        id: "active_players",
        hash: RightDrawerHashes.PlayerList,
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        label: "Active Players",
        Component: PlayerList,
        requireAuth: true,
        mountAllTime: false,
    },
}

export const HASH_ROUTES_ARRAY: HashRouteStruct[] = []
for (const [, value] of Object.entries(HASH_ROUTES_MAP)) {
    HASH_ROUTES_ARRAY.push(value)
}
