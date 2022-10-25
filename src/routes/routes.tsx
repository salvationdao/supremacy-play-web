import { AdminLookupResultPage } from "../components/Admin/Lookup/AdminLookupResultPage"
import { PlayerProfilePage } from "../components/PublicProfile/PlayerProfile"
import { BATTLE_ARENA_OPEN, IS_TESTING_MODE } from "../constants"
import { BattleArenaPage, BillingHistoryItemPage, BillingHistoryPage, ClaimPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"
import { AdminPage } from "../pages/AdminPage"
import { BattleLobbiesPage } from "../pages/BattleLobbiesPage"
import { LeaderboardPage } from "../pages/LeaderboardPage"
import { MarketplaceItemPage } from "../pages/MarketplaceItemPage"
import { MarketplaceSellPage } from "../pages/MarketplaceSellPage"
import { MechPage } from "../pages/MechPage"
import { ReplayItemPage } from "../pages/ReplayItemPage"
import { ReplayPage } from "../pages/ReplayPage"
import { StorefrontPage } from "../pages/StorefrontPage"
import { StorefrontShoppingCartPage } from "../pages/StorefrontShoppingCartPage"
import { WeaponPage } from "../pages/WeaponPage"

interface RouteStruct {
    id: string
    path: string
    exact: boolean
    Component?: () => JSX.Element | null
    requireAuth: boolean
    requireFaction: boolean
    requireModerator?: boolean
    authTitle?: string // If omitted, it'll have a default title
    authDescription?: string // If omitted, it'll have a default description
    navLink?: {
        enable: boolean
        label: string
    }
    matchNavLinkID?: string // The /route which will make this button highlighted
    enable: boolean
    pageTitle: string // Sets the tab title etc. with react helmet
}

export const ROUTES_MAP: { [name: string]: RouteStruct } = {
    home: {
        id: "home",
        path: "/",
        exact: true,
        Component: BattleArenaPage,
        requireAuth: false,
        requireFaction: true,
        navLink: {
            enable: BATTLE_ARENA_OPEN,
            label: "Battle Arena",
        },
        matchNavLinkID: "home",
        enable: true,
        pageTitle: "Supremacy - Battle Arena",
    },

    battle_lobbies: {
        id: "battle_lobbies",
        path: "/battle_lobbies/:status?",
        exact: true,
        Component: BattleLobbiesPage,
        requireAuth: true,
        requireFaction: true,
        navLink: {
            enable: true,
            label: "Battle Lobbies",
        },
        matchNavLinkID: "battle_lobbies",
        enable: true,
        pageTitle: "Supremacy - Battle Lobbies",
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
        pageTitle: "Supremacy - Leaderboard",
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
        pageTitle: "Supremacy - War Machine",
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
        pageTitle: "Supremacy - Weapon",
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
        pageTitle: "Supremacy - Fleet",
    },

    // Storefront
    storefront_shopping_cart: {
        id: "storefront_shopping_cart",
        path: "/storefront/shopping-cart",
        exact: true,
        Component: StorefrontShoppingCartPage,
        requireAuth: true,
        requireFaction: true,
        matchNavLinkID: "storefront",
        enable: !IS_TESTING_MODE,
        pageTitle: "Supremacy - Shopping Cart",
    },
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
        enable: true,
        pageTitle: "Supremacy - Storefront",
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
        pageTitle: "Supremacy - Sell",
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
        pageTitle: "Supremacy - Marketplace Item",
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
        pageTitle: "Supremacy - Marketplace",
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
        pageTitle: "Supremacy - Player Profile",
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
        pageTitle: "Supremacy - Billing",
    },
    billing_history_item: {
        id: "billing_history_item",
        path: "/billing-history/:id",
        exact: true,
        Component: BillingHistoryItemPage,
        requireAuth: true,
        requireFaction: true,
        enable: true,
        pageTitle: "Supremacy - Billing",
    },

    // Replays
    replays_item: {
        id: "replays_item",
        path: "/replay",
        exact: true,
        Component: ReplayItemPage,
        requireAuth: false,
        requireFaction: false,
        matchNavLinkID: "replays",
        enable: true,
        pageTitle: "Supremacy - Replay Item",
    },
    replays: {
        id: "replays",
        path: "/replays/:type?",
        exact: true,
        Component: ReplayPage,
        requireAuth: false,
        requireFaction: false,
        navLink: {
            enable: true,
            label: "Replays",
        },
        matchNavLinkID: "replays",
        enable: BATTLE_ARENA_OPEN,
        pageTitle: "Supremacy - Replays",
    },

    // Admin
    admin: {
        id: "admin",
        path: "/admin/:type?",
        exact: true,
        Component: AdminPage,
        requireAuth: true,
        requireFaction: true,
        requireModerator: true,
        enable: true,
        pageTitle: "Supremacy - Admin Panel",
    },
    admin_player_lookup: {
        id: "admin_player_lookup",
        path: "/admin/lookup/:playerGID",
        exact: true,
        Component: AdminLookupResultPage,
        requireAuth: true,
        requireFaction: true,
        requireModerator: true,
        enable: true,
        pageTitle: "Supremacy - Admin Panel",
    },

    // Claim
    claim: {
        id: "claim",
        path: "/claim",
        exact: true,
        Component: ClaimPage,
        requireAuth: true,
        requireFaction: true,
        authTitle: "Connect to XSYN to Claim Your Rewards",
        authDescription:
            "You will receive assets that are of Supremacy's next generation collection: Supremacy Nexus, which will allow you to equip your war machines to defeat your enemies in the battle arena.",
        enable: true,
        pageTitle: "Supremacy - Claim",
    },

    not_found_page: {
        id: "not_found_page",
        path: "/404",
        exact: false,
        Component: NotFoundPage,
        requireAuth: false,
        requireFaction: false,
        enable: true,
        pageTitle: "Supremacy - 404",
    },
}

export const ROUTES_ARRAY: RouteStruct[] = []
for (const [, value] of Object.entries(ROUTES_MAP)) {
    ROUTES_ARRAY.push(value)
}
