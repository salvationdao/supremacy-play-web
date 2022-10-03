import { CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useDimension } from "../../containers"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"

export const UpcomingBattle = () => {
    const { gameUIDimensions } = useDimension()

    const { spacing } = useMemo(() => {
        // let size = "18rem"
        let spacing = "6rem"

        if (gameUIDimensions.width < 500 || gameUIDimensions.height < 720) {
            // size = "16rem"
            spacing = "4rem"
        }

        return { spacing }
    }, [gameUIDimensions.height, gameUIDimensions.width])

    const content = useMemo(() => {
        // if (!nextBattleLobby) {
        return (
            <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                <CircularProgress size="3rem" sx={{ color: "#FFFFFF" }} />
            </Stack>
        )
    }, [])

    return (
        <Stack
            spacing={spacing}
            alignItems="center"
            justifyContent="center"
            sx={{
                height: "100%",
                width: "100%",
                backgroundColor: colors.darkNavy,
                // backgroundImage: `url(${nextBattleLobby?.game_map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                animation: `${opacityEffect} .2s ease-in`,
            }}
        >
            <Typography variant="h4" sx={{ lineHeight: 1, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                <i>COMING UP...</i>
            </Typography>

            {content}
        </Stack>
    )
}
