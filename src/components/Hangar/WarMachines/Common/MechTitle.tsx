import { Box, Typography } from "@mui/material"
import { useRef } from "react"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechTitle = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const { label, name, tier } = mech
    const rarityDeets = useRef(getRarityDeets(tier || ""))

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: "1rem",
                transform: "translateY(-40%)",
                px: "1rem",
                py: ".2rem",
                maxWidth: "70%",
                overflow: "visible",
                backgroundColor: theme.factionTheme.background,
                border: `${theme.factionTheme.primary}90 .2rem solid`,
                zIndex: 9,
            }}
        >
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label || name}
            </Typography>
        </Box>
    )
}
