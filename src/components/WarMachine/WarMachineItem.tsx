import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { BoxSlanted, ClipThing, HealthShieldBars, SkillBar, TooltipHelper, WarMachineAbilitiesPopover, WarMachineDestroyedInfo } from ".."
import { GenericWarMachinePNG, SvgInfoCircular, SvgSkull } from "../../assets"
import { useAuth, useMiniMap, useSupremacy } from "../../containers"
import { getRarityDeets } from "../../helpers"
import { useToggle } from "../../hooks"
import { useGameServerSubscriptionAbilityFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { Faction, GameAbility, WarMachineState } from "../../types"

// in rems
const WIDTH_WM_IMAGE = 9.2
const WIDTH_CENTER = 14.2
export const WIDTH_PER_SLANTED_BAR = 1
export const WIDTH_PER_SLANTED_BAR_ACTUAL = 2.4
const WIDTH_SKILL_BUTTON = 4.3
const HEIGHT = 7.6

const SKILL_BUTTON_TEXT_ROTATION = 78.5
const DEAD_OPACITY = 0.6

export const WarMachineItem = ({ warMachine, scale }: { warMachine: WarMachineState; scale: number }) => {
    const { userID, factionID } = useAuth()
    const { battleIdentifier, getFaction } = useSupremacy()
    const { highlightedMechHash, setHighlightedMechHash } = useMiniMap()

    const { hash, participantID, factionID: wmFactionID, name, imageAvatar, tier, ownedByID } = warMachine

    // Subscribe to war machine ability updates
    const gameAbilities = useGameServerSubscriptionAbilityFaction<GameAbility[] | undefined>({
        URI: `/mech/${participantID}`,
        key: GameServerKeys.SubWarMachineAbilitiesUpdated,
        ready: factionID === wmFactionID && !!participantID,
    })

    const [isAlive, toggleIsAlive] = useToggle(true)
    const [isExpanded, toggleIsExpanded] = useToggle(false)
    const faction = getFaction(wmFactionID)

    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()
    const [isDestroyedInfoOpen, toggleIsDestroyedInfoOpen] = useToggle()
    const maxAbilityPriceMap = useRef<Map<string, BigNumber>>(new Map<string, BigNumber>())

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const isOwnFaction = useMemo(() => factionID == warMachine.factionID, [factionID, warMachine])
    const numSkillBars = useMemo(() => (gameAbilities ? gameAbilities.length : 0), [gameAbilities])

    const owned = useMemo(() => ownedByID === userID, [ownedByID, userID])
    const primaryColor = owned ? colors.gold : faction.primary_color
    const secondaryColor = owned ? "#000000" : faction.secondary_color

    const handleClick = useCallback(() => {
        if (hash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
        } else setHighlightedMechHash(hash)
    }, [hash, highlightedMechHash, setHighlightedMechHash])

    const openSkillsPopover = useCallback(() => {
        // Need this time out so that it waits for it expand first then popover, else positioning is wrong
        setTimeout(() => {
            togglePopoverOpen(true)
        }, 300)
    }, [togglePopoverOpen])

    useEffect(() => {
        if (battleIdentifier) toggleIsAlive(true)
    }, [battleIdentifier, toggleIsAlive])

    /* Toggle out isExpanded if other mech is highlighted */
    useEffect(() => {
        if (highlightedMechHash !== warMachine.hash) {
            toggleIsExpanded(false)
        } else {
            toggleIsExpanded(true)
            openSkillsPopover()
        }
    }, [highlightedMechHash, openSkillsPopover, toggleIsExpanded, warMachine.hash])

    return (
        <BoxSlanted key={`WarMachineItem-${participantID}`} clipSlantSize="14px" sx={{ transform: `scale(${scale})` }}>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "relative",
                    opacity: isAlive ? 1 : 0.8,
                    width: `${
                        isOwnFaction
                            ? isExpanded
                                ? WIDTH_WM_IMAGE + WIDTH_CENTER + WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_PER_SLANTED_BAR
                                : WIDTH_WM_IMAGE +
                                  (2 * WIDTH_PER_SLANTED_BAR + 0.8) +
                                  (numSkillBars > 0 ? WIDTH_SKILL_BUTTON + (numSkillBars - 1) * WIDTH_PER_SLANTED_BAR - 0.7 : 0)
                            : isExpanded
                            ? WIDTH_WM_IMAGE + WIDTH_CENTER
                            : WIDTH_WM_IMAGE + 2 * WIDTH_PER_SLANTED_BAR + 0.8
                    }rem`,
                    transition: "width .3s",
                }}
            >
                {!isAlive && (
                    <Box
                        onClick={() => toggleIsDestroyedInfoOpen()}
                        sx={{
                            position: "absolute",
                            top: ".15rem",
                            left: `${WIDTH_WM_IMAGE - 2}rem`,
                            px: ".56rem",
                            py: ".4rem",
                            opacity: 0.83,
                            cursor: "pointer",
                            ":hover": {
                                opacity: 1,
                                transform: "scale(1.1)",
                            },
                            ":active": {
                                transform: "scale(1)",
                            },
                            zIndex: 99,
                        }}
                    >
                        <SvgInfoCircular fill={"white"} size="1.5rem" />
                    </Box>
                )}

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

                <ClipThing
                    clipSize="8px"
                    clipSlantSize="12px"
                    border={{ isFancy: false, borderColor: primaryColor, borderThickness: ".4rem" }}
                    sx={{ zIndex: 2 }}
                    corners={{
                        topRight: !isExpanded,
                        bottomLeft: true,
                    }}
                    innerSx={{ background: `linear-gradient(${primaryColor}, #000000)` }}
                >
                    <Box>
                        <Box
                            onClick={handleClick}
                            sx={{
                                position: "relative",
                                width: `${WIDTH_WM_IMAGE}rem`,
                                height: `${HEIGHT}rem`,
                                overflow: "hidden",
                                backgroundImage: `url(${wmImageUrl})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                cursor: "pointer",
                            }}
                        >
                            <TooltipHelper text={`Rarity: ${rarityDeets.label}`} placement="right">
                                <Stack
                                    direction="row"
                                    spacing=".08rem"
                                    sx={{
                                        position: "absolute",
                                        bottom: -9,
                                        left: ".4rem",
                                        height: "4.2rem",
                                        transform: "rotate(-40deg)",
                                        zIndex: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 5,
                                            height: "100%",
                                            backgroundColor: rarityDeets.color,
                                            border: "#00000090 1.5px solid",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 5,
                                            height: "100%",
                                            backgroundColor: rarityDeets.color,
                                            border: "#00000090 1.5px solid",
                                        }}
                                    />
                                </Stack>
                            </TooltipHelper>

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
                                    opacity: isAlive ? 0 : 1,
                                    transition: "all .2s",
                                    zIndex: 2,
                                    ":hover": {
                                        opacity: isAlive ? 0.2 : 1,
                                    },
                                }}
                            >
                                {!isAlive && <SvgSkull size="100%" />}
                            </Stack>
                        </Box>
                    </Box>
                </ClipThing>

                <Stack direction="row" alignSelf="stretch" flex={1} sx={{ position: "relative" }}>
                    <Stack
                        justifyContent="flex-end"
                        sx={{
                            flex: 1,
                            position: "relative",
                            alignSelf: "stretch",
                            ml: "-2rem",

                            backgroundColor: !isExpanded ? "transparent" : highlightedMechHash === warMachine.hash ? `${primaryColor}60` : "#00000056",
                            opacity: isAlive ? 1 : DEAD_OPACITY,
                            zIndex: 1,
                        }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing=".8rem"
                            sx={{ flex: 1, pl: isExpanded ? "2.8rem" : 0, pr: isExpanded ? "1.68rem" : 0 }}
                        >
                            <HealthShieldBars warMachine={warMachine} type={isExpanded ? "horizontal" : "vertical"} toggleIsAlive={toggleIsAlive} />

                            {isExpanded && (
                                <Box
                                    sx={{
                                        width: "2.6rem",
                                        height: "2.6rem",
                                        backgroundImage: `url(${faction.logo_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />
                            )}
                        </Stack>

                        {isExpanded && (
                            <Stack
                                justifyContent="center"
                                sx={{
                                    pl: "1.76rem",
                                    pr: "1.84rem",
                                    py: ".56rem",
                                    height: "3.3rem",
                                    backgroundColor: `${faction.background_color}95`,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1,
                                        fontWeight: "fontWeightBold",
                                        fontFamily: fonts.nostromoBlack,
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
                    </Stack>

                    {gameAbilities && gameAbilities.length > 0 && (
                        <>
                            <BoxSlanted
                                clipSlantSize="14px"
                                onClick={
                                    isAlive
                                        ? () => {
                                              if (!isExpanded) handleClick()
                                              openSkillsPopover()
                                          }
                                        : undefined
                                }
                                sx={{
                                    position: "relative",
                                    width: `${WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_PER_SLANTED_BAR}rem`,
                                    alignSelf: "stretch",
                                    ml: "-1.5rem",
                                    backgroundColor: primaryColor,
                                    boxShadow: 3,
                                    cursor: isAlive ? "pointer" : "auto",
                                    ":hover #warMachineSkillsText": {
                                        letterSpacing: isAlive ? 2.3 : 1,
                                    },
                                    zIndex: 3,
                                    opacity: isAlive ? 1 : DEAD_OPACITY,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "2.2rem",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(-${SKILL_BUTTON_TEXT_ROTATION}deg)`,
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
                            </BoxSlanted>

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
        </BoxSlanted>
    )
}
