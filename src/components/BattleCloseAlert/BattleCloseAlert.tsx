import { Box, Stack, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from ".."
import { useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"

export const BattleCloseAlert = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const theme = useTheme()
    const [gamesToClose, setGamesToClose] = useState<number>()

    // Subscribe to get battles until stream closes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<number>(
            GameServerKeys.SubStreamClose,
            (payload) => {
                if (!payload || payload === -1) return
                setGamesToClose(payload)
            },
            null,
        )
    }, [state, subscribe])

    if (!gamesToClose || gamesToClose >= 10 || gamesToClose < 0) return null

    return (
        <Box
            sx={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                filter: "drop-shadow(0 3px 3px #00000050)",
                pointerEvents: "none",
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderThickness: ".2rem",
                    borderColor: theme.factionTheme.primary,
                }}
            >
                <Stack
                    alignItems="center"
                    sx={{
                        height: "100%",
                        width: "100%",
                        px: "2.4rem",
                        py: ".96rem",
                        backgroundColor: theme.factionTheme.background,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "500" }}>
                        BATTLE STREAM WILL CLOSE IN&#8230;
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "700" }}>
                        {gamesToClose} GAMES
                    </Typography>
                </Stack>
            </ClipThing>
        </Box>
    )
}
