import { Box, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { useMiniMap } from "../../../containers"
import { useTimer } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { LocationSelectType } from "../../../types"

export const CountdownSubmit = () => {
    const { isTargeting, winner, playerAbility, selection, onTargetConfirm } = useMiniMap()
    const { setEndTimeState, totalSecRemain } = useTimer(undefined, 600)

    const hasSelected = useMemo(() => {
        let selected = !!selection
        if (playerAbility) {
            switch (playerAbility.ability.location_select_type) {
                case LocationSelectType.LINE_SELECT:
                    selected = !!(selection?.startCoords && selection?.endCoords)
                    break
                case LocationSelectType.LOCATION_SELECT:
                    selected = !!selection?.startCoords
                    break
                case LocationSelectType.MECH_SELECT:
                    selected = !!selection?.mechHash
                    break
            }
        }
        return selected
    }, [selection, playerAbility])

    // Count down starts when user has selected a location, then fires if they don't change their mind
    useEffect(() => {
        setEndTimeState((prev) => {
            if (!hasSelected) return undefined
            if (!prev) return new Date(new Date().getTime() + 3000)
            return prev
        })
    }, [hasSelected, setEndTimeState])

    useEffect(() => {
        if (hasSelected && totalSecRemain === 0) onTargetConfirm()
    }, [hasSelected, totalSecRemain, onTargetConfirm])

    if (!isTargeting || (!winner?.game_ability && !playerAbility)) return null

    if (totalSecRemain < 0) return null

    return (
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 99,
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: "#D90000",
                    opacity: 0.9,
                    filter: "drop-shadow(0 3px 3px #00000050)",
                }}
            >
                {totalSecRemain}
            </Typography>
        </Box>
    )
}
