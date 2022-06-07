import { Box, Stack, Typography } from "@mui/material"
import { SvgDeath, SvgGoldBars } from "../../../../assets"
import { timeSinceInWords } from "../../../../helpers"
import { fonts, colors } from "../../../../theme/theme"

interface HistoryEntryProps {
    mapName: string
    mechSurvived: boolean
    backgroundImage?: string
    status: "won" | "lost" | "pending"
    kills: number
    date: Date
}

export const HistoryEntry = ({ status, mapName, mechSurvived, backgroundImage, kills, date }: HistoryEntryProps) => {
    let statusColor = colors.grey
    let statusText = "In Progress"
    switch (status) {
        case "won":
            statusColor = colors.green
            statusText = "Victory"
            break
        case "lost":
            statusColor = colors.red
            statusText = "Defeat"
            break
        case "pending":
        default:
    }

    return (
        <Stack
            direction="row"
            sx={{
                flexShrink: 0,
                p: "0.8rem 1.1rem",
                background: `center center`,
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, ${statusColor}80), url(${backgroundImage})`,
                backgroundSize: "cover",
            }}
        >
            <Box>
                <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
                    {mapName}
                </Typography>

                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {statusText}
                </Typography>

                {status !== "pending" && (
                    <Stack direction="row" alignItems="center" spacing=".5rem">
                        <Typography
                            variant="body2"
                            sx={{
                                textTransform: "uppercase",
                                color: mechSurvived ? colors.neonBlue : colors.lightRed,
                            }}
                        >
                            {mechSurvived ? "MECH SURVIVED" : "MECH DESTROYED"}
                        </Typography>
                        {mechSurvived && <SvgGoldBars size="1.5rem" />}
                    </Stack>
                )}
            </Box>

            <Stack alignItems="flex-end" alignSelf="center" sx={{ ml: "auto" }}>
                <Stack direction="row" spacing=".5rem" alignItems="center">
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: kills > 0 ? colors.gold : colors.lightGrey,
                        }}
                    >
                        {kills > 0 ? `${kills} KILL${kills > 1 ? "S" : ""}` : "NO KILLS"}
                    </Typography>
                    <SvgDeath fill={kills > 0 ? colors.gold : colors.lightGrey} size="1.8rem" />
                </Stack>

                <Typography sx={{ color: colors.offWhite }}>{timeSinceInWords(date, new Date())} AGO</Typography>
            </Stack>
        </Stack>
    )
}
