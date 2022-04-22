import { Redirect, Route, Switch } from "react-router-dom"
import { BattleArenaPage, HangerPage, MarketplacePage, NotFoundPage } from "../pages"

export enum RoutePaths {
    BattleArena = "/",
    Hanger = "/hanger",
    Marketplace = "/marketplace",
    Contracts = "/contracts",
    NotFound = "/404",
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
            <Route exact path={RoutePaths.Hanger}>
                <HangerPage />
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
