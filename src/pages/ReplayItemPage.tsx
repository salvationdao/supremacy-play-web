import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg, SvgBack } from "../assets"
import { FancyButton } from "../components"
import { BattleReplayDetails } from "../components/Replays/BattlesReplays/BattleReplayDetails/BattleReplayDetails"
import { fonts, siteZIndex } from "../theme/theme"
import { REPLAY_TABS } from "./ReplayPage"

export const ReplayItemPage = () => {
    const { type, id } = useParams<{ type: REPLAY_TABS; id: string }>()
    const history = useHistory()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    // If invalid url, then redirect to marketplace page
    useEffect(() => {
        if (!Object.values(REPLAY_TABS).includes(type) || !id) goBack()
    }, [goBack, history, id, type])

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
            <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "132rem" }}>
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
    const { type, gid, battleNumber } = useParams<{ type: REPLAY_TABS; battleNumber: string; gid: string }>()

    if (type === REPLAY_TABS.BATTLES && !!battleNumber && !! gid) {
        return <BattleReplayDetails battleNumber={battleNumber} arenaGID={gid} />
    }

    return null
}
