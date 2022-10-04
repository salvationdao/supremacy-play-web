import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"

export const PlayerProfileCard = ({ faction, title, children, fullWidth }: { faction: Faction; title: string; children: ReactNode; fullWidth?: boolean }) => {
    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: faction.primary_color,
                borderThickness: ".3rem",
            }}
            opacity={0.9}
            backgroundColor={faction.background_color}
            sx={{ height: "100%", flex: 1, width: fullWidth ? "100%" : "unset" }}
        >
            <Stack sx={{ height: "100%" }}>
                <Typography
                    variant="h6"
                    sx={{ fontFamily: fonts.nostromoBlack, p: "1rem", width: "100%", textAlign: "center", background: faction.primary_color }}
                >
                    {title}
                </Typography>
                <Stack sx={{ flex: 1 }}>{children}</Stack>
            </Stack>
        </ClipThing>
    )
}
