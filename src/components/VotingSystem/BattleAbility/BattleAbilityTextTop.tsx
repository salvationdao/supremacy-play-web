import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton, TooltipHelper } from "../.."
import { useGameServerCommandsFaction, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"

interface BattleAbilityTextTopProps {
    label: string
    description: string
    image_url: string
    colour: string
    showButton: boolean
}

export const BattleAbilityTextTop = ({ label, description, image_url, colour, showButton }: BattleAbilityTextTopProps) => {
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
            <TooltipHelper placement="right" text={description}>
                <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
                    <Box
                        sx={{
                            height: "1.9rem",
                            width: "1.9rem",
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
                        sx={{
                            lineHeight: 1,
                            fontWeight: "fontWeightBold",
                            fontFamily: fonts.nostromoBold,
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
            </TooltipHelper>
            {showButton && <OptInButton isOptedIn={isOptedIn} />}
        </Stack>
    )
}

interface OptInButtonProps {
    colour?: string
    text_colour?: string
    isOptedIn: boolean
}

const OptInButton = ({ isOptedIn, colour, text_colour }: OptInButtonProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const onTrigger = useCallback(async () => {
        try {
            if (isOptedIn) return
            await send(GameServerKeys.OptInBattleAbility)
        } catch (e) {
            console.error(e)
        }
    }, [isOptedIn, send])

    return (
        <FancyButton
            disabled={isOptedIn}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colour || "#14182B",
                border: { isFancy: true, borderColor: colour || "#14182B" },
                sx: { position: "relative" },
            }}
            sx={{ px: "1.2rem", pt: ".4rem", pb: ".5rem", minWidth: "7rem" }}
            onClick={onTrigger}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        color: text_colour || "#FFFFFF",
                    }}
                >
                    {isOptedIn ? `CLAIMED` : `OPT IN`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
