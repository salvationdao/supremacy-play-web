import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../.."
import { useSnackbar } from "../../../containers"
import { useGameServerCommandsFaction, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"

interface BattleAbilityTextTopProps {
    label: string
    image_url: string
    colour: string
    disableButton: boolean
}

export const BattleAbilityTextTop = ({ label, image_url, colour, disableButton }: BattleAbilityTextTopProps) => {
    const [isOptedIn, setIsOptedIn] = useState(true)

    useGameServerSubscriptionUser<boolean | undefined>(
        {
            URI: `/battle_ability/check_opt_in`,
            key: GameServerKeys.SubBattleAbilityOptInCheck,
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
            <OptInButton disable={disableButton || isOptedIn} />
        </Stack>
    )
}

const OptInButton = ({ disable }: { disable: boolean }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const onTrigger = useCallback(async () => {
        try {
            if (disable) return
            await send(GameServerKeys.OptInBattleAbility)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to opt in battle ability."
            newSnackbarMessage(message, "error")
            console.error(message)
        }
    }, [disable, newSnackbarMessage, send])

    return (
        <FancyButton
            disabled={disable}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colors.green,
                border: { isFancy: true, borderColor: colors.green },
                sx: { position: "relative" },
            }}
            sx={{ px: "3rem", pt: ".4rem", pb: ".5rem", minWidth: "7rem", color: "#FFFFFF" }}
            onClick={onTrigger}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        color: "#FFFFFF",
                    }}
                >
                    OPT IN
                </Typography>
            </Stack>
        </FancyButton>
    )
}
