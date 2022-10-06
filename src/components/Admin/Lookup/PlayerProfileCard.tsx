import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { SxProps } from "@mui/system"

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
                borderColor: faction.primary_color,
                borderThickness: ".3rem",
            }}
            opacity={0.9}
            backgroundColor={faction.background_color}
            sx={{ height: "100%", width: fullWidth ? "100%" : "unset", ...sx }}
        >
            <Stack sx={{ height: "100%" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        p: "1rem",
                        width: "100%",
                        textAlign: "center",
                        color: faction.secondary_color,
                        background: faction.primary_color,
                    }}
                >
                    {title}
                </Typography>
                <Stack sx={{ flex: 1 }}>{children}</Stack>
            </Stack>
        </ClipThing>
    )
}
