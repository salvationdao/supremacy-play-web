import { Typography } from "@mui/material"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"

export const ViewButton = ({ isGridView, to }: { isGridView: boolean; to: string }) => {
    const history = useHistory()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <FancyButton
            excludeCaret
            clipThingsProps={{
                clipSize: "6px",
                backgroundColor: primaryColor,
                opacity: 1,
                border: { isFancy: true, borderColor: primaryColor, borderThickness: "1px" },
                sx: { position: "relative", alignSelf: "center", width: isGridView ? "100%" : "unset" },
            }}
            sx={{ px: "2.8rem", py: ".25rem", color: secondaryColor }}
            onClick={() => history.push(to)}
        >
            <Typography
                variant="caption"
                sx={{
                    flexShrink: 0,
                    color: secondaryColor,
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                VIEW
            </Typography>
        </FancyButton>
    )
}
