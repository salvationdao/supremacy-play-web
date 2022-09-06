import { Box, Typography } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { LocationSelectType } from "../../../../types"
import { MechMoveCommandAbility } from "../../../WarMachine/WarMachineItem/MoveCommand"

export const CountdownSubmit = () => {
    const { isTargeting, winner, playerAbility, selection } = useMiniMap()
    if (!isTargeting || !selection || (!winner?.game_ability && !playerAbility)) return null
    return <CountdownSubmitInner />
}

const CountdownSubmitInner = React.memo(function CountdownSubmitInner() {
    const { winner, playerAbility, selection, onTargetConfirm } = useMiniMap()
    const { setEndTimeState, totalSecRemain, delay } = useTimer(undefined, 600)

    const isInstant = useMemo(() => {
        if (!winner && playerAbility?.ability) {
            switch (playerAbility.ability.location_select_type) {
                case LocationSelectType.LineSelect:
                case LocationSelectType.LocationSelect:
                case LocationSelectType.MechCommand:
                    return true
            }

            // If is mini mech move
            if (playerAbility.ability.game_client_ability_id === MechMoveCommandAbility.ability.game_client_ability_id) {
                return true
            }
        }
        return false
    }, [playerAbility?.ability, winner])

    const hasSelected = useMemo(() => {
        let selected = !!selection
        const ability = winner?.game_ability || playerAbility?.ability
        if (ability) {
            switch (ability.location_select_type) {
                case LocationSelectType.LineSelect:
                    selected = !!(selection?.startCoords && selection?.endCoords)
                    break
                case LocationSelectType.LocationSelect:
                    selected = !!selection?.startCoords
                    break
                case LocationSelectType.MechSelect:
                    selected = !!selection?.mechHash
                    break
            }
        }
        return selected
    }, [selection, winner?.game_ability, playerAbility?.ability])

    // Count down starts when user has selected a location, then fires if they don't change their mind
    useEffect(() => {
        setEndTimeState((prev) => {
            if (!hasSelected) return undefined
            if (isInstant) return new Date(new Date().getTime())
            if (!prev) return new Date(new Date().getTime() + 3000)
            return prev
        })
    }, [hasSelected, setEndTimeState, isInstant])

    useEffect(() => {
        if (hasSelected && (isInstant || totalSecRemain === 0)) onTargetConfirm()
    }, [hasSelected, totalSecRemain, onTargetConfirm, isInstant])

    if (isInstant || !delay || totalSecRemain < 0) return null

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
                    textTransform: "uppercase",
                }}
            >
                {!(totalSecRemain === 0 && isInstant) && totalSecRemain}
            </Typography>
        </Box>
    )
})