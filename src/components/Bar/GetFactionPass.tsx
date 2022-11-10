import { Box } from "@mui/material"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import { useRef } from "react"
import { Link } from "react-router-dom"
import FactionPass from "../../assets/lottie/FactionPass.json"
import { DEV_ONLY } from "../../constants"

export const GetFactionPass = () => {
    const lottieRef = useRef<LottieRefCurrentProps>(null)

    if (!DEV_ONLY) {
        return null
    }

    return (
        <Link style={{ marginRight: "1rem", height: "100%" }} to="/faction-pass/buy">
            <Box
                onMouseEnter={() => {
                    lottieRef.current?.setSpeed(1.3)
                    lottieRef.current?.playSegments([0, 23], true)
                }}
                onMouseLeave={() => lottieRef.current?.goToAndStop(0, true)}
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
        </Link>
    )
}
