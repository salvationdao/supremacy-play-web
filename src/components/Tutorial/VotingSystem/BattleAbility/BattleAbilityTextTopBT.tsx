import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { FancyButton } from "../../.."
import { useTraining } from "../../../../containers"
import { zoomEffect } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { BattleAbilityStages } from "../../../../types"

interface BattleAbilityTextTopProps {
    label: string
    image_url: string
    colour: string
    disableButton: boolean
}

export const BattleAbilityTextTopBT = ({ label, image_url, colour, disableButton }: BattleAbilityTextTopProps) => {
    const [isOptedIn, setIsOptedIn] = useState(false)
    const { trainingStage } = useTraining()

    useEffect(() => {
        if (trainingStage === BattleAbilityStages.OptedIn) {
            setIsOptedIn(true)
        }
    }, [trainingStage])

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
            <OptInButton disable={disableButton} isOptedIn={isOptedIn} />
        </Stack>
    )
}

const OptInButton = ({ isOptedIn }: { disable: boolean; isOptedIn: boolean }) => {
    const { trainingStage, setTrainingStage, bribeStage } = useTraining()

    const onTrigger = useCallback(async () => {
        if (trainingStage !== BattleAbilityStages.OptIn) {
            return
        }
        setTrainingStage(BattleAbilityStages.OptedIn)
    }, [setTrainingStage, trainingStage])

    return (
        <FancyButton
            disabled={isOptedIn || (bribeStage && bribeStage.phase !== "OPT_IN")}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colors.green,
                border: { isFancy: true, borderColor: colors.green },
                sx: {
                    position: "relative",
                    animation: trainingStage === BattleAbilityStages.OptIn ? `${zoomEffect(1.2)} 1.5s infinite` : "unset",
                },
            }}
            sx={{
                px: "3rem",
                pt: ".4rem",
                pb: ".5rem",
                minWidth: "7rem",
                color: "#FFFFFF",
            }}
            onClick={onTrigger}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        letterSpacing: ".6px",
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        color: "#FFFFFF",
                    }}
                >
                    {isOptedIn ? "OPTED IN" : "OPT IN"}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
