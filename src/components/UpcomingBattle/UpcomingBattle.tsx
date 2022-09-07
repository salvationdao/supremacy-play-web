import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useDimension, useSupremacy } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { GameMap } from "../../types"
import { MechCard } from "./MechCard"

interface NextBattle {
    map: GameMap
    bc_id: string
    zhi_id: string
    rm_id: string
    bc_mech_ids: string[]
    zhi_mech_ids: string[]
    rm_mech_ids: string[]
}

export const UpcomingBattle = () => {
    const [nextBattle, setNextBattle] = useState<NextBattle | undefined>()
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

    // Subscribe on battle end information
    useGameServerSubscription<NextBattle>(
        {
            URI: `/public/arena/upcomming_battle`,
            key: GameServerKeys.NextBattleDetails,
        },
        (payload) => {
            if (!payload) return
            setNextBattle(payload)
        },
    )

    const content = useMemo(() => {
        if (!nextBattle) {
            return (
                <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                    <CircularProgress size="3rem" sx={{ color: "#FFFFFF" }} />
                </Stack>
            )
        }

        return (
            <>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(3, ${size})`,
                        gridTemplateRows: `repeat(3, ${size})`,
                        columnGap: "1rem",
                        rowGap: "5.8rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CardGroup mechIDs={nextBattle?.bc_mech_ids || []} factionID={nextBattle?.bc_id || ""} />
                    <CardGroup mechIDs={nextBattle?.zhi_mech_ids || []} factionID={nextBattle?.zhi_id || ""} />
                    <CardGroup mechIDs={nextBattle?.rm_mech_ids || []} factionID={nextBattle?.rm_id || ""} />
                </Box>
                <img style={{ height: "9rem" }} src={nextBattle?.map?.logo_url} alt={`Upcoming battle on map: ${nextBattle?.map?.name}`} />
            </>
        )
    }, [size, nextBattle])

    return (
        <Stack
            spacing={spacing}
            alignItems="center"
            justifyContent="center"
            sx={{
                height: "100%",
                width: "100%",
                backgroundColor: colors.darkNavy,
                backgroundImage: `url(${nextBattle?.map?.background_url})`,
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

const CardGroup = ({ factionID, mechIDs }: { factionID: string; mechIDs: string[] }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(factionID)

    return (
        <>
            <MechCard mechID={mechIDs[0] || ""} faction={faction} />
            <MechCard mechID={mechIDs[1] || ""} faction={faction} />
            <MechCard mechID={mechIDs[2] || ""} faction={faction} />
        </>
    )
}
