import { Stack, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useGameServerAuth, useGameServerWebsocket, useSupremacy } from "../../../../containers"
import { useToggle } from "../../../../hooks"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleMultipliers, MultiplierUpdateResp, User } from "../../../../types"
import { MultipliersPopover } from "./MultiplierPopover"

export const MultipliersInfo = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { battleIdentifier } = useSupremacy()
    // Multipliers
    const [multipliers, setMultipliers] = useState<BattleMultipliers[]>([])
    const [currentBattleMultiplier, setCurrentBattleMultiplier] = useState(0)

    // Subscribe to multipliers
    useEffect(() => {
        ;(async () => {
            try {
                if (state !== WebSocket.OPEN || !subscribe || !user) return
                return subscribe<MultiplierUpdateResp>(GameServerKeys.SubscribeSupsMultiplier, (payload) => {
                    if (!payload) return
                    const battles = payload.battles
                    const sorted = battles.sort((a, b) => (a.battle_number < b.battle_number ? 1 : -1))
                    setMultipliers(sorted)
                })
            } catch (e) {
                console.error(e)
            }
        })()
    }, [state, subscribe, user])

    // Current battle multiplier should say update to 0 if battleID was in the payload
    useEffect(() => {
        if (!multipliers || multipliers.length <= 0) return
        const currentMulti = multipliers.filter((m) => m.battle_number === battleIdentifier || m.battle_number === (battleIdentifier || 0) - 1)
        setCurrentBattleMultiplier(currentMulti.length > 0 ? currentMulti[0].total_multipliers : 0)
    }, [multipliers, battleIdentifier])

    return <MultipliersInfoInner currentBattleMultiplier={currentBattleMultiplier} user={user} multipliers={multipliers} />
}

const MultipliersInfoInner = ({
    currentBattleMultiplier,
    user,
    multipliers,
}: {
    currentBattleMultiplier: number
    user?: User
    multipliers: BattleMultipliers[]
}) => {
    const multipliersPopoverRef = useRef(null)
    const [isMultipliersPopoverOpen, toggleIsMultipliersPopoverOpen] = useToggle()

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                ref={multipliersPopoverRef}
                onClick={() => toggleIsMultipliersPopoverOpen()}
                sx={{
                    px: ".7rem",
                    py: ".6rem",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: isMultipliersPopoverOpen ? "#FFFFFF12" : "unset",
                    ":hover": {
                        backgroundColor: "#FFFFFF12",
                    },
                    ":active": {
                        opacity: 0.8,
                    },
                }}
            >
                <Typography
                    key={`current-multi-key-${currentBattleMultiplier}`}
                    variant="caption"
                    sx={{
                        px: ".8rem",
                        pt: ".4rem",
                        pb: ".24rem",
                        textAlign: "center",
                        lineHeight: 1,
                        fontFamily: "Nostromo Regular Bold",
                        border: `${colors.orange} 1px solid`,
                        color: colors.orange,
                        borderRadius: 0.6,
                    }}
                >
                    {currentBattleMultiplier}x
                </Typography>
            </Stack>

            {isMultipliersPopoverOpen && user && (
                <MultipliersPopover
                    open={isMultipliersPopoverOpen}
                    multipliers={multipliers}
                    onClose={() => toggleIsMultipliersPopoverOpen(false)}
                    popoverRef={multipliersPopoverRef}
                />
            )}
        </>
    )
}
