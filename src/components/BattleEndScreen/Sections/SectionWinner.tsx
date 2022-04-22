import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { GenericWarMachinePNG } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useSupremacy } from "../../../containers"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionWinner = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { factionsAll } = useSupremacy()
    const { battle_identifier, winning_faction, winning_war_machines } = battleEndDetail

    return (
        <Stack spacing="2.4rem">
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.neonBlue,
                    }}
                >
                    The Winner
                    <BattleEndTooltip text={`The syndicate that had won the battle #${battle_identifier}.`} color={colors.neonBlue} />
                </Typography>
            </Box>

            <Stack spacing="1.5rem" sx={{ px: ".96rem" }}>
                <StyledImageText
                    color={winning_faction.theme.primary}
                    text={winning_faction.label}
                    imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[winning_faction.id]?.logo_blob_id}`}
                    variant="h6"
                    imageSize={3.6}
                    imageBorderThickness="0px"
                    imageBackgroundSize="contain"
                    truncateLine
                    imageMb={-1.4}
                />

                {winning_war_machines && winning_war_machines.length > 0 ? (
                    <Stack spacing=".8rem" sx={{ pl: ".5rem" }}>
                        {winning_war_machines.map((wm) => (
                            <StyledImageText
                                key={`${wm.hash}-${wm.participantID}`}
                                color={colors.text}
                                imageBorderColor={wm.faction.theme.primary}
                                imageBackgroundColor={`${wm.faction.theme.primary}60`}
                                text={(wm.name || wm.hash).toUpperCase()}
                                imageUrl={wm.imageAvatar || GenericWarMachinePNG}
                                variant="h6"
                                imageSize={2.9}
                                imageBorderThickness=".2rem"
                                fontWeight="normal"
                                truncateLine
                                imageMb={-0.8}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="h6" sx={{ pl: ".8rem", opacity: 0.8 }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
