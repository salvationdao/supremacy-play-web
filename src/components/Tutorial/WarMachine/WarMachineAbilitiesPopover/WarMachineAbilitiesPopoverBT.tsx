import { Box, Popover, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect } from "react"
import { GenericWarMachinePNG } from "../../../../assets"
import { useTraining } from "../../../../containers"
import { Faction, GameAbility, MechAbilityStages, WarMachineState } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { WarMachineAbilityItemBT } from "../WarMachineItem/WarMachineAbilityItemBT"
interface WarMachineAbilitiesPopoverProps {
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    warMachine: WarMachineState
    gameAbilities: GameAbility[]
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
    getFaction: (factionID: string) => Faction
    isPoppedout?: boolean
    togglePopoverOpen: (value?: boolean | undefined) => void
}

export const WarMachineAbilitiesPopoverBT = ({
    popoverRef,
    open,
    onClose,
    warMachine,
    gameAbilities,
    getFaction,
    isPoppedout,
    togglePopoverOpen,
}: WarMachineAbilitiesPopoverProps) => {
    const faction = getFaction(warMachine.factionID)
    const { trainingStage } = useTraining()

    useEffect(() => {
        if (trainingStage !== MechAbilityStages.RepairMA && trainingStage !== MechAbilityStages.ExpandMA && open) {
            togglePopoverOpen(false)
        }
    }, [trainingStage, togglePopoverOpen, open])

    return (
        <Popover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transitionDuration={100}
            sx={{ ".MuiBackdrop-root": { backgroundColor: isPoppedout ? "#00000070" : "transparent" } }}
        >
            <Box
                sx={{
                    ml: ".2rem",
                    mb: "1.4rem",
                    filter: "drop-shadow(0 3px 3px #00000050)",
                }}
            >
                <ClipThing
                    clipSize="5px"
                    clipSlantSize={isPoppedout ? "0px" : "8px"}
                    border={{
                        borderThickness: ".2rem",
                        borderColor: faction.primary_color,
                    }}
                    opacity={0.9}
                    backgroundColor={faction.background_color}
                >
                    <Stack spacing="1rem" sx={{ p: "1.6rem" }}>
                        <Stack direction="row" spacing=".8rem" alignItems="center" sx={{ ml: ".88rem" }}>
                            <Box
                                sx={{
                                    width: "1.7rem",
                                    height: "1.7rem",
                                    backgroundImage: `url(${warMachine.imageAvatar || GenericWarMachinePNG})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundColor: faction.primary_color,
                                    mb: ".12rem",
                                    border: `${faction.primary_color} 1px solid`,
                                    borderRadius: 0.5,
                                }}
                            />
                            <Typography sx={{ lineHeight: 1, color: faction.primary_color, fontWeight: "bold" }}>
                                WAR MACHINE UNIQUE SKILL{gameAbilities.length > 1 ? "S" : ""}
                            </Typography>
                        </Stack>

                        <Stack spacing="1rem">
                            {gameAbilities.map((ga, i) => (
                                <Box key={ga.id} sx={{ ml: `${(i + 1) * 0.2 * 0.8}rem` }}>
                                    <WarMachineAbilityItemBT gameAbility={ga} clipSlantSize="3px" />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Popover>
    )
}
