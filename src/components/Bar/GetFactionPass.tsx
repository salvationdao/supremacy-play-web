import { Box, Typography } from "@mui/material"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import { useRef } from "react"
import { Link } from "react-router-dom"
import FactionPass from "../../assets/lottie/FactionPass.json"
import { DEV_ONLY } from "../../constants"
import { useAuth } from "../../containers"
import { colors } from "../../theme/theme"
import { NiceTooltip } from "../Common/Nice/NiceTooltip"

export const GetFactionPass = () => {
    const { factionPassExpiryDate } = useAuth()
    const lottieRef = useRef<LottieRefCurrentProps>(null)

    if (localStorage.getItem("ivan") !== "cool" && !DEV_ONLY) {
        return null
    }

    return (
        <Link style={{ marginRight: "-1rem", height: "100%" }} to="/faction-pass/buy">
            <Box sx={{ height: "100%" }}>
                <NiceTooltip
                    placement="bottom-start"
                    renderNode={
                        <Typography sx={{ p: ".5rem 1.2rem" }}>
                            {factionPassExpiryDate && factionPassExpiryDate > new Date() ? (
                                <>
                                    Your current Faction Pass is valid until:{" "}
                                    <span style={{ color: colors.neonBlue }}>{factionPassExpiryDate.toLocaleDateString()}</span>
                                </>
                            ) : (
                                "You don't have a Faction Pass."
                            )}
                        </Typography>
                    }
                    parentSx={{ mt: "-2rem" }}
                >
                    <Box
                        onMouseEnter={() => {
                            lottieRef.current?.setSpeed(1.3)
                            lottieRef.current?.playSegments([0, 23], true)
                        }}
                        onMouseLeave={() => {
                            lottieRef.current?.playSegments([23, 0], true)
                        }}
                        sx={{
                            position: "relative",
                            cursor: "pointer",
                            width: "20rem",
                            height: "100%",

                            "&>*": {
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                transform: "translate(0, -50%)",
                            },
                        }}
                    >
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={FactionPass}
                            autoPlay={false}
                            loop={false}
                            onDOMLoaded={() => lottieRef.current?.goToAndStop(0, true)}
                        />
                    </Box>
                </NiceTooltip>
            </Box>
        </Link>
    )
}
