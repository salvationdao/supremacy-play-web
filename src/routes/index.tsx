import { BattleArenaPage, ClaimsPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"
import { SvgChat } from "../assets"
import { Box } from "@mui/system"
import { colors } from "../theme/theme"
import { StorefrontPage } from "../pages/Storefront"
import { MarketplaceItemPage } from "../pages/MarketplaceItemPage"

interface RouteStruct {
    id: string
    path: string
    exact: boolean
    Component?: () => JSX.Element | null
    leftDrawer?: {
        enable: boolean
        label: string
        requireAuth?: boolean
    }
    matchLeftDrawerID?: string
}

export const ROUTES_MAP: { [name: string]: RouteStruct } = {
    home: {
        id: "home",
        path: "/",
        exact: true,
        Component: BattleArenaPage,
        leftDrawer: {
            enable: true,
            label: "Battle Arena",
            requireAuth: false,
        },
        matchLeftDrawerID: "home",
    },
    hangar: {
        id: "hangar",
        path: "/hangar/:type?",
        exact: true,
        Component: HangarPage,
        leftDrawer: {
            enable: true,
            label: "Hangar",
            requireAuth: true,
        },
        matchLeftDrawerID: "hangar",
    },
    storefront: {
        id: "storefront",
        path: "/storefront/:type?",
        exact: true,
        Component: StorefrontPage,
        leftDrawer: {
            enable: true,
            label: "Storefront",
            requireAuth: true,
        },
        matchLeftDrawerID: "storefront",
    },
    marketplace_item: {
        id: "marketplace_item",
        path: "/marketplace/:type/:id",
        exact: true,
        Component: MarketplaceItemPage,
        matchLeftDrawerID: "marketplace",
    },
    marketplace: {
        id: "marketplace",
        path: "/marketplace/:type?",
        exact: true,
        Component: MarketplacePage,
        leftDrawer: {
            enable: true,
            label: "Marketplace",
            requireAuth: true,
        },
        matchLeftDrawerID: "marketplace",
    },
    contracts: {
        id: "contracts",
        path: "/contracts",
        exact: true,
        Component: undefined,
        leftDrawer: {
            enable: false,
            label: "Contracts",
            requireAuth: false,
        },
        matchLeftDrawerID: "contracts",
    },
    claim: {
        id: "claim",
        path: "/claim",
        exact: true,
        Component: ClaimsPage,
    },
    not_found_page: {
        id: "not_found_page",
        path: "/404",
        exact: false,
        Component: NotFoundPage,
    },
}

// Specifically used for right drawer navigation

export enum RightDrawerHashes {
    None = "",
    LiveChat = "#live_chat",
    PlayerList = "#player_list",
    Socials = "#socials",
}

interface HashRouteStruct {
    id: string
    hash: string
    Component?: () => JSX.Element
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    enable: boolean
    label: string
}

const HASH_ROUTES_MAP: { [name: string]: HashRouteStruct } = {
    war_room: {
        id: "war_room",
        hash: RightDrawerHashes.LiveChat,
        icon: <SvgChat size="1rem" sx={{ pt: ".3rem" }} />,
        enable: true,
        label: "War Room",
    },
    active_players: {
        id: "active_players",
        hash: RightDrawerHashes.PlayerList,
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        enable: true,
        label: "Active Players",
    },
    socials: {
        id: "socials",
        hash: RightDrawerHashes.Socials,
        enable: true,
        label: "Socials",
        icon: "",
    },
}

export const ROUTES_ARRAY: RouteStruct[] = []
for (const [, value] of Object.entries(ROUTES_MAP)) {
    ROUTES_ARRAY.push(value)
}

export const HASH_ROUTES_ARRAY: HashRouteStruct[] = []
for (const [, value] of Object.entries(HASH_ROUTES_MAP)) {
    HASH_ROUTES_ARRAY.push(value)
}
