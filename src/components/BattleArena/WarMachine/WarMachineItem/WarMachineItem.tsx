import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, HealthShieldBars, WarMachineDestroyedInfo } from "../../.."
import { GenericWarMachinePNG, SvgInfoCircular, SvgSkull } from "../../../../assets"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../constants"
import { useAuth, useMiniMapPixi, useMobile, useSupremacy } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { CropMaxLengthText } from "../../../../theme/styles"
import { colors, fonts } from "../../../../theme/theme"
import { AIType, WarMachineState } from "../../../../types"

// in rems
const WIDTH_AVATAR = 8.6
const WIDTH_BODY = 25
const HEIGHT = 8
export const DEAD_OPACITY = 0.6
export const WIDTH_STAT_BAR = 1.5

export const WarMachineItem = ({
    warMachine,
    scale,
    initialExpanded = false,
    transformOrigin,
    label,
}: {
    warMachine: WarMachineState
    scale: number
    initialExpanded?: boolean
    transformOrigin?: string
    label?: number
}) => {
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()
    const { highlightedMechParticipantID, setHighlightedMechParticipantID, miniMapHotkeyRecord, miniMapControlHotkeyRecord } = useMiniMapPixi()

    const { hash, participantID, factionID: wmFactionID, name, imageAvatar, tier, ownedByID, ownerUsername, aiType } = warMachine
    const isMiniMech = aiType === AIType.MiniMech

    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded)
    const faction = getFaction(wmFactionID)

    const [isDestroyedInfoOpen, toggleIsDestroyedInfoOpen] = useToggle()

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const selfOwned = useMemo(() => ownedByID === userID, [ownedByID, userID])
    const primaryColor = useMemo(() => (selfOwned ? colors.gold : faction.primary_color), [faction.primary_color, selfOwned])
    const backgroundColor = useMemo(() => faction.background_color, [faction.background_color])

    // Highlighting on the map
    const handleClick = useCallback(() => {
        if (!label) return
        if (participantID > ADD_MINI_MECH_PARTICIPANT_ID) {
            miniMapControlHotkeyRecord.current[label.toString()]?.()
            return
        }
        miniMapHotkeyRecord.current[label.toString()]?.()
    }, [label, participantID, miniMapHotkeyRecord, miniMapControlHotkeyRecord])

    // Toggle out isExpanded if other mech is highlighted
    useEffect(() => {
        if (highlightedMechParticipantID !== participantID) {
            toggleIsExpanded(initialExpanded)
        } else {
            toggleIsExpanded(true)
        }
    }, [highlightedMechParticipantID, initialExpanded, isMobile, setHighlightedMechParticipantID, toggleIsExpanded, participantID])

    return (
        <>
            <Stack
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "relative",
                    height: "100%",
                    opacity: isAlive ? 1 : 0.8,
                    width: `${WIDTH_AVATAR + (isExpanded ? WIDTH_BODY : 2 * WIDTH_STAT_BAR)}rem`,
                    pointerEvents: "all",
                    transition: "width .1s",
                    transform: `scale(${scale})`,
                    transformOrigin: transformOrigin || "center",
                }}
            >
                <Box sx={{ position: "absolute", top: "-3rem", right: 0 }}>
                    {label && (
                        <Typography sx={{ color: primaryColor }}>
                            <i>
                                <strong>[{participantID > 100 ? `CTRL + ${label}` : label}]</strong>
                            </i>
                        </Typography>
                    )}
                </Box>

                {/* Little info button to show the mech destroyed info */}
                {!isAlive && !isMiniMech && (
                    <IconButton
                        size="small"
                        onClick={() => toggleIsDestroyedInfoOpen()}
                        sx={{
                            position: "absolute",
                            top: ".15rem",
                            left: `${WIDTH_AVATAR - 2}rem`,
                            px: ".56rem",
                            py: ".4rem",
                            opacity: 0.83,
                            zIndex: 99,
                        }}
                    >
                        <SvgInfoCircular fill={"white"} size="1.5rem" />
                    </IconButton>
                )}

                {/* The underline at the bottom */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        left: "1rem",
                        height: ".3rem",
                        backgroundColor: primaryColor,
                        zIndex: 9,
                        opacity: isAlive ? 1 : DEAD_OPACITY,
                    }}
                />

                {/* Mech avatar image */}
                <ClipThing
                    clipSize="8px"
                    corners={{ bottomLeft: true }}
                    border={{ isFancy: false, borderColor: primaryColor, borderThickness: ".25rem" }}
                    backgroundColor={primaryColor}
                    sx={{ zIndex: 2, flexShrink: 0 }}
                    innerSx={{ background: `linear-gradient(${primaryColor}, #000000)` }}
                >
                    <Box
                        onClick={handleClick}
                        sx={{
                            position: "relative",
                            width: `${WIDTH_AVATAR}rem`,
                            height: `${HEIGHT}rem`,
                            overflow: "hidden",
                            backgroundImage: `url(${wmImageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            cursor: "pointer",
                        }}
                    >
                        {/* Number */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: ".2rem",
                                px: ".3rem",
                                backgroundColor: "#00000090",
                            }}
                        >
                            <Typography variant="h4" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                {label}
                            </Typography>
                        </Box>

                        {!isAlive && (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: "2.64rem",
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: "linear-gradient(#00000090, #000000)",
                                    transition: "all .2s",
                                    zIndex: 2,
                                }}
                            >
                                <SvgSkull size="100%" />
                            </Stack>
                        )}
                    </Box>
                </ClipThing>

                <Stack direction="row" alignSelf="stretch" sx={{ flex: 1, position: "relative" }}>
                    {/* Mech rarity and name */}
                    {isExpanded && (
                        <Stack
                            sx={{
                                flex: 1,
                                position: "relative",
                                width: `${WIDTH_BODY}rem`,
                                height: "100%",
                                px: "1rem",
                                py: ".6rem",
                                cursor: "pointer",
                                background: `linear-gradient(${backgroundColor}BB 25%, ${backgroundColor}90, ${primaryColor}55)`,
                                opacity: isAlive ? 1 : DEAD_OPACITY,
                                zIndex: 1,
                            }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: rarityDeets.color }}>{rarityDeets.label}</Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: ".3rem",
                                    lineHeight: 1,
                                    fontWeight: "fontWeightBold",
                                    whiteSpace: "normal",
                                    ...CropMaxLengthText,
                                }}
                            >
                                {isMiniMech ? "Support Machine" : name || hash}
                            </Typography>

                            {!isMiniMech && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        lineHeight: 1,
                                        whiteSpace: "normal",
                                        ...CropMaxLengthText,
                                    }}
                                >
                                    @{ownerUsername}
                                </Typography>
                            )}
                        </Stack>
                    )}
                    {/* Health and shield bars */}
                    <HealthShieldBars warMachine={warMachine} setIsAlive={setIsAlive} />
                </Stack>
            </Stack>

            {!isAlive && isDestroyedInfoOpen && (
                <WarMachineDestroyedInfo
                    warMachine={warMachine}
                    open={isDestroyedInfoOpen}
                    onClose={() => toggleIsDestroyedInfoOpen(false)}
                    getFaction={getFaction}
                />
            )}
        </>
    )
}
