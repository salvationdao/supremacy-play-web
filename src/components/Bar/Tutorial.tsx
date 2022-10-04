import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useAuth } from "../../containers"
import { useUrlQuery } from "../../hooks"
import { zoomEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"
import { TooltipHelper } from "../Common/TooltipHelper"
export const Tutorial = () => {
    const isTraining = location.pathname.includes("/training")
    const { userID, factionID } = useAuth()
    const [query] = useUrlQuery()

    return (
        <TooltipHelper
            open={isTraining ? false : !userID || (!factionID && query.get("training") !== "false")}
            placement="bottom"
            color={colors.navy}
            renderNode={
                <Typography
                    variant="body1"
                    sx={{
                        px: "2rem",
                        color: "#FFFFFF",
                        fontFamily: fonts.shareTech,
                        textAlign: "center",
                        animation: userID && !factionID ? `${zoomEffect(1.05)} 2s infinite` : "unset",
                    }}
                >
                    Learn how to play and
                    <br />
                    <Link to="/training?muted=false">
                        <span style={{ color: colors.neonBlue, fontWeight: "bold" }}>start battle training</span>
                    </Link>
                    !
                </Typography>
            }
        >
            <Box>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        backgroundColor: colors.neonBlue,
                        opacity: 1,
                        border: { borderColor: colors.neonBlue, borderThickness: "1px" },
                        sx: { position: "relative", mx: "2rem" },
                    }}
                    sx={{ px: "1.2rem", py: 0, color: colors.darkestNeonBlue }}
                    to="/training?muted=false"
                >
                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: colors.darkestNeonBlue }}>
                        TUTORIAL
                    </Typography>
                </FancyButton>
            </Box>
        </TooltipHelper>
    )
}
