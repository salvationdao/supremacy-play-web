import { Box, Stack } from "@mui/material"
import React, { useEffect, useState } from "react"
import { SvgAbility, SvgHistoryClock } from "../assets"
import { BattleEndScreen, BigDisplay, Controls, EarlyAccessWarning, Notifications, SupporterAbilities, WarMachineStats } from "../components"
import { PlayerAbilities } from "../components/LeftDrawer/BattleArena/PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "../components/LeftDrawer/BattleArena/QuickPlayerAbilities/QuickPlayerAbilities"
import { BattleArenaCountDown } from "../components/Maintenance/BattleArenaCountDown"
import { BATTLE_ARENA_OPEN } from "../constants"
import { useAuth, useDimension, useMobile } from "../containers"
import { siteZIndex } from "../theme/theme"

export const BattleArenaPage = () => {
    const { userID } = useAuth()
    const [understand, setUnderstand] = useState(true)

    useEffect(() => {
        if (!userID) return
        setUnderstand(localStorage.getItem(`understand1-${userID}`) === "true")
    }, [userID])

    if (!understand && userID) {
        return (
            <EarlyAccessWarning
                onAcknowledged={() => {
                    localStorage.setItem(`understand1-${userID}`, "true")
                    setUnderstand(true)
                }}
            />
        )
    }

    if (!BATTLE_ARENA_OPEN) {
        return <BattleArenaCountDown />
    }

    return <BattleArenaPageInner />
}

const BattleArenaPageInner = React.memo(function BattleArenaPageInner() {
    const { isMobile, setAdditionalTabs, setIsNavOpen, allowCloseNav } = useMobile()
    const { triggerReset } = useDimension()

    // When its mobile, we have tabs
    useEffect(() => {
        triggerReset()

        if (!isMobile) return
        allowCloseNav.current = false

        const tabs = [
            {
                id: "battle-arena",
                icon: <SvgAbility size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BATTLE ARENA",
                requireAuth: false,
                onlyShowOnRoute: "",
                mountAllTime: true,
                Component: () => (
                    <Stack sx={{ height: "100%" }}>
                        {/* <Notifications /> */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: ".4rem",
                                mr: ".8rem",
                                pr: ".1rem",
                                mt: ".6rem",
                                mb: "2rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: "1rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: (theme) => theme.factionTheme.primary,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: 0 }}>
                                <Stack direction="row">
                                    <Stack spacing="1.5rem" sx={{ width: "50%", position: "relative", p: ".8rem 1rem" }}>
                                        {/* <MiniMap /> */}
                                        <WarMachineStats />
                                    </Stack>

                                    <Stack spacing="1.5rem" sx={{ width: "50%", position: "relative", p: ".8rem 1rem" }}>
                                        <SupporterAbilities />
                                        <PlayerAbilities />
                                        <QuickPlayerAbilities />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                ),
            },
        ]

        tabs.push({
            id: "prev-battle",
            icon: <SvgHistoryClock size="1.2rem" sx={{ pt: ".1rem" }} />,
            label: "PREVIOUS BATTLE",
            requireAuth: false,
            onlyShowOnRoute: "",
            mountAllTime: true,
            Component: () => (
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <BattleEndScreen />
                </Stack>
            ),
        })

        setAdditionalTabs(tabs)
        setIsNavOpen(true)

        // Remove tabs on unmount
        return () => {
            allowCloseNav.current = true
            setAdditionalTabs([])
            setIsNavOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowCloseNav, isMobile, triggerReset, setAdditionalTabs, setIsNavOpen])

    return (
        <Stack id="battle-arena-all" sx={{ width: "100%", height: "100%", zIndex: siteZIndex.RoutePage }}>
            <Box id="game-ui-container" sx={{ position: "relative", flex: 1, height: 0 }}>
                <BigDisplay />

                {!isMobile && (
                    <>
                        <WarMachineStats />
                        {/*<BattleHistory />*/}
                    </>
                )}

                <Notifications />
            </Box>

            <Controls />
        </Stack>
    )
})
