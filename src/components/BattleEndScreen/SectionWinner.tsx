import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from ".."
import { GenericWarMachinePNG } from "../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionWinner = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { battleIdentifier, winningFaction, winningWarMachines } = battleEndDetail

    return (
        <Stack spacing={3}>
            <Box sx={{ px: 2.5, py: 1.5, backgroundColor: "#00000083" }}>
                <Typography
                    component="span"
                    variant="h3"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.yellow,
                    }}
                >
                    VICTORY!
                    <BattleEndTooltip
                        text={`The syndicate that had won the battle #${battleIdentifier}.`}
                        color={colors.yellow}
                    />
                </Typography>
            </Box>

            <Stack spacing={3.2} sx={{ px: 1.2 }}>
                <StyledImageText
                    color={winningFaction.theme.primary}
                    text={winningFaction.label}
                    imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${winningFaction.logoBlobID}`}
                    variant="h4"
                    imageSize={40}
                    imageBorderThickness="0px"
                    noImageBackgroundColor
                    imageBackgroundSize="contain"
                    truncateLine
                />

                {winningWarMachines && winningWarMachines.length > 0 ? (
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {winningWarMachines.map((wm) => (
                            <StyledImageText
                                key={`${wm.hash}-${wm.participantID}`}
                                color={colors.text}
                                imageBorderColor={wm.faction.theme.primary}
                                imageBackgroundColor={`${wm.faction.theme.primary}60`}
                                text={wm.name.toUpperCase()}
                                imageUrl={wm.imageUrl || GenericWarMachinePNG}
                                variant="h5"
                                imageSize={29}
                                imageBorderThickness="2px"
                                fontWeight="normal"
                                truncateLine
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="h5" sx={{ pl: 1 }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
