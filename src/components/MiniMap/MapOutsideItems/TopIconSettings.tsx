import { Box, IconButton, Typography } from "@mui/material"
import { SvgMapEnlarge, SvgHide } from "../../../assets"
import { shadeColor } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { Map } from "../../../types"

export const TopIconSettings = ({
    map,
    enlarged,
    mainColor,
    toggleEnlarged,
    toggleIsMapOpen,
}: {
    map: Map
    enlarged?: boolean
    mainColor: string
    toggleEnlarged: () => void
    toggleIsMapOpen: () => void
}) => {
    let name = map.name
    if (name === "NeoTokyo") {
        name = "City Block X2"
    }

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "2.6rem",
                backgroundColor: shadeColor(mainColor, -86),
                boxShadow: 2,
            }}
        >
            <IconButton
                size="small"
                sx={{
                    position: "absolute",
                    left: enlarged ? "1rem" : "3rem",
                    top: 1,
                    color: colors.text,
                    opacity: 0.8,
                    zIndex: 50,
                }}
                onClick={() => toggleEnlarged()}
            >
                <SvgMapEnlarge size="1.3rem" />
            </IconButton>

            <IconButton
                size="small"
                sx={{
                    position: "absolute",
                    left: enlarged ? "3rem" : "5rem",
                    top: 1,
                    color: colors.text,
                    opacity: 0.8,
                    zIndex: 50,
                }}
                onClick={() => toggleIsMapOpen()}
            >
                <SvgHide size="1.3rem" />
            </IconButton>

            <Typography
                variant="caption"
                sx={{
                    position: "absolute",
                    left: enlarged ? "6.1rem" : "8.1rem",
                    top: 8.2,
                    fontSize: "1rem",
                    fontFamily: fonts.nostromoBlack,
                    lineHeight: 1,
                    opacity: 0.8,
                }}
            >
                {name
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toUpperCase()}
            </Typography>
        </Box>
    )
}
