import { BattleArenaPage, ClaimPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"
import { SvgChat } from "../assets"
import { Box } from "@mui/system"
import { colors } from "../theme/theme"
import { StorefrontPage } from "../pages/StorefrontPage"
import { MarketplaceItemPage } from "../pages/MarketplaceItemPage"
import { MarketplaceSellPage } from "../pages/MarketplaceSellPage"
import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"

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
    }
    matchLeftDrawerID?: string
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
            enable: true,
            label: "Battle Arena",
        },
        matchLeftDrawerID: "home",
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
    },
    marketplace_item: {
        id: "marketplace_item",
        path: "/marketplace/:type/:id",
        exact: true,
        Component: MarketplaceItemPage,
        requireAuth: true,
        requireFaction: true,
        matchLeftDrawerID: "marketplace",
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
    },

    // Contract
    contracts: {
        id: "contracts",
        path: "/contracts",
        exact: true,
        Component: undefined,
        requireAuth: true,
        requireFaction: true,
        leftDrawer: {
            enable: false,
            label: "Contracts",
        },
        matchLeftDrawerID: "contracts",
    },

    // Others
    claim: {
        id: "claim",
        path: "/claim",
        exact: true,
        Component: ClaimPage,
        requireAuth: true,
        authTitle: "Connect Your Wallet to Claim Your Rewards",
        authDescription:
            "You will receive assets that are of Supremacy's next generation collection: Supremacy Nexus, which will allow you to equip your war machines to defeat your enemies in the battle arena.",
        requireFaction: true,
    },
    not_found_page: {
        id: "not_found_page",
        path: "/404",
        exact: false,
        Component: NotFoundPage,
        requireAuth: false,
        requireFaction: false,
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
    Socials = "#socials",
}

export interface HashRouteStruct {
    id: string
    hash: string
    Component?: () => JSX.Element
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
}

const HASH_ROUTES_MAP: { [name: string]: HashRouteStruct } = {
    live_chat: {
        id: "live_chat",
        hash: RightDrawerHashes.LiveChat,
        icon: <SvgChat size="1rem" sx={{ pt: ".3rem" }} />,
        label: "Live Chat",
        Component: LiveChat,
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
    },
}

export const HASH_ROUTES_ARRAY: HashRouteStruct[] = []
for (const [, value] of Object.entries(HASH_ROUTES_MAP)) {
    HASH_ROUTES_ARRAY.push(value)
}
