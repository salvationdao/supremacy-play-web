import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../.."
import { useGlobalNotifications } from "../../../../containers"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { useArena } from "../../../../containers/arena"
import { BribeStage } from "../../../../types"
import { shake } from "../../../../theme/keyframes"

interface BattleAbilityTextTopProps {
    label: string
    image_url: string
    colour: string
    disableButton: boolean
    phase: BribeStage | undefined
}

export const BattleAbilityTextTop = ({ label, image_url, colour, disableButton, phase }: BattleAbilityTextTopProps) => {
    const [isOptedIn, setIsOptedIn] = useState(false)
    const { currentArenaID } = useArena()

    useGameServerSubscriptionSecuredUser<boolean | undefined>(
        {
            URI: `/arena/${currentArenaID}/battle_ability/check_opt_in`,
            key: GameServerKeys.SubBattleAbilityOptInCheck,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (payload === undefined) return
            setIsOptedIn(payload)
        },
    )

    return (
        <Stack spacing="2.4rem" direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
            <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
                <Box
                    sx={{
                        height: "2.2rem",
                        width: "2.2rem",
                        backgroundImage: `url(${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: colour || "#030409",
                        border: `${colour} 1px solid`,
                        borderRadius: 0.6,
                        mb: ".24rem",
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        lineHeight: 1,
                        fontFamily: fonts.nostromoBlack,
                        color: colour,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "20rem",
                    }}
                >
                    {label}
                </Typography>
            </Stack>
            <Box sx={{ animation: phase === BribeStage.OptIn ? `${shake(1)} 1s 3` : "unset" }}>
                <OptInButton disable={disableButton} isOptedIn={isOptedIn} />
            </Box>
        </Stack>
    )
}

const OptInButton = ({ disable, isOptedIn }: { disable: boolean; isOptedIn: boolean }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { currentArenaID } = useArena()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const disabled = disable || isOptedIn

    const onTrigger = useCallback(async () => {
        try {
            if (disabled) return
            await send(GameServerKeys.OptInBattleAbility, { arena_id: currentArenaID })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to opt in battle ability."
            newSnackbarMessage(message, "error")
            console.error(message)
        }
    }, [disabled, newSnackbarMessage, send, currentArenaID])

    return (
        <FancyButton
            disabled={disabled}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colors.green,
                border: { borderColor: colors.green, borderThickness: "1px" },
                sx: { position: "relative" },
            }}
            sx={{ px: "1rem", pt: 0, pb: ".1rem", minWidth: "7rem", color: "#FFFFFF" }}
            onClick={onTrigger}
        >
            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                {isOptedIn ? "OPTED IN" : "OPT IN"}
            </Typography>
        </FancyButton>
    )
}
