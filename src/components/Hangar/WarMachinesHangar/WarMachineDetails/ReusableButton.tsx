import { SxProps, Typography } from "@mui/material"
import { FancyButton } from "../../.."
import { fonts } from "../../../../theme/theme"

export const ReusableButton = ({
    primaryColor,
    secondaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
    to,
    href,
    sx,
}: {
    isFancy?: boolean
    primaryColor: string
    secondaryColor?: string
    backgroundColor: string
    label: string
    onClick?: () => void
    disabled?: boolean
    to?: string
    href?: string
    sx?: SxProps
}) => {
    return (
        <FancyButton
            to={to}
            href={href}
            disabled={(!onClick && !to) || disabled}
            clipThingsProps={{
                clipSize: "6px",
                clipSlantSize: "0px",
                corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                backgroundColor: backgroundColor,
                border: { isFancy: false, borderColor: primaryColor, borderThickness: "1.5px" },
                sx: { position: "relative", minWidth: "10rem", ...sx },
            }}
            sx={{ px: "1.3rem", py: ".9rem", color: secondaryColor || primaryColor }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    color: secondaryColor || "#FFFFFF",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
