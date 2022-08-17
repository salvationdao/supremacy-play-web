import { Stack, Typography, useMediaQuery } from "@mui/material"
import { useRouteMatch } from "react-router-dom"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { ROUTES_ARRAY } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { FancyButton } from "../../Common/FancyButton"

export const HIDE_NAV_LINKS_WIDTH = 1550

export const NavLinks = () => {
    const hideNavLinks = useMediaQuery(`(max-width:${HIDE_NAV_LINKS_WIDTH}px)`)
    const { userID } = useAuth()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeRouteID = ""
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeRouteID = r?.matchNavLinkID || ""
    }

    if (hideNavLinks) return null

    return (
        <Stack direction="row" alignItems="center" sx={{ height: "100%", mx: "2rem" }}>
            {ROUTES_ARRAY.map((r) => {
                if (!r.enable || !r.navLink || !r.navLink.enable || ((r.requireAuth || r.requireFaction) && !userID)) return null
                const { id } = r
                const { label } = r.navLink
                const navigateTo = r.path.split("/:")[0]

                return <NavLink key={id} label={label} to={`${navigateTo}`} isActive={activeRouteID === r.matchNavLinkID || location.pathname === r.path} />
            })}
        </Stack>
    )
}

const NavLink = ({ isActive, label, to }: { isActive: boolean; label: string; to: string }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = isActive ? theme.factionTheme.secondary : "#FFFFFF"

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "8px",
                clipSlantSize: "3px",
                backgroundColor: primaryColor,
                opacity: isActive ? 1 : 0.01,
                border: { borderColor: primaryColor, borderThickness: "1px" },
                sx: { position: "relative", height: "3rem" },
            }}
            sx={{ px: "1.6rem", py: ".6rem", color: secondaryColor, height: "100%" }}
            to={to}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap", textAlign: "center", fontFamily: fonts.nostromoBlack, color: secondaryColor }}>
                    {label}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
