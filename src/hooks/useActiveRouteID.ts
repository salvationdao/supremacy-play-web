import { useRouteMatch } from "react-router-dom"
import { Routes, RouteSingle } from "../routes"

// Returns the routeID that the page is currently on
export const useActiveRouteID = (): RouteSingle | undefined => {
    const match = useRouteMatch(Routes.filter((route) => route.path !== "/").map((route) => route.path))

    let activeRoute: RouteSingle | undefined = Routes[0]

    if (match) {
        const route = Routes.find((route) => route.path === match.path)
        activeRoute = route
    }

    return activeRoute
}
