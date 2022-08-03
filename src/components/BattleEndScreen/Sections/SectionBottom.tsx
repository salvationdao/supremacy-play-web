import { Stack, Typography } from "@mui/material"
import { BOTTOM_BUTTONS_HEIGHT, FancyButton } from "../.."
import { useMobile, useOverlayToggles } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"

export const SectionBottom = () => {
    const theme = useTheme()
    const { isMobile } = useMobile()
    const { toggleIsEndBattleDetailOpen } = useOverlayToggles()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    if (isMobile) return null

    return (
        <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                pl: "1.2rem",
                pr: "3.36rem",
                height: `${BOTTOM_BUTTONS_HEIGHT}rem`,
            }}
        >
            <FancyButton
                clipThingsProps={{
                    clipSize: "8px",
                    backgroundColor: primaryColor,
                    border: {
                        isFancy: true,
                        borderColor: primaryColor,
                    },
                }}
                sx={{
                    py: ".2rem",
                    width: "9rem",
                }}
                onClick={() => toggleIsEndBattleDetailOpen(false)}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: secondaryColor,
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    CLOSE
                </Typography>
            </FancyButton>
        </Stack>
    )
}
