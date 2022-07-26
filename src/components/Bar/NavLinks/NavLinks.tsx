import { Stack, Typography, useMediaQuery } from "@mui/material"
import { Link, useLocation, useRouteMatch } from "react-router-dom"
import { useAuth } from "../../../containers"
import { ROUTES_ARRAY } from "../../../routes"
import { fonts } from "../../../theme/theme"

export const NavLinks = () => {
    const below1370 = useMediaQuery("(max-width:1370px)")
    const { userID } = useAuth()
    const location = useLocation()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeTabID = ""
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeTabID = r?.matchLeftDrawerID || ""
    }

    if (below1370) return null

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="2rem"
            sx={{
                mx: "2.2rem",
                height: "100%",
            }}
        >
            {ROUTES_ARRAY.map((r) => {
                if (!r.leftDrawer || !r.leftDrawer.enable || ((r.requireAuth || r.requireFaction) && !userID)) return null
                const { id } = r
                const { label } = r.leftDrawer
                const navigateTo = r.path.split("/:")[0]

                return (
                    <NavLink
                        key={id}
                        label={label}
                        to={`${navigateTo}${location.hash}`}
                        isActive={activeTabID === r.matchLeftDrawerID || location.pathname === r.path}
                    />
                )
            })}
        </Stack>
    )
}

const NavLink = ({ isActive, label, to }: { isActive: boolean; label: string; to: string }) => {
    return (
        <Link to={to} style={{ height: "100%", position: "relative" }}>
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    height: "100%",
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0.7,
                    transition: "all .1s",
                    ":hover": {
                        opacity: 1,
                    },
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        textAlign: "center",
                        fontFamily: isActive ? fonts.nostromoBlack : fonts.nostromoBold,
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        </Link>
    )
}
