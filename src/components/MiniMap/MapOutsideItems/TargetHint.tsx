import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { colors } from "../../../theme/theme"
import { BlueprintPlayerAbility, LocationSelectType } from "../../../types"
interface TargetHintProps {
    ability: BlueprintPlayerAbility
}

export const TargetHint = ({ ability }: TargetHintProps) => {
    const [abilityTypeIcon, setAbilityTypeIcon] = useState<JSX.Element>(<SvgQuestionMark />)
    const [abilityActionDescriptor, setAbilityActionDescriptor] = useState("Select a location")

    useEffect(() => {
        switch (ability.location_select_type) {
            case LocationSelectType.LOCATION_SELECT:
                setAbilityActionDescriptor("Select a location")
                setAbilityTypeIcon(<SvgTarget size="1.6rem" />)
                break
            case LocationSelectType.MECH_SELECT:
                setAbilityActionDescriptor("Select an allied mech")
                setAbilityTypeIcon(<SvgMicrochip size="1.6rem" />)
                break
            case LocationSelectType.LINE_SELECT:
                setAbilityActionDescriptor("Draw a line by selecting two locations")
                setAbilityTypeIcon(<SvgLine size="1.6rem" />)
                break
        }
    }, [ability])

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
                    {ability.label}
                </Box>
            </Typography>
        </Stack>
    )
}
