import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { SlantedBar, WIDTH_PER_SLANTED_BAR, WIDTH_PER_SLANTED_BAR_ACTUAL } from ".."
import { NullUUID } from "../../constants"
import { useAuth, useWebsocket } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"
import { GameAbility, GameAbilityTargetPrice } from "../../types"

export const SkillBar = ({
    index,
    gameAbility,
    maxAbilityPriceMap,
}: {
    index: number
    gameAbility: GameAbility
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
}) => {
    const { factionID } = useAuth()
    const { state, subscribeAbilityNetMessage } = useWebsocket()

    const { identity } = gameAbility
    const [supsCost, setSupsCost] = useState(new BigNumber("0"))
    const [currentSups, setCurrentSups] = useState(new BigNumber("0"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber("0"))

    const [gameAbilityTargetPrice, setGameAbilityTargetPrice] = useState<GameAbilityTargetPrice>()

    const progressPercent = initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100
    const costPercent = initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100

    // Listen on current faction ability price change
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !factionID || factionID === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityTargetPrice | undefined>(identity, (payload) => {
            if (!payload) return
            setGameAbilityTargetPrice(payload)
        })
    }, [identity, state, subscribeAbilityNetMessage, factionID])

    useEffect(() => {
        if (!gameAbilityTargetPrice) return
        const currentSups = new BigNumber(gameAbilityTargetPrice.currentSups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityTargetPrice.supsCost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)

        if (gameAbilityTargetPrice.shouldReset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)

            // Cache max price for the popover
            maxAbilityPriceMap.current.set(identity, supsCost)
        }
    }, [gameAbilityTargetPrice])

    return (
        <Box
            key={index}
            sx={{
                position: "absolute",
                bottom: 0,
                right: index * WIDTH_PER_SLANTED_BAR - index * 1,
                width: WIDTH_PER_SLANTED_BAR_ACTUAL,
                height: "100%",
                zIndex: 4,
                pointerEvents: "none",
            }}
        >
            <SlantedBar
                backgroundColor={shadeColor(colors.warMachineSkillBar, 100 - index * 28)}
                progressPercent={progressPercent}
                costPercent={costPercent}
            />
        </Box>
    )
}
