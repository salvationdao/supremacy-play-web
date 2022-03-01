import { Box, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { ClipThing } from "../GameBar/components"

export const BattleCloseAlert = () => {
    const { state, subscribe } = useWebsocket()
    const theme = useTheme()
    const [gamesToClose, setGamesToClose] = useState<number>()

    // Subscribe get battles until stream closes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<number>(
            HubKey.SubscribeStreamClose,
            (payload) => {
                if (!payload) {
                    return
                }
                if (payload === -1) {
                    return
                }

                setGamesToClose(payload)
            },
            null,
        )
    }, [state, subscribe])

    return gamesToClose && gamesToClose < 10 && gamesToClose >= 0 ? (
        <ClipThing
            sx={{
                position: "absolute",
                width: "17rem",
                top: ".8rem",
                left: "0",
                right: "0",
                margin: "auto",
            }}
            clipSize="10px"
            border={{
                isFancy: true,
                borderThickness: "3px",
                borderColor: theme.factionTheme.primary,
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    padding: ".5rem",
                    backgroundColor: theme.factionTheme.background,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography sx={{ fontSize: "1.1rem", textTransform: "uppercase", fontWeight: "500" }}>
                    Battle Stream Will Close In&#8230;
                </Typography>
                <Typography sx={{ fontSize: "1.5rem", textTransform: "uppercase", fontWeight: "700" }}>
                    {gamesToClose} Games
                </Typography>
            </Box>
        </ClipThing>
    ) : null
}
