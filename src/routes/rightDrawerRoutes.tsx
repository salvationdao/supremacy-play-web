import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { MyLobbies } from "../components/RightDrawer/MyLobbies/MyLobbies"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"
import { RepairJobs } from "../components/RightDrawer/RepairJobs/RepairJobs"
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
    isDrawerOpen: boolean
    onClose: () => void
}

type HeaderComponent = (props: HeaderProps) => JSX.Element

export interface SideRouteSingle {
    id: LeftRouteID | RightRouteID
    Component?: () => JSX.Element | null
    Header?: HeaderComponent
    label: string // Deprecated
    matchRouteIDs?: RouteSingleID[] // Leave undefined to have the tab available on all pages, else specify the routes
    mountAllTime: boolean // Whether to keep component mounted even not on the tab
    requireAuth: boolean
}

export const RightRoutes: SideRouteSingle[] = [
    {
        id: RightRouteID.LiveChat,
        label: "Live Chat",
        Component: LiveChat,
        Header: LiveChat.Header,
        requireAuth: false,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: RightRouteID.ActivePlayers,
        label: "Active Players",
        Component: PlayerList,
        Header: PlayerList.Header,
        requireAuth: false,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: RightRouteID.Repairs,
        label: "Repairs Jobs",
        Component: RepairJobs,
        Header: RepairJobs.Header,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: RightRouteID.MyLobbies,
        label: "Lobbies",
        Component: MyLobbies,
        Header: MyLobbies.Header,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
]
