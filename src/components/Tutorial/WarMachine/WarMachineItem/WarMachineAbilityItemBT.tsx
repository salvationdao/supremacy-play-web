import { Box, Fade, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useTraining } from "../../../../containers"
import { shadeColor } from "../../../../helpers"
import { useInterval } from "../../../../hooks"
import { zoomEffect } from "../../../../theme/keyframes"
import { GameAbility, MechAbilityStages } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../../Common/Deprecated/FancyButton"
import { TopTextBT } from "../../VotingSystem/TopTextBT"

export interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    ability_offering_id: string
    percentage: number
}

interface MechAbilityItemProps {
    gameAbility: GameAbility
    clipSlantSize?: string
}

export const WarMachineAbilityItemBT = ({ gameAbility, clipSlantSize }: MechAbilityItemProps) => {
    const { label, colour, image_url, description } = gameAbility

    const backgroundColor = useMemo(() => shadeColor(colour, -75), [colour])

    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        clipSlantSize={clipSlantSize}
                        border={{
                            borderColor: colour,
                            borderThickness: ".15rem",
                        }}
                        backgroundColor={backgroundColor}
                        opacity={0.7}
                    >
                        <Stack
                            spacing=".8rem"
                            alignItems="flex-start"
                            sx={{
                                flex: 1,
                                minWidth: "32.5rem",
                                p: ".6rem 1.6rem",
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
                                <TopTextBT description={description} image_url={image_url} colour={colour} label={label} />
                                <MechAbilityButtonBT gameAbility={gameAbility} />
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}

export const MechAbilityButtonBT = ({ gameAbility }: { gameAbility: GameAbility }) => {
    const { label, colour, text_colour } = gameAbility
    const { trainingStage, setTrainingStage, setRepairTime } = useTraining()
    const [remainSeconds, setRemainSeconds] = useState(0)

    useInterval(() => {
        setRemainSeconds((rs) => {
            if (rs === 0) {
                return 0
            }
            return rs - 1
        })
        if (label === "REPAIR") {
            setRepairTime((rs) => {
                if (rs === 0) {
                    return 0
                }
                return rs - 1
            })
        }
    }, 1000)

    return (
        <FancyButton
            disabled={remainSeconds !== 0 || label === "OVERCHARGE"}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colour || "#14182B",
                border: { isFancy: true, borderColor: colour || "#14182B" },
                sx: { position: "relative" },
            }}
            sx={{ px: "1.2rem", pt: ".4rem", pb: ".5rem", minWidth: "7rem" }}
            onClick={() => {
                const tCoolDown = 30
                setRemainSeconds(tCoolDown)
                setRepairTime(tCoolDown)
                setTrainingStage(MechAbilityStages.RepairMA)
            }}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        color: remainSeconds > 0 || !text_colour ? "#FFFFFF" : text_colour,
                        animation: trainingStage === MechAbilityStages.ExpandMA && label !== "OVERCHARGE" ? `${zoomEffect(1.35)} 2s infinite` : "unset",
                    }}
                >
                    {remainSeconds > 0 ? `${remainSeconds}s` : label === "OVERCHARGE" ? "DISABLED" : `FIRE`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
