import { Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"

export interface GlobalAnnouncementType {
    title: string
    message: string
    show_from_battle_number: number
    show_until_battle_number: number
    severity: Severity
}

enum Severity {
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    INFO = "INFO",
    DANGER = "DANGER",
}

const bgColourFromSeverity = (severity: Severity): string => {
    let colour = ""
    switch (severity) {
        case Severity.SUCCESS:
            colour = colors.green
            break
        case Severity.WARNING:
            colour = colors.gold
            break
        case Severity.DANGER:
            colour = colors.red
            break
        case Severity.INFO:
        default:
            colour = colors.blue
            break
    }

    return colour
}

export const GlobalAnnouncement = ({ globalAnnouncement }: { globalAnnouncement: GlobalAnnouncementType }) => {
    return (
        <Box>
            <Stack
                justifyContent="center"
                spacing=".24rem"
                sx={{
                    px: "1.8rem",
                    py: "1.2rem",
                    backgroundColor: bgColourFromSeverity(globalAnnouncement.severity),
                    boxShadow: 2,
                    textAlign: "start",
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>{globalAnnouncement.title}</Typography>
                <Typography>{globalAnnouncement.message}</Typography>
            </Stack>
        </Box>
    )
}
