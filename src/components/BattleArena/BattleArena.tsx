import { Box, Stack } from "@mui/material"
import React, { useEffect, useState } from "react"
import { BattleEndScreen, Controls, EarlyAccessWarningModal, Notifications, SupporterAbilities, WarMachineStats } from ".."
import { SvgAbility, SvgHistoryClock } from "../../assets"
import { BATTLE_ARENA_OPEN } from "../../constants"
import { useAuth, useDimension, useMobile } from "../../containers"
import { LeftRouteID } from "../../routes"
import { siteZIndex } from "../../theme/theme"
import { PlayerAbilities } from "../LeftDrawer/BattleArena/PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "../LeftDrawer/BattleArena/QuickPlayerAbilities/QuickPlayerAbilities"
import { BattleArenaCountDown } from "../Maintenance/BattleArenaCountDown"
import { BigDisplay } from "./BigDisplay/BigDisplay"

export const BattleArena = () => {
    const { userID } = useAuth()
    const [understand, setUnderstand] = useState(true)

    useEffect(() => {
        if (!userID) return
        setUnderstand(localStorage.getItem(`understand1-${userID}`) === "true")
    }, [userID])

    if (!understand && userID) {
        return (
            <EarlyAccessWarningModal
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
                id: LeftRouteID.BattleArena,
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
                            }}
                        >
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
                    </Stack>
                ),
            },
        ]

        tabs.push({
            id: LeftRouteID.PreviousBattle,
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
            <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
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
