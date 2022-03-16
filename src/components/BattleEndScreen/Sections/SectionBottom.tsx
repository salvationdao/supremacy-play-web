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
                pl: "1.2rem",
                pr: "3.36rem",
                height: `${BOTTOM_BUTTONS_HEIGHT}rem`,
            }}
        >
            <Stack
                direction="row"
                spacing=".64rem"
                alignItems="flex-end"
                sx={{ mr: "auto", pb: ".48rem", height: "100%", opacity: 0.5 }}
            >
                <Typography variant="body2" sx={{ color: "grey !important" }}>
                    BATTLE ID #{battle_identifier.toString().padStart(4, "0")} ({moment(started_at).format("h:mm A")} to{" "}
                    {moment(ended_at).format("h:mm A")})
                </Typography>
            </Stack>

            <FancyButton
                excludeCaret
                clipSize="8px"
                sx={{
                    py: ".16rem",
                    pt: ".5rem",
                    width: "10rem",
                    color: secondaryColor,
                    fontFamily: "Nostromo Regular Black",
                }}
                backgroundColor={primaryColor}
                borderColor={primaryColor}
                onClick={() => toggleIsEndBattleDetailOpen(false)}
            >
                CLOSE
            </FancyButton>
        </Stack>
    )
}
