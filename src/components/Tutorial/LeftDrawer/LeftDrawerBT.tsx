import { Box, Drawer, Fade } from "@mui/material"
import { useEffect, useRef } from "react"
import { DRAWER_TRANSITION_DURATION } from "../../../constants"
import { useDimension, useMobile, useTraining } from "../../../containers"
import { colors, siteZIndex } from "../../../theme/theme"
import { BattleAbilityStages, MechAbilityStages, PlayerAbilityStages, TrainingLobby } from "../../../types"
import { BattleArenaBT } from "./BattleArena/BattleArenaBT"

export const LEFT_DRAWER_WIDTH = 44 // rem

export const LeftDrawerBT = () => {
    const { isMobile } = useMobile()
    const { trainingStage } = useTraining()
    const { triggerReset } = useDimension()
    const ref = useRef<HTMLDivElement>(null)

    // Dont show in lobby or (mechability lobby unless trainingLocationselect)
    let isOpen = true
    if (
        trainingStage === TrainingLobby.All ||
        trainingStage === BattleAbilityStages.ShowAbilityBA ||
        trainingStage === MechAbilityStages.OverchargeActionMA ||
        trainingStage === PlayerAbilityStages.ShowAbilityPA
    ) {
        isOpen = false
    }

    useEffect(() => {
        triggerReset()
    }, [isOpen, triggerReset])

    // Hide the drawer if on mobile
    if (isMobile) return null
    return (
        <>
            <Drawer
                ref={ref}
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    display: isOpen ? "unset" : "none",
                    flexShrink: 0,
                    width: `${LEFT_DRAWER_WIDTH}rem`,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${LEFT_DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        overflow: "hidden",
                        borderRightWidth: "5px",
                        borderColor: (theme) => `${theme.factionTheme.primary}20`,
                    },
                }}
            >
                <Fade in>
                    <Box
                        sx={{
                            height: "100%",
                        }}
                    >
                        <BattleArenaBT />
                    </Box>
                </Fade>
            </Drawer>
        </>
    )
}
