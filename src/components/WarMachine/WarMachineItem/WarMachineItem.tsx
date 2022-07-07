import { Box, IconButton, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, HealthShieldBars, SkillBar, WarMachineAbilitiesPopover, WarMachineDestroyedInfo } from "../.."
import { GenericWarMachinePNG, SvgInfoCircular, SvgSkull } from "../../../assets"
import { useAuth, useMiniMap, useSnackbar, useSupremacy } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionAbilityFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { AIType, GameAbility, WarMachineState } from "../../../types"
import { MechMoveCommand, MechMoveCommandAbility } from "../WarMachineAbilitiesPopover/MechMoveCommandCard"

// in rems
const WIDTH_AVATAR = 8.6
const WIDTH_BODY = 17
const HEIGHT = 8
const DEAD_OPACITY = 0.6
const WIDTH_SKILL_BUTTON = 3.5
export const WIDTH_STAT_BAR = 1.5

export const WarMachineItem = ({ warMachine, scale }: { warMachine: WarMachineState; scale: number }) => {
    const { userID, factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { highlightedMechHash, setHighlightedMechHash } = useMiniMap()

    const { hash, participantID, factionID: wmFactionID, name, imageAvatar, tier, ownedByID, aiType } = warMachine
    const isMiniMech = aiType === AIType.MiniMech

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
    const numSkillBars = useMemo(() => gameAbilities?.length || 0, [gameAbilities])
    const selfOwned = useMemo(() => ownedByID === userID, [ownedByID, userID])
    const primaryColor = useMemo(() => (selfOwned ? colors.gold : faction.primary_color), [faction.primary_color, selfOwned])
    const secondaryColor = useMemo(() => (selfOwned ? "#000000" : faction.secondary_color), [faction.secondary_color, selfOwned])
    const backgroundColor = useMemo(() => faction.background_color, [faction.background_color])

    // Need this time out so that it waits for it expand first then popover, else positioning is wrong
    const openSkillsPopover = useCallback(() => {
        setTimeout(() => {
            togglePopoverOpen(true)
        }, 110)
    }, [togglePopoverOpen])

    // Highlighting on the map
    const handleClick = useCallback(() => {
        if (hash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
        } else setHighlightedMechHash(hash)
    }, [hash, highlightedMechHash, setHighlightedMechHash])

    // Toggle out isExpanded if other mech is highlighted
    useEffect(() => {
        if (highlightedMechHash !== warMachine.hash) {
            toggleIsExpanded(false)
        } else {
            toggleIsExpanded(true)
            openSkillsPopover()
        }
    }, [highlightedMechHash, openSkillsPopover, toggleIsExpanded, warMachine.hash])

    const mechAbilityButton = useMemo(
        () =>
            (isMiniMech || (gameAbilities && gameAbilities.length > 0)) && (
                <MechAbilityButton
                    onClick={handleClick}
                    openSkillsPopover={openSkillsPopover}
                    warMachine={warMachine}
                    factionID={factionID}
                    isAlive={isAlive}
                    isMiniMech={isMiniMech}
                    isExpanded={isExpanded}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    backgroundColor={backgroundColor}
                />
            ),
        [backgroundColor, factionID, gameAbilities, handleClick, isAlive, isExpanded, isMiniMech, openSkillsPopover, primaryColor, secondaryColor, warMachine],
    )

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
                        WIDTH_AVATAR + (isExpanded ? WIDTH_BODY : 2 * WIDTH_STAT_BAR) + (isOwnFaction ? WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_STAT_BAR : 0)
                    }rem`,
                    transition: "width .1s",
                    transform: `scale(${scale})`,
                }}
            >
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
                                {isMiniMech ? "Mini Mech" : name || hash}
                            </Typography>
                        </Stack>
                    )}

                    {/* Health and shield bars */}
                    <HealthShieldBars warMachine={warMachine} toggleIsAlive={toggleIsAlive} />

                    {/* Mech abilities */}
                    {mechAbilityButton}

                    {gameAbilities &&
                        gameAbilities.length > 0 &&
                        gameAbilities
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

interface MechAbilityButtonProps {
    onClick: () => void
    openSkillsPopover: () => void
    warMachine: WarMachineState
    factionID: string
    isAlive: boolean
    isMiniMech: boolean
    isExpanded: boolean
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
}

const MechAbilityButton = ({
    onClick: handleClick,
    openSkillsPopover,
    warMachine,
    factionID,
    isAlive,
    isMiniMech,
    isExpanded,
    primaryColor,
    secondaryColor,
    backgroundColor,
}: MechAbilityButtonProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useSnackbar()
    const { setPlayerAbility } = useMiniMap()

    const [mechMoveCommand, setMechMoveCommand] = useState<MechMoveCommand>()
    const isMoving = useMemo(() => mechMoveCommand && mechMoveCommand.cell_x !== undefined && mechMoveCommand.cell_y !== undefined, [mechMoveCommand])
    const isCancelled = useMemo(() => mechMoveCommand && !!mechMoveCommand.cancelled_at, [mechMoveCommand])

    const { hash, factionID: wmFactionID, participantID } = warMachine

    useGameServerSubscriptionFaction<MechMoveCommand>(
        {
            URI: `/mech_command/${hash}`,
            key: GameServerKeys.SubMechMoveCommand,
            ready: factionID === wmFactionID && !!participantID,
        },
        (payload) => {
            if (!payload) return
            setMechMoveCommand(payload)
        },
    )

    const onActivate = useCallback(() => {
        setPlayerAbility({
            id: "mech_move_command",
            blueprint_id: "mech_move_command",
            count: 1,
            last_purchased_at: new Date(),
            mechHash: hash,
            ability: { ...MechMoveCommandAbility, text_colour: backgroundColor || "#222222", colour: primaryColor || "#FFFFFF" },
        })
    }, [backgroundColor, hash, primaryColor, setPlayerAbility])

    const onCancel = useCallback(async () => {
        if (!mechMoveCommand) return
        try {
            await send(GameServerKeys.MechMoveCommandCancel, {
                move_command_id: mechMoveCommand.id,
                hash,
            })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed cancel mech move command."
            newSnackbarMessage(message, "error")
            console.error(err)
        }
    }, [hash, mechMoveCommand, newSnackbarMessage, send])

    const onClick = useCallback(() => {
        handleClick()
        if (isMoving && !isCancelled) return onCancel()
        return onActivate()
    }, [handleClick, isMoving, isCancelled, onCancel, onActivate])

    return (
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
                if (isMiniMech) {
                    onClick()
                    return
                }
                if (!isExpanded) handleClick()
                openSkillsPopover()
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
                    variant={isMiniMech ? "h6" : "body1"}
                    sx={{
                        fontWeight: "fontWeightBold",
                        fontFamily: fonts.shareTechMono,
                        letterSpacing: 1,
                        color: secondaryColor,
                        transition: "all .2s",
                    }}
                >
                    {isMiniMech ? "MOVE" : "SKILLS"}
                </Typography>
            </Box>
        </Box>
    )
}
