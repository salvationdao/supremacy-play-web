import { Box, Drawer, Fade } from "@mui/material"
import { ReactNode, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { DRAWER_TRANSITION_DURATION, RIGHT_DRAWER_WIDTH } from "../../constants"
import { useMobile } from "../../containers"
import { useToggle } from "../../hooks"
import { HASH_ROUTES_ARRAY, RightDrawerHashes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const RightDrawer = () => {
    const { isMobile } = useMobile()
    const [isDrawerOpen, toggleIsDrawerOpen] = useToggle()
    const location = useLocation()

    useEffect(() => {
        toggleIsDrawerOpen(location.hash !== RightDrawerHashes.None)
    }, [location.hash, toggleIsDrawerOpen])

    if (isMobile) return null

    return (
        <>
            <DrawerButtons />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isDrawerOpen}
                variant="persistent"
                anchor="right"
                sx={{
                    flexShrink: 0,
                    width: isDrawerOpen ? `${RIGHT_DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.RightDrawer,
                    "& .MuiDrawer-paper": {
                        width: `${RIGHT_DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        borderLeft: 0,
                    },
                }}
            >
                {HASH_ROUTES_ARRAY.map((r) => {
                    return (
                        <Content key={r.id} currentHash={location.hash} hash={r.hash}>
                            {r.Component && <r.Component />}
                        </Content>
                    )
                })}
            </Drawer>
        </>
    )
}

const Content = ({ currentHash, hash, children }: { currentHash: string; hash: string; children: ReactNode }) => {
    if (currentHash === hash) {
        return (
            <Fade in>
                <Box id={`right-drawer-content-${hash}`} sx={{ height: "100%" }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
