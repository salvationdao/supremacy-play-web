import { Typography } from "@mui/material"
import { fonts } from "../../../../theme/theme"
import { LinkProps, NiceButton } from "../../../Common/Nice/NiceButton"

interface NavButtonProps {
    linkProps?: LinkProps
    startIcon?: React.ReactNode
    text: string
    onClick?: () => void
}

export const NavButton: React.FC<NavButtonProps> = ({ linkProps, startIcon, text, onClick }) => {
    return (
        <NiceButton tabIndex={0} onClick={() => onClick && onClick()} sx={{ px: "1.6rem", py: ".4rem", justifyContent: "flex-start" }} {...linkProps}>
            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                {startIcon} {text}
            </Typography>
        </NiceButton>
    )
}
