import { SvgDamage1, SvgHistoryClock } from "../assets"
import { BattleArena } from "../components/LeftDrawer/BattleArena/BattleArena"
import { BattleEndScreen } from "../components/LeftDrawer/BattleEndScreen/BattleEndScreen"

import { BATTLE_ARENA_OPEN } from "../constants"

export interface SideTabsStruct {
    id: string
    Component?: () => JSX.Element | null
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
    matchNavLinkIDs?: string[] // Leave undefined to have the tab available on all pages, else specify the routes
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
        matchNavLinkIDs: BATTLE_ARENA_OPEN ? ["home"] : [],
        mountAllTime: true,
    },
    previous_battle: {
        id: "previous_battle",
        icon: <SvgHistoryClock size="1.3rem" sx={{ pt: ".3rem" }} />,
        label: "Previous Battle",
        Component: BattleEndScreen,
        requireAuth: false,
        matchNavLinkIDs: BATTLE_ARENA_OPEN ? ["home"] : [],
        mountAllTime: true,
    },
}

export const LEFT_DRAWER_ARRAY: SideTabsStruct[] = []
for (const [, value] of Object.entries(LEFT_DRAWER_MAP)) {
    LEFT_DRAWER_ARRAY.push(value)
}
