import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useRef, useState } from "react"
import {
    BoxSlanted,
    ClipThing,
    HealthShieldBars,
    SkillBar,
    WarMachineAbilitiesPopover,
    WarMachineDestroyedInfo,
} from ".."
import { GenericWarMachinePNG, SvgInfoCircularIcon, SvgSkull } from "../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { useGameServerAuth, useDrawer, useGame, useGameServerWebsocket, WebSocketProperties } from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { GameAbility, WarMachineDestroyedRecord, WarMachineState } from "../../types"

const WIDTH_WM_IMAGE = 92
const WIDTH_CENTER = 142
export const WIDTH_PER_SLANTED_BAR = 12
export const WIDTH_PER_SLANTED_BAR_ACTUAL = 32
const WIDTH_SKILL_BUTTON = 43
const HEIGHT = 76

const SKILL_BUTTON_TEXT_ROTATION = 76.5
const DEAD_OPACITY = 0.6

interface Props {
    warMachine: WarMachineState
    scale: number
    shouldBeExpanded: boolean
}

export const WarMachineItem = (props: Props) => {
    const { state, subscribe } = useGameServerWebsocket()
    const { highlightedMechHash, setHighlightedMechHash } = useGame()
    const { isAnyPanelOpen } = useDrawer()
    const { faction_id } = useGameServerAuth()

    return (
        <WarMachineItemInner
            {...props}
            faction_id={faction_id}
            isAnyPanelOpen={isAnyPanelOpen}
            highlightedMechHash={highlightedMechHash}
            setHighlightedMechHash={setHighlightedMechHash}
            state={state}
            subscribe={subscribe}
        />
    )
}

interface PropsInner extends Props, Partial<WebSocketProperties> {
    faction_id?: string
    highlightedMechHash?: string
    setHighlightedMechHash: (s?: string) => void
    isAnyPanelOpen: boolean
}

const WarMachineItemInner = ({
    warMachine,
    scale,
    shouldBeExpanded,
    faction_id,
    highlightedMechHash,
    setHighlightedMechHash,
    isAnyPanelOpen,
    state,
    subscribe,
}: PropsInner) => {
    const { participant_id, faction, name, image_avatar } = warMachine
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const [warMachineDestroyedRecord, setWarMachineDestroyedRecord] = useState<WarMachineDestroyedRecord>()
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()
    const [isExpanded, toggleIsExpanded] = useToggle(false)
    const [isDestroyedInfoOpen, toggleIsDestroyedInfoOpen] = useToggle()
    const maxAbilityPriceMap = useRef<Map<string, BigNumber>>(new Map<string, BigNumber>())
    const {
        id: warMachinefaction_id,
        logo_blob_id,
        theme: { primary, secondary, background },
    } = faction

    const wmImageUrl = image_avatar || GenericWarMachinePNG
    const isOwnFaction = faction_id == warMachine.faction_id
    const numSkillBars = gameAbilities ? gameAbilities.length : 0
    const isAlive = !warMachineDestroyedRecord

    const handleClick = useCallback(
        (mechHash: string) => {
            if (!isExpanded) toggleIsExpanded()
            if (mechHash === highlightedMechHash) {
                setHighlightedMechHash(undefined)
            } else setHighlightedMechHash(mechHash)
        },
        [highlightedMechHash, isExpanded],
    )

    /* Toggle out isExpanded if other mech is highlighted */
    useEffect(() => {
        if (highlightedMechHash !== warMachine.hash && isExpanded && !shouldBeExpanded) {
            toggleIsExpanded()
        }
    }, [highlightedMechHash])

    useEffect(() => {
        toggleIsExpanded(shouldBeExpanded)
    }, [shouldBeExpanded, isAnyPanelOpen])

    // If warmachine is updated, reset destroy info
    useEffect(() => {
        setWarMachineDestroyedRecord(undefined)
    }, [warMachine])

    // Subscribe to war machine ability updates
    useEffect(() => {
        if (
            state !== WebSocket.OPEN ||
            !faction_id ||
            faction_id === NullUUID ||
            faction_id !== warMachinefaction_id ||
            !subscribe
        )
            return
        return subscribe<GameAbility[] | undefined>(
            GameServerKeys.SubWarMachineAbilitiesUpdated,
            (payload) => {
                if (payload) setGameAbilities(payload)
            },
            {
                participant_id,
            },
        )
    }, [subscribe, state, faction_id, participant_id, warMachinefaction_id])

    // Subscribe to whether the war machine has been destroyed
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<WarMachineDestroyedRecord>(
            GameServerKeys.SubWarMachineDestroyed,
            (payload) => {
                if (!payload) return
                setWarMachineDestroyedRecord(payload)
            },
            { participant_id },
        )
    }, [state, subscribe, participant_id])

    return (
        <BoxSlanted key={`WarMachineItem-${participant_id}`} clipSlantSize="20px" sx={{ transform: `scale(${scale})` }}>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "relative",
                    ml: isExpanded || isOwnFaction ? 2 : 3.2,
                    opacity: isAlive ? 1 : 0.8,
                    width: isOwnFaction
                        ? isExpanded
                            ? WIDTH_WM_IMAGE + WIDTH_CENTER + WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_PER_SLANTED_BAR
                            : WIDTH_WM_IMAGE +
                              (2 * WIDTH_PER_SLANTED_BAR + 6) +
                              (numSkillBars > 0
                                  ? WIDTH_SKILL_BUTTON + (numSkillBars - 1) * WIDTH_PER_SLANTED_BAR - 7
                                  : 0)
                        : isExpanded
                        ? WIDTH_WM_IMAGE + WIDTH_CENTER
                        : WIDTH_WM_IMAGE + 2 * WIDTH_PER_SLANTED_BAR + 6,
                    transition: "width .3s",
                }}
            >
                {!isAlive && (
                    <Box
                        onClick={toggleIsDestroyedInfoOpen}
                        sx={{
                            position: "absolute",
                            top: 1.5,
                            left: WIDTH_WM_IMAGE - 23,
                            px: 0.7,
                            py: 0.5,
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
                        <SvgInfoCircularIcon fill={"white"} size="15px" />
                    </Box>
                )}

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        left: 10,
                        height: 3,
                        backgroundColor: primary,
                        zIndex: 9,
                        opacity: isAlive ? 1 : DEAD_OPACITY,
                    }}
                />

                <ClipThing
                    clipSize="8px"
                    clipSlantSize="18px"
                    border={{ isFancy: false, borderColor: primary, borderThickness: "3px" }}
                    sx={{ zIndex: 2 }}
                    skipRightCorner={!isExpanded}
                >
                    <Box sx={{ background: `linear-gradient(${primary}, #000000)` }}>
                        <Box
                            onClick={() => handleClick(warMachine.hash)}
                            sx={{
                                position: "relative",
                                width: WIDTH_WM_IMAGE,
                                height: HEIGHT,
                                overflow: "hidden",
                                backgroundImage: `url(${wmImageUrl})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                cursor: "pointer",
                            }}
                        >
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: 3.3,
                                    width: "100%",
                                    height: "100%",
                                    background: "linear-gradient(#00000090, #000000)",
                                    opacity: isAlive ? 0 : 1,
                                    transition: "all .2s",
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
                            ml: -2.5,

                            backgroundColor: !isExpanded
                                ? "transparent"
                                : highlightedMechHash === warMachine.hash
                                ? `${primary}60`
                                : "#00000056",
                            opacity: isAlive ? 1 : DEAD_OPACITY,
                            zIndex: 1,
                        }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                            sx={{ flex: 1, pl: isExpanded ? 3.5 : 0, pr: isExpanded ? 2.1 : 0 }}
                        >
                            <HealthShieldBars warMachine={warMachine} type={isExpanded ? "horizontal" : "vertical"} />

                            {isExpanded && (
                                <Box
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
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
                                sx={{ pl: 2.2, pr: 2.3, py: 0.7, height: 33, backgroundColor: `${background}95` }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        fontWeight: "fontWeightBold",
                                        fontFamily: "Nostromo Regular Black",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "normal",
                                        display: "-webkit-box",
                                        overflowWrap: "anywhere",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                    }}
                                >
                                    {name}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>

                    {gameAbilities && gameAbilities.length > 0 && (
                        <>
                            <BoxSlanted
                                clipSlantSize="20px"
                                onClick={isAlive ? togglePopoverOpen : null}
                                sx={{
                                    position: "relative",
                                    width: WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_PER_SLANTED_BAR,
                                    alignSelf: "stretch",
                                    ml: -2.5,
                                    backgroundColor: primary,
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
                                        left: 22,
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(-${SKILL_BUTTON_TEXT_ROTATION}deg)`,
                                    }}
                                >
                                    <Typography
                                        id="warMachineSkillsText"
                                        variant="body1"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            color: secondary,
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
                                        index={index}
                                        gameAbility={ga}
                                        maxAbilityPriceMap={maxAbilityPriceMap}
                                    />
                                ))}
                        </>
                    )}
                </Stack>
            </Stack>

            {gameAbilities && gameAbilities.length > 0 && (
                <WarMachineAbilitiesPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    toggleOpen={togglePopoverOpen}
                    warMachine={warMachine}
                    gameAbilities={gameAbilities}
                    maxAbilityPriceMap={maxAbilityPriceMap}
                />
            )}

            {!isAlive && (
                <WarMachineDestroyedInfo
                    open={isDestroyedInfoOpen}
                    toggleOpen={toggleIsDestroyedInfoOpen}
                    warMachineDestroyedRecord={warMachineDestroyedRecord}
                />
            )}
        </BoxSlanted>
    )
}
