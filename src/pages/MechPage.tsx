import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { useTheme } from "../containers/theme"
import { siteZIndex } from "../theme/theme"

export const MechPage = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const { mechHash } = useParams<{ mechHash: string }>()

    // Make sure we have a mechHash passed in, else redirect to /fleet page
    useEffect(() => {
        if (!mechHash) history.replace(`/fleet${location.hash}`)
    }, [history, location.hash, mechHash])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "190rem" }}>
                <Typography>{mechHash}</Typography>
            </Stack>
        </Stack>
    )
}
