import { Box, Slide, Stack } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { ReactElement, useEffect, useMemo } from "react"
import { BoxSlanted } from ".."
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useDimension, useGame, useGameServerAuth, useGameServerWebsocket, useOverlayToggles } from "../../containers"
import { GameServerKeys } from "../../keys"
import { WarMachineItem } from "./WarMachineItem"

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
                    height: ".4rem",
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
    const { faction_id } = useGameServerAuth()
    const { warMachines } = useGame()
    const { state, subscribe } = useGameServerWebsocket()
    const theme = useTheme<Theme>()
    // const {
    //     streamDimensions: { width },
    // } = useDimension()
    const { isMapOpen } = useOverlayToggles()

    // Subscribe to the result of the vote
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerWarMachineLocationUpdated, () => null, null)
    }, [state, subscribe])

    // Determine whether the mech items should be expanded out or collapsed
    // const shouldBeExpanded = useMemo(() => {
    //     let shouldBeExpandedFaction = true
    //     let shouldBeExpandedOthers = true

    //     if (!warMachines || warMachines.length <= 0)
    //         return {
    //             shouldBeExpandedFaction,
    //             shouldBeExpandedOthers,
    //         }
    //     const factionMechs = warMachines.filter((wm) => wm.factionID == faction_id)
    //     const otherMechs = warMachines.filter((wm) => wm.factionID != faction_id)

    //     if (
    //         factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
    //             otherMechs.length * WIDTH_MECH_ITEM_OTHER_EXPANDED >
    //         width
    //     ) {
    //         if (
    //             factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
    //                 otherMechs.length * WIDTH_MECH_ITEM_OTHER_COLLAPSED >
    //             width
    //         ) {
    //             shouldBeExpandedFaction = false
    //             shouldBeExpandedOthers = false
    //         } else {
    //             shouldBeExpandedOthers = false
    //         }
    //     }

    //     return { shouldBeExpandedFaction, shouldBeExpandedOthers }
    // }, [width, faction_id, warMachines])

    const shouldBeExpanded = {
        shouldBeExpandedFaction: false,
        shouldBeExpandedOthers: false,
    }

    if (!warMachines || warMachines.length <= 0) return null

    const factionMechs = useMemo(
        () => warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID == faction_id),
        [warMachines, faction_id],
    )
    const otherMechs = useMemo(
        () => warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID != faction_id),
        [warMachines, faction_id],
    )
    const haveFactionMechs = useMemo(() => factionMechs.length > 0, [factionMechs])

    return (
        <Slide in direction="up">
            <Stack
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: isMapOpen ? `calc(${MINI_MAP_DEFAULT_SIZE}px + 1.5rem)` : 0,
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
                        sx={{
                            pl: ".96rem",
                            pr: "1.6rem",
                            pt: "2rem",
                            pb: "1.6rem",
                            backgroundColor: `${theme.factionTheme.background}95`,
                        }}
                    >
                        <ScrollContainer>
                            <Stack spacing="-3.2rem" direction="row" alignItems="center" justifyContent="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.75}
                                        shouldBeExpanded={shouldBeExpanded.shouldBeExpandedFaction}
                                    />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </BoxSlanted>
                )}

                {otherMechs.length > 0 && (
                    <Box sx={{ mb: ".48rem", pr: "1.6rem", pl: haveFactionMechs ? 0 : "1.28rem", overflow: "hidden" }}>
                        <ScrollContainer>
                            <Stack
                                spacing={haveFactionMechs ? "-4.96rem" : "-4.4rem"}
                                direction="row"
                                alignItems="center"
                                sx={{
                                    flex: 1,
                                    ml: haveFactionMechs ? "-1.44rem" : 0,
                                    pb: haveFactionMechs ? 0 : ".48rem",
                                }}
                            >
                                {otherMechs
                                    .sort((a, b) => a.factionID.localeCompare(b.factionID))
                                    .map((wm) => (
                                        <Box
                                            key={`${wm.participantID} - ${wm.hash}`}
                                            sx={{ ":not(:last-child)": { pr: "1.6rem" } }}
                                        >
                                            <WarMachineItem
                                                warMachine={wm}
                                                scale={haveFactionMechs ? 0.7 : 0.7}
                                                shouldBeExpanded={shouldBeExpanded.shouldBeExpandedOthers}
                                            />
                                        </Box>
                                    ))}
                            </Stack>
                        </ScrollContainer>
                    </Box>
                )}
            </Stack>
        </Slide>
    )
}
