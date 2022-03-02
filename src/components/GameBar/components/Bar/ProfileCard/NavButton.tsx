import { Button, SxProps, Theme } from "@mui/material"
import { colors } from "../../../theme"

interface NavButtonProps {
    href: string
    active?: boolean
    sx?: SxProps<Theme>
    startIcon?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export const NavButton: React.FC<NavButtonProps> = ({ href, active, sx, startIcon, onClick, children }) => {
    return (
        <Button
            sx={{
                alignItems: "center",
                justifyContent: "start",
                color: colors.text,
                backgroundColor: active ? colors.darkNavyBlue : undefined,
                ":hover": {
                    backgroundColor: colors.darkerNeonBlue,
                },
                ...sx,
            }}
            component={"a"}
            href={href}
            target={"_blank"}
            startIcon={startIcon}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
