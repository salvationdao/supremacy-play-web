import { Stack, Typography } from "@mui/material"
import moment from "moment"
import { BOTTOM_BUTTONS_HEIGHT, FancyButton } from ".."
import { useOverlayToggles } from "../../containers"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionBottom = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { toggleIsEndBattleDetailOpen } = useOverlayToggles()
    const { battleIdentifier, startedAt, endedAt } = battleEndDetail

    const primaryColor =
        battleEndDetail && battleEndDetail.winningFaction
            ? battleEndDetail && battleEndDetail.winningFaction.theme.primary
            : colors.darkNavyBlue
    const secondaryColor =
        battleEndDetail && battleEndDetail.winningFaction
            ? battleEndDetail && battleEndDetail.winningFaction.theme.secondary
            : colors.text

    return (
        <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                pl: 1.5,
                pr: 4.2,
                height: BOTTOM_BUTTONS_HEIGHT,
            }}
        >
            <Stack
                direction="row"
                spacing={0.8}
                alignItems="flex-end"
                sx={{ mr: "auto", pb: 0.6, height: "100%", opacity: 0.5 }}
            >
                <Typography variant="body2" sx={{ color: "grey !important" }}>
                    BATTLE #{battleIdentifier.toString().padStart(4, "0")} (
                    {moment(startedAt).format("YYYY-M-DD h:mm A")} to {moment(endedAt).format("YYYY-M-DD h:mm A")})
                </Typography>
            </Stack>

            <FancyButton
                excludeCaret
                clipSize="8px"
                sx={{ py: 1.2, width: 120 }}
                backgroundColor={primaryColor}
                borderColor={primaryColor}
                onClick={() => toggleIsEndBattleDetailOpen(false)}
            >
                <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: "fontWeightBold", color: secondaryColor }}>
                    CLOSE
                </Typography>
            </FancyButton>
        </Stack>
    )
}
