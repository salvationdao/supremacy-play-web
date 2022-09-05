import { Box, Stack, Tooltip, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useAuth } from "../../containers"
import { useUrlQuery } from "../../hooks"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { NavLink } from "./NavLinks/NavLinks"
export const Tutorial = () => {
    const isTraining = location.pathname.includes("/training")
    const { userID, factionID } = useAuth()
    const [query] = useUrlQuery()

    return (
        <Tooltip
            title={
                <Stack gap=".5rem" alignItems="center">
                    <Typography
                        sx={{
                            fontSize: "1.8rem",
                            p: "1rem",
                            animation: userID && !factionID ? `${zoomEffect(1.05)} 2s infinite` : "unset",
                        }}
                    >
                        Learn how to play and{" "}
                        <Link to="/training?muted=false">
                            <span style={{ color: colors.neonBlue, fontWeight: "bold" }}>start battle training</span>
                        </Link>
                        !
                    </Typography>
                </Stack>
            }
            componentsProps={{
                tooltip: {
                    style: {
                        filter: "drop-shadow(0 3px 3px #00000050)",
                    },
                },
                arrow: {
                    style: {
                        fontSize: "3rem",
                    },
                },
            }}
            arrow
            open={isTraining ? false : !userID || (!factionID && query.get("training") !== "false")}
        >
            <Box>
                <NavLink label="Tutorial" isActive={false} to="/training?muted=false" />
            </Box>
        </Tooltip>
    )
}
