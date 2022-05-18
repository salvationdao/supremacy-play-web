import { BattleArenaPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"
import { SvgChat, SvgRobot } from "../assets"
import { Box } from "@mui/system"
import { colors } from "../theme/theme"

export enum RightDrawerHashes {
    None = "#none",
    LiveChat = "#live_chat",
    PlayerList = "#player_list",
    Assets = "#assets",
    Socials = "#socials",
}

interface RouteStruct {
    id: string
    path: string
    exact: boolean
    Component?: () => JSX.Element
    showInLeftDrawer?: boolean
    enable?: boolean
    label: string
}

export const ROUTES_MAP: { [name: string]: RouteStruct } = {
    home: {
        id: "home",
        path: "/",
        exact: true,
        Component: BattleArenaPage,
        showInLeftDrawer: true,
        enable: true,
        label: "Battle Arena",
    },
    hangar: {
        id: "hangar",
        path: "/hangar",
        exact: true,
        Component: HangarPage,
        showInLeftDrawer: true,
        enable: true,
        label: "Hangar",
    },
    marketplace: {
        id: "marketplace",
        path: "/marketplace",
        exact: true,
        Component: MarketplacePage,
        showInLeftDrawer: true,
        enable: true,
        label: "Marketplace",
    },
    contracts: {
        id: "contracts",
        path: "/contracts",
        exact: true,
        Component: undefined,
        showInLeftDrawer: true,
        enable: false,
        label: "Contracts",
    },
    not_found_page: {
        id: "not_found_page",
        path: "/404",
        exact: false,
        Component: NotFoundPage,
        showInLeftDrawer: false,
        enable: false,
        label: "",
    },
}

//specifically used for right drawer navigation
interface HashRouteStruct {
    id: string
    hash: string
    exact: boolean
    Component?: () => JSX.Element
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    enable?: boolean
    label: string
}

const HASH_ROUTES_MAP: { [name: string]: HashRouteStruct } = {
    war_room: {
        id: "war_room",
        hash: RightDrawerHashes.LiveChat,
        exact: false,
        icon: <SvgChat size="1rem" sx={{ pt: ".3rem" }} />,
        enable: true,
        label: "War Room",
    },
    active_players: {
        id: "active_players",
        hash: RightDrawerHashes.PlayerList,
        exact: false,
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        enable: true,
        label: "Active Players",
    },
    war_machines: {
        id: "war_machines",
        hash: RightDrawerHashes.Assets,
        exact: false,
        icon: <SvgRobot size="1.3rem" />,
        enable: true,
        label: "War Machines",
    },
    socials: {
        id: "socials",
        hash: RightDrawerHashes.Socials,
        exact: false,
        enable: true,
        label: "Socials",
        icon: "",
    },
}

export const ROUTES_ARRAY: RouteStruct[] = []
for (const [, value] of Object.entries(ROUTES_MAP)) {
    ROUTES_ARRAY.push(value)
}

export const QUERIES_ARRAY: HashRouteStruct[] = []
for (const [, value] of Object.entries(HASH_ROUTES_MAP)) {
    QUERIES_ARRAY.push(value)
}
