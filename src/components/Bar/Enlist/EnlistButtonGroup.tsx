import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BarExpandable, EnlistButton } from "../.."
import { RedMountainLogo } from "../../../assets"
import { usePassportServerWebsocket, useSnackbar } from "../../../containers"
import { PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { FactionGeneralData } from "../../../types/passport"

export const EnlistButtonGroup = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = usePassportServerWebsocket()
    const [factionsData, setFactionsData] = useState<FactionGeneralData[]>()

    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        ;(async () => {
            try {
                const resp = await send<FactionGeneralData[], null>(PassportServerKeys.GetFactionsAll, null)

                if (resp) {
                    setFactionsData(resp)
                    return true
                } else {
                    throw new Error()
                }
            } catch (e) {
                setFactionsData(undefined)
                newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve syndicate data.", "error")
                console.debug(e)
                return false
            }
        })()
    }, [send, state])

    if (!factionsData) {
        return (
            <Stack alignItems="center" sx={{ position: "relative", width: "13rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
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
                        width: "2.8rem",
                        height: "2.8rem",
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
            <Stack direction="row" alignItems="center" sx={{ mx: "1.2rem", height: "100%" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="1.6rem"
                    sx={{
                        position: "relative",
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            height: ".4rem",
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
                    <Typography sx={{ fontFamily: "Nostromo Regular Bold" }}>Enlist:</Typography>

                    {factionsData.map((f) => (
                        <EnlistButton key={f.id} faction={f} />
                    ))}
                </Stack>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: "2.3rem",
                        my: "auto !important",
                        ml: "2.4rem",
                        borderColor: "#494949",
                        borderRightWidth: 1.6,
                    }}
                />
            </Stack>
        </BarExpandable>
    )
}
