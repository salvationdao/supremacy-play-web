import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useState } from "react"
import { TooltipHelper } from ".."
import { SvgChest, SvgGoldBars, SvgSupToken } from "../../assets"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"

export const SpoilOfWarAmount = () => {
    const [nextSpoilOfWarAmount, setNextSpoilOfWarAmount] = useState<string>("0")
    const [spoilOfWarAmount, setSpoilOfWarAmount] = useState<string>("0")

    useGameServerSubscription<string[] | undefined>(
        {
            URI: "/public/live_data",
            key: GameServerKeys.SubSpoilsOfWar,
        },
        (payload) => {
            if (!payload || payload.length === 0) return
            setNextSpoilOfWarAmount(new BigNumber(payload[0]).dividedBy("1000000000000000000").toFixed(0))
            if (payload.length > 1) {
                setSpoilOfWarAmount(new BigNumber(payload[1]).dividedBy("1000000000000000000").toFixed(0))
            }
        },
    )

    return <SpoilOfWarAmountInner spoilOfWarAmount={spoilOfWarAmount} nextSpoilOfWarAmount={nextSpoilOfWarAmount} />
}

const SpoilOfWarAmountInner = ({ spoilOfWarAmount, nextSpoilOfWarAmount }: { spoilOfWarAmount: string; nextSpoilOfWarAmount: string }) => {
    return (
        <>
            <TooltipHelper text="This is the spoils of war accumulated in the current battle.">
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <SvgGoldBars size="1.6rem" fill="#FFFFFF" sx={{ mr: ".3rem" }} />
                    <SvgSupToken size="1.4rem" fill={colors.yellow} />
                    <Typography variant="body2" sx={{ color: colors.yellow }}>
                        {nextSpoilOfWarAmount == "0" ? "---" : nextSpoilOfWarAmount}
                    </Typography>
                </Stack>
            </TooltipHelper>

            <TooltipHelper text="This is the spoils of war from previous battles, it is distributed to players with multipliers.">
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <SvgChest size="1.5rem" fill="#FFFFFF" sx={{ mr: ".3rem" }} />
                    <SvgSupToken size="1.4rem" fill={colors.yellow} />
                    <Typography variant="body2" sx={{ color: colors.yellow }}>
                        {spoilOfWarAmount == "0" ? "---" : spoilOfWarAmount}
                    </Typography>
                </Stack>
            </TooltipHelper>
        </>
    )
}
