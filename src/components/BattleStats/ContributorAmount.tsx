import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TooltipHelper } from ".."
import { MultiplierContributor, SvgGraph } from "../../assets"
import { useGame } from "../../containers"
import { useDebounce } from "../../hooks"
import { useGameServerSubscriptionUser, useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export interface ContributorAmountProps {
    hideContributionTotal?: boolean
    hideContributorAmount?: boolean
}

export const ContributorAmount = (props: ContributorAmountProps) => {
    const { battleEndDetail } = useGame()
    const [contributor, setContributor] = useDebounce(0, 350)
    const [rate, setRate] = useState(0)

    useGameServerSubscriptionUser<string>(
        {
            URI: "",
            key: GameServerKeys.ListenContributorMulti,
        },
        (payload) => {
            if (!payload) return
            setContributor((prev) => prev + parseFloat(payload))
        },
    )

    useGameServerSubscription<string>(
        {
            URI: "/public/live_data",
            key: GameServerKeys.ListenContributorRate,
        },
        (payload) => {
            if (!payload) return
            setRate(parseFloat(payload))
        },
    )

    // When battle ends, clear the contributor number
    useEffect(() => {
        setContributor(0)
    }, [battleEndDetail, setContributor])

    return <ContributorAmountInner rate={rate} contributor={contributor} {...props} />
}

interface InnerProps extends ContributorAmountProps {
    contributor: number
    rate: number
}

const ContributorAmountInner = ({ rate, contributor, hideContributionTotal, hideContributorAmount }: InnerProps) => {
    return (
        <>
            {!hideContributionTotal && (
                <TooltipHelper text="This contribution multiplier is applied at the end of the current battle if your faction is victorious.">
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
            )}

            {!hideContributorAmount && (
                <TooltipHelper text="Extra contributor multiplier applied at the end of the battle if you contribute now.">
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <SvgGraph size="1.5rem" fill="#FFFFFF" sx={{ mr: ".3rem" }} />
                        <Typography variant="body2" sx={{ color: colors.yellow }}>
                            {rate.toFixed(2)}x
                        </Typography>
                    </Stack>
                </TooltipHelper>
            )}
        </>
    )
}
