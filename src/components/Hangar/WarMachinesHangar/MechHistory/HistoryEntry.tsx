import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from "../../.."
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
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: statusColor,
                borderThickness: ".2rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            opacity={0.7}
            backgroundColor="#000000"
            sx={{ flexShrink: 0 }}
        >
            <Stack
                direction="row"
                sx={{
                    position: "relative",
                    p: "1rem 1.6rem",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: `linear-gradient(60deg, rgba(0, 0, 0, 0.6) 30%, ${statusColor}60)`,
                        zIndex: -1,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        opacity: 0.2,
                        background: `url(${backgroundImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        zIndex: -2,
                    }}
                />

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

                    <Typography sx={{ color: colors.offWhite }}>{timeSinceInWords(date, new Date())} ago</Typography>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
