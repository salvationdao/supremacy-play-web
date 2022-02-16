import { useEffect, useState, useRef } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { GameAbility, WarMachineDestroyedRecord, WarMachineState } from '../../types'
import { BoxSlanted, ClipThing, HealthShieldBars, SkillBar, WarMachineAbilitiesPopover } from '..'
import { SvgSkull } from '../../assets'
import { useAuth, useWebsocket } from '../../containers'
import { NullUUID, PASSPORT_WEB } from '../../constants'
import HubKey from '../../keys'
import { useToggle } from '../../hooks'
import BigNumber from 'bignumber.js'

const WIDTH_WM_IMAGE = 92
const WIDTH_CENTER = 142
export const WIDTH_PER_SLANTED_BAR = 12
export const WIDTH_PER_SLANTED_BAR_ACTUAL = 32
const WIDTH_SKILL_BUTTON = 43
const HEIGHT = 76

const SKILL_BUTTON_TEXT_ROTATION = 76.5

export const WarMachineItem = ({ warMachine, scale }: { warMachine: WarMachineState; scale: number }) => {
    const { participantID, faction, name, imageUrl } = warMachine
    const { state, subscribe } = useWebsocket()
    const { factionID } = useAuth()
    const [isAlive, setIsAlive] = useState(true)
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const [warMachineDestroyedRecord, setWarMachineDestroyedRecord] = useState<WarMachineDestroyedRecord>()
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()
    const [isExpanded, toggleIsExpanded] = useToggle(false)
    const maxAbilityPriceMap = useRef<Map<string, BigNumber>>(new Map<string, BigNumber>())
    const {
        id: warMachineFactionID,
        logoBlobID,
        theme: { primary, secondary, background },
    } = faction

    const isOwnFaction = factionID == warMachine.factionID
    const numSkillBars = gameAbilities ? gameAbilities.length : 0

    // Subscribe to war machine ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !factionID || factionID === NullUUID || factionID !== warMachineFactionID)
            return
        return subscribe<GameAbility[] | undefined>(
            HubKey.SubWarMachineAbilitiesUpdated,
            (payload) => {
                if (payload) setGameAbilities(payload)
            },
            {
                participantID,
            },
        )
    }, [subscribe, state, factionID, participantID, warMachineFactionID])

    // Subscribe to whether the war machine has been destroyed
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<WarMachineDestroyedRecord>(
            HubKey.SubWarMachineDestroyed,
            (payload) => {
                if (!payload) return
                setWarMachineDestroyedRecord(payload)
            },
            {
                participantID,
            },
        )
    }, [state, subscribe, participantID])

    return (
        <BoxSlanted
            key={`WarMachineItem-${participantID}`}
            clipSlantSize="20px"
            sx={{ transform: isOwnFaction ? '' : `scale(${scale})` }}
        >
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: 'relative',
                    ml: isExpanded || isOwnFaction ? 2 : 3.2,
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
                    opacity: isAlive ? 1 : 0.5,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 10,
                        height: 3,
                        backgroundColor: primary,
                        zIndex: 9,
                    }}
                />

                <ClipThing
                    clipSize="8px"
                    clipSlantSize="18px"
                    border={{ isFancy: false, borderColor: primary, borderThickness: '3px' }}
                    sx={{ zIndex: 2 }}
                    skipRightCorner={!isExpanded}
                >
                    <Box
                        onClick={toggleIsExpanded}
                        sx={{
                            width: WIDTH_WM_IMAGE,
                            height: HEIGHT,
                            overflow: 'hidden',
                            backgroundColor: primary,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            cursor: 'pointer',
                        }}
                    >
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                px: 3.3,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(#00000090, #000000)',
                                opacity: isAlive ? 0 : 1,
                                transition: 'all .2s',
                                ':hover': {
                                    opacity: isAlive ? 0.2 : 1,
                                },
                            }}
                        >
                            {!isAlive && <SvgSkull fill="#FFFFFF" size="100%" />}
                        </Stack>
                    </Box>
                </ClipThing>

                <Stack direction="row" alignSelf="stretch" flex={1} sx={{ position: 'relative' }}>
                    <Stack
                        justifyContent="flex-end"
                        sx={{
                            flex: 1,
                            position: 'relative',
                            alignSelf: 'stretch',
                            ml: -2.5,

                            backgroundColor: isExpanded ? '#00000056' : 'transparent',
                            opacity: isAlive ? 1 : 0.7,
                            zIndex: 1,
                        }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                            sx={{ flex: 1, pl: isExpanded ? 3.5 : 0, pr: isExpanded ? 2.1 : 0 }}
                        >
                            <HealthShieldBars
                                warMachine={warMachine}
                                setIsAlive={setIsAlive}
                                type={isExpanded ? 'horizontal' : 'vertical'}
                            />

                            {isExpanded && (
                                <Box
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        backgroundImage: `url(${PASSPORT_WEB}/api/files/${logoBlobID})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundSize: 'contain',
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
                                        color: '#FFFFFF',
                                        lineHeight: 1,
                                        fontWeight: 'fontWeightBold',
                                        fontFamily: 'Nostromo Regular Black',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'normal',
                                        display: '-webkit-box',
                                        overflowWrap: 'anywhere',
                                        WebkitBoxOrient: 'vertical',
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
                                onClick={togglePopoverOpen}
                                sx={{
                                    position: 'relative',
                                    width: WIDTH_SKILL_BUTTON + numSkillBars * WIDTH_PER_SLANTED_BAR,
                                    alignSelf: 'stretch',
                                    ml: -2.5,
                                    backgroundColor: primary,
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                    ':hover #warMachineSkillsText': {
                                        letterSpacing: 2.3,
                                    },
                                    zIndex: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 22,
                                        top: '50%',
                                        transform: `translate(-50%, -50%) rotate(-${SKILL_BUTTON_TEXT_ROTATION}deg)`,
                                    }}
                                >
                                    <Typography
                                        id="warMachineSkillsText"
                                        variant="body1"
                                        sx={{
                                            fontWeight: 'fontWeightBold',
                                            color: secondary,
                                            letterSpacing: 1,
                                            transition: 'all .2s',
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
                                        key={ga.id}
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
        </BoxSlanted>
    )
}
