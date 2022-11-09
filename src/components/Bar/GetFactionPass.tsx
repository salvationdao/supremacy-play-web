import { Box } from "@mui/material"
import { Link } from "react-router-dom"
import { BCDailyPassArrowPNG } from "../../assets"
import { DEV_ONLY } from "../../constants"

export const GetFactionPass = () => {
    if (!DEV_ONLY) {
        return null
    }

    return (
        <Link style={{ marginRight: "1rem", height: "100%", paddingBottom: ".2rem" }} to="/faction-pass/buy">
            <Box
                sx={{
                    cursor: "pointer",
                    width: "20rem",
                    height: "100%",
                    background: `url(${BCDailyPassArrowPNG})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right center",
                    backgroundSize: "contain",
                    transition: "all .2s",

                    ":hover": {
                        transform: "scale(1.05)",
                    },
                }}
            />
        </Link>
    )
}
