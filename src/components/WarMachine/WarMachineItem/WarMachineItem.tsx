import { Box, IconButton, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { ClipThing, HealthShieldBars, SkillBar, WarMachineAbilitiesPopover, WarMachineDestroyedInfo } from "../.."
import { GenericWarMachinePNG, SvgInfoCircular, SvgSkull } from "../../../assets"
import { useAuth, useMiniMap, useMobile, useSupremacy } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { GameAbility, WarMachineState } from "../../../types"
import { MoveCommand } from "./MoveCommand"

// in rems
const WIDTH_AVATAR = 8.6
const WIDTH_BODY = 17
const HEIGHT = 8
export const DEAD_OPACITY = 0.6
export const WIDTH_SKILL_BUTTON = 3.8
export const WIDTH_STAT_BAR = 1.5

export const WarMachineItem = ({ warMachine, scale, initialExpanded = false }: { warMachine: WarMachineState; scale: number; initialExpanded?: boolean }) => {
    const { isMobile } = useMobile()
    const { userID, factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { highlightedMechHash, setHighlightedMechHash } = useMiniMap()

    const { hash, participantID, factionID: wmFactionID, name, imageAvatar, tier, ownedByID } = warMachine

    // Subscribe to war machine ability updates
    const gameAbilities = useGameServerSubscriptionAbilityFaction<GameAbility[] | undefined>({
        URI: `/mech/${participantID}`,
        key: GameServerKeys.SubWarMachineAbilitiesUpdated,
        ready: factionID === wmFactionID && !!participantID,
    })

    const [isAlive, toggleIsAlive] = useToggle(true)
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded)
    const faction = getFaction(wmFactionID)

    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()
    const [isDestroyedInfoOpen, toggleIsDestroyedInfoOpen] = useToggle()
    const maxAbilityPriceMap = useRef<Map<string, BigNumber>>(new Map<string, BigNumber>())

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const isOwnFaction = useMemo(() => factionID == warMachine.factionID, [factionID, warMachine])
    const numSkillBars = useMemo(() => gameAbilities?.length || 0, [gameAbilities])
    const selfOwned = useMemo(() => ownedByID === userID, [ownedByID, userID])
    const primaryColor = useMemo(() => (selfOwned ? colors.gold : faction.primary_color), [faction.primary_color, selfOwned])
    const secondaryColor = useMemo(() => (selfOwned ? "#000000" : faction.secondary_color), [faction.secondary_color, selfOwned])
    const backgroundColor = useMemo(() => faction.background_color, [faction.background_color])

    // Highlighting on the map
    const handleClick = useCallback(() => {
        if (hash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
        } else {
            setHighlightedMechHash(hash)
        }
    }, [hash, highlightedMechHash, setHighlightedMechHash])

    // Toggle out isExpanded if other mech is highlighted
    useEffect(() => {
        if (highlightedMechHash !== hash) {
            toggleIsExpanded(initialExpanded)
        } else {
            toggleIsExpanded(true)
        }
    }, [highlightedMechHash, initialExpanded, isMobile, setHighlightedMechHash, toggleIsExpanded, hash])

    return (
        <>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "relative",
                    height: "100%",
                    opacity: isAlive ? 1 : 0.8,
                    width: `${
                        WIDTH_AVATAR +
                        (isExpanded ? WIDTH_BODY : 2 * WIDTH_STAT_BAR) +
                        (isOwnFaction ? WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_STAT_BAR : 0) +
                        (warMachine.ownedByID === userID ? WIDTH_SKILL_BUTTON + WIDTH_STAT_BAR : 0)
                    }rem`,
                    transition: "width .1s",
                    transform: highlightedMechHash === hash ? `scale(${scale * 1.08})` : `scale(${scale})`,
                    transformOrigin: isMobile ? "0 0" : "center",
                }}
            >
                {/* Little info button to show the mech destroyed info */}
                {!isAlive && (
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
                    sx={{ zIndex: 2 }}
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
                                right: ".8rem",
                                px: ".3rem",
                                backgroundColor: "#00000090",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                {warMachine.participantID}
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
                            onClick={handleClick}
                            sx={{
                                flex: 1,
                                position: "relative",
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
                                    lineHeight: 1,
                                    fontWeight: "fontWeightBold",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "normal",
                                    display: "-webkit-box",
                                    overflowWrap: "anywhere",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                }}
                            >
                                {name || hash}
                            </Typography>
                        </Stack>
                    )}

                    {/* Health and shield bars */}
                    <HealthShieldBars warMachine={warMachine} toggleIsAlive={toggleIsAlive} />

                    {/* Mech abilities */}
                    {gameAbilities && gameAbilities.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: `${WIDTH_SKILL_BUTTON}rem`,
                                    height: "100%",
                                    backgroundColor: primaryColor,
                                    boxShadow: 2,
                                    cursor: isAlive ? "pointer" : "auto",
                                    zIndex: 3,
                                    opacity: isAlive ? 1 : DEAD_OPACITY,
                                    ":hover #warMachineSkillsText": {
                                        letterSpacing: isAlive ? 2.3 : 1,
                                    },
                                }}
                                onClick={() => {
                                    if (!isAlive) return
                                    if (!isExpanded) handleClick()
                                    // Need this time out so that it waits for it expand first then popover, else positioning is wrong
                                    setTimeout(() => togglePopoverOpen(true), 110)
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "2rem",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(-${90}deg)`,
                                        zIndex: 2,
                                    }}
                                >
                                    <Typography
                                        id="warMachineSkillsText"
                                        variant="body1"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            color: secondaryColor,
                                            letterSpacing: 1,
                                            transition: "all .2s",
                                        }}
                                    >
                                        SKILLS
                                    </Typography>
                                </Box>
                            </Box>

                            {gameAbilities
                                .slice()
                                .reverse()
                                .map((ga, index) => (
                                    <SkillBar
                                        key={ga.identity}
                                        participantID={warMachine.participantID}
                                        index={index}
                                        gameAbility={ga}
                                        maxAbilityPriceMap={maxAbilityPriceMap}
                                    />
                                ))}
                        </>
                    )}

                    {warMachine.ownedByID === userID && <MoveCommand isAlive={isAlive} warMachine={warMachine} />}
                </Stack>
            </Stack>

            {gameAbilities && gameAbilities.length > 0 && isAlive && (
                <WarMachineAbilitiesPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    onClose={() => togglePopoverOpen(false)}
                    warMachine={warMachine}
                    gameAbilities={gameAbilities}
                    maxAbilityPriceMap={maxAbilityPriceMap}
                    getFaction={getFaction}
                />
            )}

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
