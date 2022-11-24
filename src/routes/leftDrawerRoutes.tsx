import { BattleArena } from "../components/LeftDrawer/BattleArena/BattleArena"
import { BattleEndScreen } from "../components/LeftDrawer/BattleEndScreen/BattleEndScreen"
import { BATTLE_ARENA_OPEN } from "../constants"
import { SideRouteSingle } from "./rightDrawerRoutes"
import { RouteSingleID } from "./routes"

export enum LeftRouteID {
    BattleArena = "BATTLE_ARENA",
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
        id: LeftRouteID.PreviousBattle,
        label: "Previous Battle",
        Component: BattleEndScreen,
        Header: BattleEndScreen.Header,
        requireAuth: false,
        matchRouteIDs: BATTLE_ARENA_OPEN ? [RouteSingleID.Home] : [],
        mountAllTime: true,
    },
]

// LeftRoutes.find((route) => route.id === LeftRouteID.LiveChat)
// RightRoutes.find((route) => route.id === RightRouteID.LiveChat)
