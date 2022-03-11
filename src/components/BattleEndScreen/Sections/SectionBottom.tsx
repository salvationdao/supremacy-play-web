import { Stack, Typography } from "@mui/material"
import moment from "moment"
import { BOTTOM_BUTTONS_HEIGHT, FancyButton } from "../.."
import { useOverlayToggles } from "../../../containers"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionBottom = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { toggleIsEndBattleDetailOpen } = useOverlayToggles()
    const { battle_identifier, started_at, ended_at } = battleEndDetail

    const primaryColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? battleEndDetail && battleEndDetail.winning_faction.theme.primary
            : colors.darkNavyBlue
    const secondaryColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? battleEndDetail && battleEndDetail.winning_faction.theme.secondary
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
                    BATTLE #{battle_identifier.toString().padStart(4, "0")} ({moment(started_at).format("h:mm A")} to{" "}
                    {moment(ended_at).format("h:mm A")})
                </Typography>
            </Stack>

            <FancyButton
                excludeCaret
                clipSize="8px"
                sx={{ pt: 0.9, pb: 0.7, width: 100 }}
                backgroundColor={primaryColor}
                borderColor={primaryColor}
                onClick={() => toggleIsEndBattleDetailOpen(false)}
            >
                <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: "fontWeightBold", color: secondaryColor }}>
                    CLOSE
                </Typography>
            </FancyButton>
        </Stack>
    )
}
