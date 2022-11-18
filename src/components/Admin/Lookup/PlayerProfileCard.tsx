import { Stack, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import { ReactNode } from "react"
import { fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { ClipThing } from "../../Common/Deprecated/ClipThing"

export const PlayerProfileCard = ({
    faction,
    title,
    children,
    fullWidth,
    sx,
}: {
    faction: Faction
    title: string
    children: ReactNode
    fullWidth?: boolean
    sx?: SxProps
}) => {
    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: faction.palette.primary,
                borderThickness: ".3rem",
            }}
            opacity={0.9}
            backgroundColor={faction.palette.background}
            sx={{ width: fullWidth ? "100%" : "auto", ...sx }}
            contentSx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    p: "1rem",
                    width: "100%",
                    textAlign: "center",
                    color: faction.palette.text,
                    background: faction.palette.primary,
                }}
            >
                {title}
            </Typography>
            <Stack flex={1} minHeight="220px">
                {children}
            </Stack>
        </ClipThing>
    )
}
