import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../theme/theme"

interface PageHeaderProps {
    title: ReactNode
    description?: ReactNode
    imageUrl?: string
    children?: ReactNode
}

export const PageHeader = ({ title, description, imageUrl, children }: PageHeaderProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                px: "2rem",
                py: "2.2rem",
                backgroundColor: "#00000070",
                borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
            }}
        >
            {imageUrl && (
                <Box
                    sx={{
                        alignSelf: "flex-start",
                        flexShrink: 0,
                        mr: "1.6rem",
                        width: "7rem",
                        height: "5.2rem",
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />
            )}
            <Box sx={{ mr: "2rem" }}>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {title}
                </Typography>
                {description && <Typography sx={{ fontSize: "1.85rem" }}>{description}</Typography>}
            </Box>

            {children && <Box sx={{ ml: "auto" }}>{children}</Box>}
        </Stack>
    )
}