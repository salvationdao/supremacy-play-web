import { Stack, Box, Button, SxProps, Theme } from "@mui/material"
import { colors } from "../../../../theme/theme"

interface NavButtonProps {
    href?: string
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
                fontFamily: "Nostromo Regular Bold",
                px: "1.2rem",
                pt: ".9rem",
                pb: ".6rem",
                color: "#FFFFFF",
                backgroundColor: active ? colors.darkNavyBlue : undefined,
                ":hover": {
                    backgroundColor: colors.darkerNeonBlue,
                },
                ...sx,
            }}
            href={href || ""}
            target={href ? "_blank" : undefined}
            onClick={onClick}
        >
            <Stack spacing="1rem" direction="row" alignItems="center">
                {startIcon}
                <Box>{children}</Box>
            </Stack>
        </Button>
    )
}
