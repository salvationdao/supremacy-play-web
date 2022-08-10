import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { TooltipHelper } from "../.."
import { fonts } from "../../../theme/theme"

interface TopTextProps {
    description: string
    image_url?: string
    icon?: ReactNode
    colour: string
    label: string
}

export const TopText = ({ description, image_url, colour, label, icon }: TopTextProps) => (
    <TooltipHelper placement="right" text={description}>
        <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: "2.2rem",
                    width: "2.2rem",
                    backgroundImage: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: icon ? "#030409" : colour,
                    border: `${colour} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            >
                {icon}
            </Stack>

            <Typography
                variant="h6"
                sx={{
                    lineHeight: 1,
                    fontFamily: fonts.nostromoBlack,
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
