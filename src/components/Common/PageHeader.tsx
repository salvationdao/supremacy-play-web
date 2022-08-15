import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../theme/theme"

interface PageHeaderProps {
    title: ReactNode
    description?: ReactNode
    imageUrl?: string
    children?: ReactNode
    smallSize?: boolean
    primaryColor?: string

    imageHeight?: string
    imageWidth?: string
}

export const PageHeader = ({ title, description, imageUrl, children, smallSize, primaryColor, imageHeight, imageWidth }: PageHeaderProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="2rem"
            sx={{
                backgroundColor: "#00000080",
                borderBottom: (theme) => `${primaryColor || theme.factionTheme.primary}70 1.5px solid`,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    px: smallSize ? "1.6rem" : "2rem",
                    py: smallSize ? "1rem" : "1.5rem",
                }}
            >
                {imageUrl && (
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            flexShrink: 0,
                            mr: "1.6rem",
                            width: imageWidth || "7rem",
                            height: imageHeight || "5.2rem",
                            background: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                )}
                <Box>
                    {typeof title === "string" && (
                        <Typography variant={smallSize ? "h6" : "h5"} sx={{ fontFamily: fonts.nostromoBlack }}>
                            {title}
                        </Typography>
                    )}

                    {typeof title !== "string" && title}

                    {description && typeof description === "string" && <Typography sx={{ fontSize: "1.85rem" }}>{description}</Typography>}

                    {description && typeof description !== "string" && description}
                </Box>
            </Stack>

            {children}
        </Stack>
    )
}
