import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BarExpandable, EnlistButton } from "../.."
import { useWebsocket } from "../../../containers"
import HubKey from "../../../keys"
import { colors } from "../../../theme"
import { FactionGeneralData } from "../../../types"
import { GameBarBaseProps } from "../../../GameBar"
import { RedMountainLogo } from "../../../assets"

export const EnlistButtonGroup = (props: GameBarBaseProps) => {
    const { state, send } = useWebsocket()
    const [factionsData, setFactionsData] = useState<FactionGeneralData[]>()

    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        ;(async () => {
            try {
                const resp = await send<FactionGeneralData[], null>(HubKey.GetFactionsAll, null)

                if (resp) {
                    setFactionsData(resp)
                    return true
                } else {
                    throw new Error()
                }
            } catch (e) {
                setFactionsData(undefined)
                return false
            }
        })()
    }, [send, state])

    if (!factionsData) {
        return (
            <Stack alignItems="center" sx={{ position: "relative", width: 130 }}>
                <CircularProgress size={20} />
            </Stack>
        )
    }

    return (
        <BarExpandable
            noDivider
            barName={"enlist"}
            iconComponent={
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        backgroundImage: `url(${RedMountainLogo})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: "#C52A1F",
                        borderRadius: 1,
                        border: `${"#C52A1F"} 2px solid`,
                    }}
                />
            }
        >
            <Stack direction="row" alignItems="center" sx={{ mx: 1.5, height: "100%" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        position: "relative",
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            height: 4,
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: colors.darkNeonBlue,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Typography>Enlist:</Typography>

                    {factionsData.map((f) => (
                        <EnlistButton key={f.id} faction={f} gameBarBaseProps={props} />
                    ))}
                </Stack>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: 23,
                        my: "auto !important",
                        ml: 3,
                        borderColor: colors.darkGrey,
                        borderRightWidth: 1.6,
                    }}
                />
            </Stack>
        </BarExpandable>
    )
}
