import { Redirect, Route, Switch } from "react-router-dom"
import { BattleArenaPage, HangarPage, MarketplacePage, NotFoundPage } from "../pages"

export enum RoutePaths {
    BattleArena = "/",
    hangar = "/hangar",
    Marketplace = "/marketplace",
    Contracts = "/contracts",
    NotFound = "/404",
}
export enum TabLabels {
    BattleArena = "Battle Arena",
    hangar = "hangar",
    Marketplace = "Marketplace",
    Contracts = "Contracts",
}

export const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path={RoutePaths.hangar}>
                <HangarPage />
            </Route>
            <Route exact path={RoutePaths.Marketplace}>
                <MarketplacePage />
            </Route>
            <Route exact path={RoutePaths.BattleArena}>
                <BattleArenaPage />
            </Route>
            <Route path="/404" component={NotFoundPage} />
            <Redirect to={RoutePaths.NotFound} />
        </Switch>
    )
}
