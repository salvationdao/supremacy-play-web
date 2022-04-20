import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { TooltipHelper } from ".."
import { SvgChest, SvgGoldBars, SvgSupToken } from "../../assets"
import { useGameServerWebsocket } from "../../containers"
import { colors } from "../../theme/theme"
import { NetMessageType } from "../../types"

export const SpoilOfWarAmount = () => {
    const { state, subscribeNetMessage } = useGameServerWebsocket()
    const [nextSpoilOfWarAmount, setNextSpoilOfWarAmount] = useState<string>("0")
    const [spoilOfWarAmount, setSpoilOfWarAmount] = useState<string>("0")

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string[] | undefined>(NetMessageType.SpoilOfWarTick, (payload) => {
            if (!payload || payload.length === 0) return
            setNextSpoilOfWarAmount(new BigNumber(payload[0]).dividedBy("1000000000000000000").toFixed(0))
            if (payload.length > 1) {
                setSpoilOfWarAmount(new BigNumber(payload[1]).dividedBy("1000000000000000000").toFixed(0))
            }
        })
    }, [state, subscribeNetMessage])

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
