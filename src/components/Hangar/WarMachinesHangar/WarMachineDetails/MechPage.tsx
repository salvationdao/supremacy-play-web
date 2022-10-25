import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg, SvgBack } from "../../../../assets"
import { FancyButton } from "../../.."
import { WarMachineHangarDetails } from "./WarMachineHangarDetails"
import { fonts, siteZIndex } from "../../../../theme/theme"

export const MechPage = () => {
    const history = useHistory()
    const { mechID } = useParams<{ mechID: string }>()
    const drawerContainerRef = useRef<HTMLElement>()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    // Make sure we have a mechID passed in, else redirect to /fleet page
    useEffect(() => {
        if (!mechID) history.replace(`/fleet`)
    }, [history, mechID])

    return (
        <Stack
            ref={drawerContainerRef}
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
            <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "193rem" }}>
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

                <WarMachineHangarDetails drawerContainerRef={drawerContainerRef} mechID={mechID} />
            </Stack>
        </Stack>
    )
}
