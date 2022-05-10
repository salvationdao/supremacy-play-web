import { Box, Stack, Typography } from "@mui/material"
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { colors } from "../../../theme/theme"
import { PlayerAbility } from "../../../types"
interface TargetHintProps {
    playerAbility: PlayerAbility
}

export const TargetHint = ({ playerAbility }: TargetHintProps) => {
    let abilityTypeIcon = <SvgQuestionMark />
    let abilityActionDescriptor = "Select a location"
    switch (playerAbility?.location_select_type) {
        case "LOCATION_SELECT":
            abilityActionDescriptor = "Select a location"
            abilityTypeIcon = <SvgTarget size="1.6rem" />
            break
        case "MECH_SELECT":
            abilityActionDescriptor = "Select a mech"
            abilityTypeIcon = <SvgMicrochip size="1.6rem" />
            break
        case "LINE_SELECT":
            abilityActionDescriptor = "Draw a line by selecting two locations"
            abilityTypeIcon = <SvgLine size="1.6rem" />
            break
    }

    return (
        <Stack
            alignItems="baseline"
            justifyContent="center"
            direction="row"
            spacing=".8rem"
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                px: "1.12rem",
                py: ".48rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Typography variant="h6">
                <Box
                    component="span"
                    sx={{
                        fontWeight: "fontWeightBold",
                    }}
                >
                    {abilityActionDescriptor}
                </Box>
                &nbsp;to deploy&nbsp;
                <Box
                    component="span"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: ".5rem",
                        textTransform: "uppercase",
                        fontWeight: "fontWeightBold",
                        color: colors.offWhite,
                        lineHeight: 1,
                    }}
                >
                    {abilityTypeIcon}
                    &nbsp;
                    {playerAbility.label}
                </Box>
            </Typography>
        </Stack>
    )
}
