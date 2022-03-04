import { Box, Slide, Stack } from "@mui/material"
import { colors } from "../../theme/theme"
import { WarMachineItem } from "./WarMachineItem"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { useGameServerAuth, useDimension, useGame, useOverlayToggles, useGameServerWebsocket } from "../../containers"
import { ReactElement, useEffect, useMemo } from "react"
import { BoxSlanted } from ".."
import { GameServerKeys } from "../../keys"
import { MINI_MAP_DEFAULT_WIDTH } from "../../constants"

const WIDTH_MECH_ITEM_FACTION_EXPANDED = 370
const WIDTH_MECH_ITEM_OTHER_EXPANDED = 245
const WIDTH_MECH_ITEM_OTHER_COLLAPSED = 120

const ScrollContainer = ({ children }: { children: ReactElement }) => {
    const theme = useTheme<Theme>()

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "hidden",
                overflowX: "auto",
                direction: "ltr",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    height: 4,
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: `${theme.factionTheme.primary}50`,
                    borderRadius: 3,
                },
                transition: "all .2s",
            }}
        >
            <Box sx={{ direction: "ltr" }}>{children}</Box>
        </Box>
    )
}

export const WarMachineStats = () => {
    const { factionID } = useGameServerAuth()
    const { warMachines } = useGame()
    const { state, subscribe } = useGameServerWebsocket()
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { width },
    } = useDimension()
    const { isMapOpen } = useOverlayToggles()

    // Subscribe to the result of the vote
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerWarMachineLocationUpdated, () => console.log(""), null)
    }, [state, subscribe])

    // Determine whether the mech items should be expanded out or collapsed
    const shouldBeExpanded = useMemo(() => {
        let shouldBeExpandedFaction = true
        let shouldBeExpandedOthers = true

        if (!warMachines || warMachines.length <= 0)
            return {
                shouldBeExpandedFaction,
                shouldBeExpandedOthers,
            }

        const factionMechs = warMachines.filter((wm) => wm.factionID == factionID)
        const otherMechs = warMachines.filter((wm) => wm.factionID != factionID)

        if (
            factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
                otherMechs.length * WIDTH_MECH_ITEM_OTHER_EXPANDED >
            width
        ) {
            if (
                factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
                    otherMechs.length * WIDTH_MECH_ITEM_OTHER_COLLAPSED >
                width
            ) {
                shouldBeExpandedFaction = false
                shouldBeExpandedOthers = false
            } else {
                shouldBeExpandedOthers = false
            }
        }

        return { shouldBeExpandedFaction, shouldBeExpandedOthers }
    }, [width, factionID, warMachines])

    if (!warMachines || warMachines.length <= 0) return null

    const factionMechs = warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID == factionID)
    const otherMechs = warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID != factionID)
    const haveFactionMechs = factionMechs.length > 0

    return (
        <Slide in direction="up">
            <Stack
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: isMapOpen ? MINI_MAP_DEFAULT_WIDTH + 20 : 0,
                    zIndex: 13,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                }}
            >
                {haveFactionMechs && (
                    <BoxSlanted
                        clipSize="9px"
                        clipSlantSize="26px"
                        skipLeft
                        sx={{ pl: 2, pr: 4, pt: 2.5, pb: 2, backgroundColor: `${theme.factionTheme.background}95` }}
                    >
                        <ScrollContainer>
                            <Stack spacing={-3} direction="row" alignItems="center" justifyContent="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.8}
                                        shouldBeExpanded={shouldBeExpanded.shouldBeExpandedFaction}
                                    />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </BoxSlanted>
                )}

                {otherMechs.length > 0 && (
                    <Box sx={{ mb: 0.6, pr: 2, pl: haveFactionMechs ? 0 : 1.6, overflow: "hidden" }}>
                        <ScrollContainer>
                            <Stack
                                spacing={haveFactionMechs ? -5.2 : -4.5}
                                direction="row"
                                alignItems="center"
                                sx={{ flex: 1, ml: haveFactionMechs ? -1.4 : 0, pb: haveFactionMechs ? 0 : 0.6 }}
                            >
                                {otherMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={haveFactionMechs ? 0.75 : 0.75}
                                        shouldBeExpanded={shouldBeExpanded.shouldBeExpandedOthers}
                                    />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </Box>
                )}
            </Stack>
        </Slide>
    )
}
