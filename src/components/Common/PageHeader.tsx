import { Box, Stack, Typography } from "@mui/material"
import React, { ReactNode, useMemo } from "react"
import { fonts } from "../../theme/theme"

interface PageHeaderProps {
    title?: ReactNode
    description?: ReactNode
    imageUrl?: string
    children?: ReactNode
    smallSize?: boolean
    primaryColor?: string

    imageHeight?: string
    imageWidth?: string
}

export const PageHeader = React.memo(function PageHeader({
    title,
    description,
    imageUrl,
    children,
    smallSize,
    primaryColor,
    imageHeight,
    imageWidth,
}: PageHeaderProps) {
    const showTitle = useMemo(() => {
        if (!title) return null
        if (typeof title === "string")
            return (
                <Typography variant={smallSize ? "h6" : "h5"} sx={{ fontFamily: fonts.nostromoBlack }}>
                    {title}
                </Typography>
            )

        return title
    }, [smallSize, title])

    const showDescription = useMemo(() => {
        if (!description) return null
        if (typeof description === "string") return <Typography sx={{ fontSize: "1.85rem" }}>{description}</Typography>
        return description
    }, [description])

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
                    {showTitle}

                    {showDescription}
                </Box>
            </Stack>

            {children}
        </Stack>
    )
})
