import { BattleArena } from "../components/LeftDrawer/BattleArena/BattleArena"
import { BattleEndScreen } from "../components/LeftDrawer/BattleEndScreen/BattleEndScreen"
import { CentralQueue } from "../components/LeftDrawer/CentralQueue/CentralQueue"
import { BATTLE_ARENA_OPEN } from "../constants"
import { SideRouteSingle } from "./rightDrawerRoutes"
import { RouteSingleID } from "./routes"

export enum LeftRouteID {
    BattleArena = "BATTLE_ARENA",
    CentralQueue = "CENTRAL_QUEUE",
    PreviousBattle = "PREVIOUS_BATTLE",
}

export const LeftRoutes: SideRouteSingle[] = [
    {
        id: LeftRouteID.BattleArena,
        label: "Battle Commands",
        Component: BattleArena,
        Header: BattleArena.Header,
        requireAuth: false,
        matchRouteIDs: BATTLE_ARENA_OPEN ? [RouteSingleID.Home] : [],
        mountAllTime: true,
    },
    {
        id: LeftRouteID.CentralQueue,
        label: "Central Queue",
        Component: CentralQueue,
        Header: CentralQueue.Header,
        requireAuth: false,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    {
        id: LeftRouteID.PreviousBattle,
        label: "Previous Battle",
        Component: BattleEndScreen,
        Header: BattleEndScreen.Header,
        requireAuth: false,
        matchRouteIDs: BATTLE_ARENA_OPEN ? [RouteSingleID.Home] : [],
        mountAllTime: true,
    },
]
