import { Route, Switch } from "react-router-dom"
import { BattleArenaPage } from "../pages/BattleArena"
import { HangerPage } from "../pages/Hanger"
import { MarketplacePage } from "../pages/Marketplace"

export enum RoutePaths {
    BattleArena = "/",
    Hanger = "/hanger",
    Marketplace = "/marketplace",
    Contracts = "/contracts",
}
export enum TabLabels {
    BattleArena = "Battle Arena",
    Hanger = "Hanger",
    Marketplace = "Marketplace",
    Contracts = "Contracts",
}

export const Routes: React.FC = () => {
    return (
        <Switch>
            <Route path={RoutePaths.Hanger}>
                <HangerPage />
            </Route>
            <Route path={RoutePaths.Marketplace}>
                <MarketplacePage />
            </Route>
            <Route path={RoutePaths.BattleArena}>
                <BattleArenaPage />
            </Route>
        </Switch>
    )
}
