import { Box, Popover, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { ClipThing, FactionAbilityItem } from ".."
import { GenericWarMachinePNG } from "../../assets"
import { GameAbility, WarMachineState } from "../../types"
import { ContributorAmount } from "../BattleStats/ContributorAmount"

interface WarMachineAbilitiesPopoverProps {
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    warMachine: WarMachineState
    gameAbilities: GameAbility[]
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
}

export const WarMachineAbilitiesPopover = ({ popoverRef, open, onClose, warMachine, gameAbilities, maxAbilityPriceMap }: WarMachineAbilitiesPopoverProps) => {
    const factionTheme = warMachine.faction.theme

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
                        isFancy: true,
                        borderThickness: ".14rem",
                        borderColor: factionTheme.primary,
                    }}
                >
                    <Box sx={{ backgroundColor: factionTheme.background, px: "1.28rem", pt: "1.28rem", pb: "1.28rem" }}>
                        <Stack spacing=".72rem">
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" spacing=".8rem" alignItems="center" sx={{ ml: ".88rem" }}>
                                    <Box
                                        sx={{
                                            width: "1.7rem",
                                            height: "1.7rem",
                                            backgroundImage: `url(${warMachine.imageAvatar || GenericWarMachinePNG})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundColor: factionTheme.primary,
                                            mb: ".12rem",
                                            border: `${factionTheme.primary} 1px solid`,
                                            borderRadius: 0.5,
                                        }}
                                    />
                                    <Typography sx={{ lineHeight: 1, color: factionTheme.primary, fontWeight: "fontWeightBold" }}>
                                        WAR MACHINE UNIQUE SKILL{gameAbilities.length > 1 ? "S" : ""}
                                    </Typography>
                                </Stack>
                                <ContributorAmount showContributorAmount />
                            </Stack>

                            <Stack spacing=".9rem">
                                {gameAbilities.map((ga, i) => (
                                    <Box key={ga.identity} sx={{ ml: `${(i + 1) * 0.2 * 0.8}rem` }}>
                                        <FactionAbilityItem
                                            gameAbility={ga}
                                            abilityMaxPrice={maxAbilityPriceMap?.current.get(ga.identity)}
                                            clipSlantSize="5px"
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </ClipThing>
            </Box>
        </Popover>
    )
}
