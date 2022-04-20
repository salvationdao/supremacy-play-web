import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TooltipHelper } from ".."
import { SvgGraph, MultiplierContributor } from "../../assets"
import { useGame, useGameServerWebsocket } from "../../containers"
import { useDebounce } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export const ContributorAmount = () => {
    const { battleEndDetail } = useGame()
    const { state, subscribe } = useGameServerWebsocket()
    const [contributor, setContributor] = useDebounce(0, 350)
    const [rate, setRate] = useState(0)

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<string>(
            GameServerKeys.ListenContributorRate,
            (payload) => {
                if (!payload) return
                setRate(parseFloat(payload))
            },
            null,
            true,
        )
    }, [state, subscribe])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<string>(
            GameServerKeys.ListenContributorMulti,
            (payload) => {
                if (!payload) return
                setContributor((prev) => prev + parseFloat(payload))
            },
            null,
            true,
        )
    }, [state, subscribe])

    // When battle ends, clear the contributor number
    useEffect(() => {
        setContributor(0)
    }, [battleEndDetail])

    return (
        <>
            <TooltipHelper text="This contribution multiplier is applied at the end of the current battle if your syndicate is victorious.">
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Box
                        sx={{
                            mr: ".3rem",
                            mb: ".1rem",
                            width: "1.75rem",
                            height: "1.75rem",
                            flexShrink: 0,
                            backgroundImage: `url(${MultiplierContributor})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            borderRadius: 0.8,
                        }}
                    />
                    <Typography
                        key={`contributor-${contributor.toFixed(2)}`}
                        variant="body2"
                        sx={{ color: "#00FF90", animation: `${zoomEffect(1.2)} 300ms ease-out` }}
                    >
                        ({contributor.toFixed(2)}x)
                    </Typography>
                </Stack>
            </TooltipHelper>

            <TooltipHelper text="Extra contributor multiplier applied at the end of the battle if you contribute now.">
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <SvgGraph size="1.5rem" fill="#FFFFFF" sx={{ mr: ".3rem" }} />
                    <Typography variant="body2" sx={{ color: colors.yellow }}>
                        {rate.toFixed(2)}x
                    </Typography>
                </Stack>
            </TooltipHelper>
        </>
    )
}
