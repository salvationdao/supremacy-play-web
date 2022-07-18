import { Box, Popover, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { ClipThing, FactionAbilityItem } from "../.."
import { GenericWarMachinePNG } from "../../../assets"
import { Faction, GameAbility, WarMachineState } from "../../../types"
import { ContributorAmount } from "../../BattleStats/ContributorAmount"
import { WarMachineAbilityItem } from "../WarMachineItem/WarMachineAbilityItem"

interface WarMachineAbilitiesPopoverProps {
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    warMachine: WarMachineState
    gameAbilities: GameAbility[]
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
    getFaction: (factionID: string) => Faction
}

export const WarMachineAbilitiesPopover = ({
    popoverRef,
    open,
    onClose,
    warMachine,
    gameAbilities,
    maxAbilityPriceMap,
    getFaction,
}: WarMachineAbilitiesPopoverProps) => {
    const faction = getFaction(warMachine.factionID)

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
            PaperProps={{ sx: { background: "none", boxShadow: 0 } }}
            transitionDuration={100}
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
                    clipSlantSize="8px"
                    border={{
                        borderThickness: ".2rem",
                        borderColor: faction.primary_color,
                    }}
                    opacity={0.9}
                    backgroundColor={faction.background_color}
                >
                    <Stack spacing="1rem" sx={{ p: "1.6rem" }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: ".3rem" }}>
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
                                <Typography sx={{ lineHeight: 1, color: faction.primary_color, fontWeight: "fontWeightBold" }}>
                                    WAR MACHINE UNIQUE SKILL{gameAbilities.length > 1 ? "S" : ""}
                                </Typography>
                            </Stack>
                            <ContributorAmount hideContributionTotal />
                        </Stack>

                        <Stack spacing="1rem">
                            {gameAbilities.map((ga, i) => (
                                <Box key={ga.id} sx={{ ml: `${(i + 1) * 0.2 * 0.8}rem` }}>
                                    <WarMachineAbilityItem warMachine={warMachine} gameAbility={ga} clipSlantSize="5px" />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Popover>
    )
}
