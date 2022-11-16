import { Box } from "@mui/system"
import { SvgChat, SvgRepair } from "../assets"
import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"

import { MyLobbies } from "../components/RightDrawer/MyLobbies/MyLobbies"
import { RepairJobs } from "../components/RightDrawer/RepairJobs/RepairJobs"
import { colors } from "../theme/theme"
import { LeftRouteID } from "./leftDrawerRoutes"
import { RouteSingleID } from "./routes"

export enum RightRouteID {
    LiveChat = "LIVE_CHAT",
    ActivePlayers = "ACTIVE_PLAYERS",
    Repairs = "REPAIRS",
    MyLobbies = "MY_LOBBIES",
}

export interface HeaderProps {
    isOpen: boolean
    onClose: () => void
}

type HeaderComponent = (props: HeaderProps) => JSX.Element

export interface SideRouteSingle {
    id: LeftRouteID | RightRouteID
    Component?: () => JSX.Element | null
    Header?: HeaderComponent
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
    matchRouteIDs?: RouteSingleID[] // Leave undefined to have the tab available on all pages, else specify the routes
    mountAllTime: boolean // Whether to keep component mounted even not on the tab
    requireAuth: boolean
}

export const RightRoutes: SideRouteSingle[] = [
    {
        id: RightRouteID.LiveChat,
        icon: <SvgChat size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Live Chat",
        Component: LiveChat,
        Header: LiveChat.Header,
        requireAuth: false,
        matchRouteIDs: undefined,
        mountAllTime: true,
    },
    {
        id: RightRouteID.ActivePlayers,
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".9rem", height: ".9rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        label: "Active Players",
        Component: PlayerList,
        Header: PlayerList.Header,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: RightRouteID.Repairs,
        icon: <SvgRepair size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Repairs Jobs",
        Component: RepairJobs,
        Header: RepairJobs.Header,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: RightRouteID.MyLobbies,
        icon: <SvgRepair size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "My Lobbies",
        Component: MyLobbies,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
]
