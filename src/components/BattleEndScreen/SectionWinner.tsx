import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from ".."
import { GenericWarMachinePNG } from "../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionWinner = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { battle_identifier, winning_faction, winning_war_machines } = battleEndDetail

    return (
        <Stack spacing={3}>
            <Box sx={{ px: 2.5, py: 1.5, backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h4"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.yellow,
                    }}
                >
                    VICTORY!
                    <BattleEndTooltip
                        text={`The syndicate that had won the battle #${battle_identifier}.`}
                        color={colors.yellow}
                    />
                </Typography>
            </Box>

            <Stack spacing={3.2} sx={{ px: 1.2 }}>
                <StyledImageText
                    color={winning_faction.theme.primary}
                    text={winning_faction.label}
                    imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${winning_faction.logo_blob_id}`}
                    variant="h5"
                    imageSize={40}
                    imageBorderThickness="0px"
                    noImageBackgroundColor
                    imageBackgroundSize="contain"
                    truncateLine
                />

                {winning_war_machines && winning_war_machines.length > 0 ? (
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {winning_war_machines.map((wm) => (
                            <StyledImageText
                                key={`${wm.hash}-${wm.participant_id}`}
                                color={colors.text}
                                imageBorderColor={wm.faction.theme.primary}
                                imageBackgroundColor={`${wm.faction.theme.primary}60`}
                                text={wm.name.toUpperCase()}
                                imageUrl={wm.image_avatar || GenericWarMachinePNG}
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
