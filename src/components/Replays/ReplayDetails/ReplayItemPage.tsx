import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { HangarBg, SvgBack } from "../../../assets"
import { FancyButton } from "../.."
import { ReplayDetails } from "./ReplayDetails"
import { parseString } from "../../../helpers"
import { useUrlQuery } from "../../../hooks"
import { fonts, siteZIndex } from "../../../theme/theme"

export const ReplayItemPage = () => {
    const history = useHistory()

    const goBack = useCallback(() => {
        history.push("/replays")
    }, [history])

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "160rem" }}>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    onClick={goBack}
                >
                    <Stack spacing=".6rem" direction="row" alignItems="center">
                        <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            GO BACK
                        </Typography>
                    </Stack>
                </FancyButton>

                <ReplayItemPageInner />
            </Stack>
        </Stack>
    )
}

const ReplayItemPageInner = () => {
    const [query] = useUrlQuery()
    const history = useHistory()
    const gid = query.get("gid") ? parseString(query.get("gid"), -1) : undefined
    const battleNumber = query.get("battleNumber") ? parseString(query.get("battleNumber"), -1) : undefined

    useEffect(() => {
        // If the page is invalid, redirect to /replays
        if (gid === undefined || battleNumber === undefined) {
            history.push("/replays")
        }
    }, [battleNumber, gid, history])

    if (gid === undefined || battleNumber === undefined) {
        return null
    }

    return <ReplayDetails gid={gid} battleNumber={battleNumber} />
}
