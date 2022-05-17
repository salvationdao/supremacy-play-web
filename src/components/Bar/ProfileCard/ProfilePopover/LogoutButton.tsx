import { useState, useCallback } from "react"
import { useEffect } from "react"
import { SvgLogout } from "../../../../assets"
import { PASSPORT_SERVER_HOST } from "../../../../constants"
import { useAuth } from "../../../../containers/auth"
import { colors } from "../../../../theme/theme"
import { NavButton } from "./NavButton"
import { useQuery } from "react-fetching-library"

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

    const { query: passportLogout } = useQuery(
        {
            method: "GET",
            endpoint: `${window.location.protocol}//${PASSPORT_SERVER_HOST}/api/auth/logout`,
            responseType: "json",
            credentials: "include",
        },
        false,
    )

    const onClick = useCallback(async () => {
        await passportLogout()
        await gameserverLogout()

        window.location.reload()
    }, [passportLogout, gameserverLogout])

    if (!userID) return null

    return (
        <NavButton
            onClick={onClick}
            startIcon={<SvgLogout sx={{ pb: ".5rem" }} size="1.6rem" />}
            sx={{
                ":hover": {
                    backgroundColor: colors.red,
                },
            }}
        >
            Logout
        </NavButton>
    )
}
