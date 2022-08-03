import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../.."
import { fonts } from "../../../../theme/theme"

interface NavButtonProps {
    to?: string
    href?: string
    startIcon?: React.ReactNode
    text: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    hoverBackgroundColor?: string
}

export const NavButton: React.FC<NavButtonProps> = ({ to, href, startIcon, text, onClick, hoverBackgroundColor }) => {
    return (
        <FancyButton
            tabIndex={0}
            clipThingsProps={{
                clipSize: "9px",
                opacity: 1,
                sx: { position: "relative" },
            }}
            sx={{ px: "1.6rem", py: ".4rem", color: hoverBackgroundColor }}
            to={to}
            href={href || ""}
            target={href ? "_blank" : undefined}
            onClick={onClick}
        >
            <Stack spacing="1rem" direction="row" alignItems="center">
                {startIcon}
                <Typography
                    variant="caption"
                    sx={{
                        color: "#FFFFFF",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {text}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
