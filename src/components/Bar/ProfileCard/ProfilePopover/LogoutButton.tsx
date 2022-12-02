import { useCallback } from "react"
import { useQuery } from "react-fetching-library"
import { SvgLogout } from "../../../../assets"
import { useAuth } from "../../../../containers/auth"
import { NavButton } from "./NavButton"

export const LogoutButton = () => {
    const { userID } = useAuth()
    const { query: gameserverLogout } = useQuery(
        {
            method: "GET",
            endpoint: `/auth/logout`,
            responseType: "json",
            credentials: "include",
        },
        false,
    )

    const onClick = useCallback(async () => {
        await gameserverLogout()
        window.location.reload()
    }, [gameserverLogout])

    if (!userID) return null

    return <NavButton onClick={onClick} startIcon={<SvgLogout inline sx={{ pb: ".5rem" }} size="1.6rem" />} text="Logout" />
}
