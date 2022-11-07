import { Routes, RouteSingleID } from "../routes"
import { useRouteMatch } from "react-router-dom"

// Returns the routeID that the page is currently on
export const useActiveRouteID = (): RouteSingleID => {
    const match = useRouteMatch(Routes.filter((route) => route.path !== "/").map((route) => route.path))

    let activeRouteID = RouteSingleID.Home

    if (match) {
        const route = Routes.find((route) => route.path === match.path)
        if (route) activeRouteID = route?.id
    }

    return activeRouteID
}
