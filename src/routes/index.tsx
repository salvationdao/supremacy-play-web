import { BattleArenaPage } from "../pages/BattleArena"
import { HangerPage } from "../pages/Hanger"
import { MarketplacePage } from "../pages/Marketplace"
import { PageNotFound } from "../pages/PageNotFound"

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
    hanger: {
        id: "hanger",
        path: "/hanger",
        exact: true,
        Component: HangerPage,
        showInLeftDrawer: true,
        enable: true,
        label: "Hanger",
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
    page_not_found: {
        id: "page_not_found",
        path: "",
        exact: false,
        Component: PageNotFound,
        showInLeftDrawer: false,
        enable: false,
        label: "",
    },
}

export const ROUTES_ARRAY: RouteStruct[] = []
for (const [, value] of Object.entries(ROUTES_MAP)) {
    ROUTES_ARRAY.push(value)
}
