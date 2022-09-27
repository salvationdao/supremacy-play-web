import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useDimension } from "../../containers"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"

export const UpcomingBattle = () => {
    const { gameUIDimensions } = useDimension()

    const { size, spacing } = useMemo(() => {
        let size = "18rem"
        let spacing = "6rem"

        if (gameUIDimensions.width < 500 || gameUIDimensions.height < 720) {
            size = "16rem"
            spacing = "4rem"
        }

        return { size, spacing }
    }, [gameUIDimensions.height, gameUIDimensions.width])

    const content = useMemo(() => {
        // if (!nextBattleLobby) {
        return (
            <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                <CircularProgress size="3rem" sx={{ color: "#FFFFFF" }} />
            </Stack>
        )
        // }

        // return (
        //     <>
        //         <Box
        //             sx={{
        //                 display: "grid",
        //                 gridTemplateColumns: `repeat(3, ${size})`,
        //                 gridTemplateRows: `repeat(3, ${size})`,
        //                 columnGap: "1rem",
        //                 rowGap: "5.8rem",
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //             }}
        //         >
        //             {/* TODO: Display next lobby*/}
        //         </Box>
        //         <img style={{ height: "9rem" }} src={nextBattleLobby.game_map?.logo_url} alt={`Upcoming battle on map: ${nextBattleLobby?.game_map?.name}`} />
        //     </>
        // )
    }, [size])

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
