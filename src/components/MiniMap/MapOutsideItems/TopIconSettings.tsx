import { Box, IconButton, Typography } from "@mui/material"
import { SvgMapEnlarge, SvgHide } from "../../../assets"
import { shadeColor } from "../../../helpers"
import { colors } from "../../../theme/theme"
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
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2.4rem",
                backgroundColor: shadeColor(mainColor, -86),
                boxShadow: 2,
            }}
        >
            <IconButton
                size="small"
                sx={{
                    position: "absolute",
                    left: enlarged ? ".5rem" : "2.5rem",
                    top: 0,
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
                    left: enlarged ? "2.5rem" : "4.5rem",
                    top: 0,
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
                    left: enlarged ? "5.6rem" : "7.6rem",
                    top: 7.2,
                    fontSize: "1.1rem",
                    fontWeight: "fontWeightBold",
                    lineHeight: 1,
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
