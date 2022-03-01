import { Box, Popover, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { ClipThing, WarMachineAbilityItem } from ".."
import { GenericWarMachinePNG } from "../../assets"
import { colors } from "../../theme/theme"
import { GameAbility, WarMachineState } from "../../types"

interface WarMachineAbilitiesPopoverProps {
    popoverRef: React.MutableRefObject<null>
    open: boolean
    toggleOpen: (_state: boolean) => void
    warMachine: WarMachineState
    gameAbilities: GameAbility[]
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
}

export const WarMachineAbilitiesPopover = ({
    popoverRef,
    open,
    toggleOpen,
    warMachine,
    gameAbilities,
    maxAbilityPriceMap,
}: WarMachineAbilitiesPopoverProps) => {
    const factionTheme = warMachine.faction.theme

    return (
        <Popover
            open={open}
            anchorEl={popoverRef.current}
            onClose={() => toggleOpen(false)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            PaperProps={{ sx: { backgroundColor: "transparent", boxShadow: 0 } }}
        >
            <Box
                sx={{
                    ml: 2.5,
                    mb: 1.75,
                    filter: "drop-shadow(0 3px 3px #00000050)",
                }}
            >
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="8px"
                    border={{
                        isFancy: true,
                        borderThickness: "1.4px",
                        borderColor: factionTheme.primary,
                    }}
                >
                    <Box sx={{ backgroundColor: factionTheme.background, px: 1.6, pt: 1.6, pb: 1.6 }}>
                        <Stack spacing={0.9}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1.1 }}>
                                <Box
                                    sx={{
                                        width: 17,
                                        height: 17,
                                        backgroundImage: `url(${warMachine.imageUrl || GenericWarMachinePNG})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundColor: factionTheme.primary,
                                        mb: 0.3,
                                    }}
                                />
                                <Typography
                                    sx={{ lineHeight: 1, color: factionTheme.primary, fontWeight: "fontWeightBold" }}
                                >
                                    WAR MACHINE UNIQUE SKILL{gameAbilities.length > 1 ? "S" : ""}
                                </Typography>
                            </Stack>

                            <Stack spacing={0.9}>
                                {gameAbilities.map((ga, i) => (
                                    <Box key={ga.identity} sx={{ ml: (i + 1) * 0.2 }}>
                                        <WarMachineAbilityItem
                                            gameAbility={ga}
                                            maxAbilityPriceMap={maxAbilityPriceMap}
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
