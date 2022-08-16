import { Box } from "@mui/system"
import { SvgChat, SvgDamage1, SvgHistoryClock, SvgRepair } from "../assets"
import { BattleArena } from "../components/LeftDrawer/BattleArena/BattleArena"
import { BattleEndScreen } from "../components/LeftDrawer/BattleEndScreen/BattleEndScreen"
import { PlayerProfilePage } from "../components/PublicProfile/PlayerProfile"
import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"
import { RepairJobs } from "../components/RightDrawer/RepairJobs/RepairJobs"
import { BATTLE_ARENA_OPEN, IS_TESTING_MODE } from "../constants"
import { BattleArenaPage, BillingHistoryPage, ClaimPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"
import { LeaderboardPage } from "../pages/LeaderboardPage"
import { MarketplaceItemPage } from "../pages/MarketplaceItemPage"
import { MarketplaceSellPage } from "../pages/MarketplaceSellPage"
import { MechPage } from "../pages/MechPage"
import { StorefrontPage } from "../pages/StorefrontPage"
import { WeaponPage } from "../pages/WeaponPage"
import { colors } from "../theme/theme"

// ************
// ** ROUTES **
// ************
interface RouteStruct {
    id: string
    path: string
    exact: boolean
    Component?: () => JSX.Element | null
    requireAuth: boolean
    authTitle?: string // If omitted, it'll have a default title
    authDescription?: string // If omitted, it'll have a default description
    requireFaction: boolean
    navLink?: {
        enable: boolean
        label: string
    }
    matchNavLinkID?: string // The /route which will make this button highlighted
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
        navLink: {
            enable: BATTLE_ARENA_OPEN,
            label: "Battle Arena",
        },
        matchNavLinkID: "home",
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
        navLink: {
            enable: true,
            label: "Leaderboard",
        },
        matchNavLinkID: "leaderboard",
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
        matchNavLinkID: "fleet",
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
        matchNavLinkID: "fleet",
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
        navLink: {
            enable: true,
            label: "fleet",
        },
        matchNavLinkID: "fleet",
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
        navLink: {
            enable: true,
            label: "Storefront",
        },
        matchNavLinkID: "storefront",
        enable: !IS_TESTING_MODE,
    },

    // Marketplace
    marketplace_sell: {
        id: "marketplace_sell",
        path: "/marketplace/sell",
        exact: true,
        Component: MarketplaceSellPage,
        requireAuth: true,
        requireFaction: true,
        matchNavLinkID: "marketplace",
        enable: !IS_TESTING_MODE,
    },
    marketplace_item: {
        id: "marketplace_item",
        path: "/marketplace/:type/:id",
        exact: true,
        Component: MarketplaceItemPage,
        requireAuth: true,
        requireFaction: true,
        matchNavLinkID: "marketplace",
        enable: !IS_TESTING_MODE,
    },
    marketplace: {
        id: "marketplace",
        path: "/marketplace/:type?",
        exact: true,
        Component: MarketplacePage,
        requireAuth: true,
        requireFaction: true,
        navLink: {
            enable: true,
            label: "Marketplace",
        },
        matchNavLinkID: "marketplace",
        enable: !IS_TESTING_MODE,
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

// *****************
// ** LEFT DRAWER **
// *****************
export interface SideTabsStruct {
    id: string
    Component?: () => JSX.Element | null
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
    matchNavLinkID?: string // Leave blank to have the tab available on all pages, else specify the route
    mountAllTime: boolean // Whether to keep component mounted even not on the tab
    requireAuth: boolean
}

export const LEFT_DRAWER_MAP: { [name: string]: SideTabsStruct } = {
    battle_arena: {
        id: "battle_arena",
        icon: <SvgDamage1 size="1.2rem" sx={{ pt: ".3rem" }} />,
        label: "Battle Commands",
        Component: BattleArena,
        requireAuth: false,
        matchNavLinkID: "home",
        mountAllTime: true,
    },
    previous_battle: {
        id: "previous_battle",
        icon: <SvgHistoryClock size="1.4rem" sx={{ pt: ".3rem" }} />,
        label: "Previous Battle",
        Component: BattleEndScreen,
        requireAuth: false,
        matchNavLinkID: "home",
        mountAllTime: true,
    },
}

export const LEFT_DRAWER_ARRAY: SideTabsStruct[] = []
for (const [, value] of Object.entries(LEFT_DRAWER_MAP)) {
    LEFT_DRAWER_ARRAY.push(value)
}

// ******************
// ** RIGHT DRAWER **
// ******************
export const RIGHT_DRAWER_MAP: { [name: string]: SideTabsStruct } = {
    live_chat: {
        id: "live_chat",
        icon: <SvgChat size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Live Chat",
        Component: LiveChat,
        requireAuth: false,
        mountAllTime: true,
    },
    active_players: {
        id: "active_players",
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".9rem", height: ".9rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        label: "Active Players",
        Component: PlayerList,
        requireAuth: true,
        mountAllTime: false,
    },
    repairs: {
        id: "repairs",
        icon: <SvgRepair size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Repairs",
        Component: RepairJobs,
        requireAuth: true,
        mountAllTime: false,
    },
}

export const RIGHT_DRAWER_ARRAY: SideTabsStruct[] = []
for (const [, value] of Object.entries(RIGHT_DRAWER_MAP)) {
    RIGHT_DRAWER_ARRAY.push(value)
}
