import { Box, Stack, Typography } from "@mui/material"
import { TooltipHelper } from "../.."
import { fonts } from "../../../theme/theme"

interface TopTextProps {
    description: string
    image_url: string
    colour: string
    label: string
}

export const TopText = ({ description, image_url, colour, label }: TopTextProps) => (
    <TooltipHelper placement="right" text={description}>
        <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
            <Box
                sx={{
                    height: "1.9rem",
                    width: "1.9rem",
                    backgroundImage: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: colour || "#030409",
                    border: `${colour} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            />
            <Typography
                variant="body1"
                sx={{
                    lineHeight: 1,
                    fontWeight: "fontWeightBold",
                    fontFamily: fonts.nostromoBold,
                    color: colour,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "20rem",
                }}
            >
                {label}
            </Typography>
        </Stack>
    </TooltipHelper>
)