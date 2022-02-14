import { useEffect, useState, useRef } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { GameAbility, WarMachineDestroyedRecord, WarMachineState } from '../../types'
import { BoxSlanted, ClipThing, HealthShieldBars, SkillBar, WarMachineAbilitiesPopover } from '..'
import { SvgSkull } from '../../assets'
import { useAuth, useWebsocket } from '../../containers'
import { NullUUID, PASSPORT_WEB } from '../../constants'
import HubKey from '../../keys'
import { useToggle } from '../../hooks'

const HEIGHT = 76
const WIDTH = 255
const WM_IMAGE_WIDTH = 92
const SKILLS_WIDTH = 42
const ROTATION = 76.5
const SKILL_BAR_WIDTH_OVERALL = 29
const SKILL_BAR_WIDTH = 9

export const WarMachineItem = ({ warMachine }: { warMachine: WarMachineState }) => {
    const { participantID, faction, name, imageUrl } = warMachine
    const { state, subscribe } = useWebsocket()
    const { factionID } = useAuth()
    const [isAlive, setIsAlive] = useState(true)
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const [warMachineDestroyedRecord, setWarMachineDestroyedRecord] = useState<WarMachineDestroyedRecord>()
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()

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
            sx={{ transform: isOwnFaction ? '' : 'scale(.8)' }}
        >
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="center"
                sx={{
                    position: 'relative',
                    width: isOwnFaction ? WIDTH + numSkillBars * SKILL_BAR_WIDTH : WIDTH - SKILLS_WIDTH,
                    opacity: isAlive ? 1 : 0.5,
                }}
            >
                <ClipThing
                    clipSize="8px"
                    clipSlantSize="20px"
                    border={{ isFancy: false, borderColor: primary, borderThickness: '2.5px' }}
                    sx={{ mb: '2.3px', zIndex: 2 }}
                >
                    <Box
                        sx={{
                            width: WM_IMAGE_WIDTH,
                            height: HEIGHT,
                            overflow: 'hidden',
                            backgroundColor: primary,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    >
                        {!isAlive && (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: 3.3,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(#00000090, #000000)',
                                }}
                            >
                                <SvgSkull fill="#FFFFFF" size="100%" />
                            </Stack>
                        )}
                    </Box>
                </ClipThing>

                <Stack
                    justifyContent="flex-end"
                    sx={{
                        flex: 1,
                        ml: -2.5,
                        height: HEIGHT + 2.4,
                        borderBottomStyle: 'solid',
                        borderBottomWidth: '2.5px',
                        borderBottomColor: primary,

                        backgroundColor: '#00000056',
                        opacity: isAlive ? 1 : 0.7,
                        zIndex: 1,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ flex: 1, pl: 3, pr: 1.1 }}>
                        <HealthShieldBars warMachine={warMachine} setIsAlive={setIsAlive} />

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
                    </Stack>

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
                </Stack>

                {gameAbilities && gameAbilities.length > 0 && (
                    <>
                        <BoxSlanted
                            clipSlantSize="20px"
                            onClick={togglePopoverOpen}
                            sx={{
                                position: 'relative',
                                width: SKILLS_WIDTH + numSkillBars * SKILL_BAR_WIDTH,
                                alignSelf: 'stretch',
                                ml: -1.2,
                                backgroundColor: primary,
                                boxShadow: 3,
                                cursor: 'pointer',
                                transform: 'scale(.95)',
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
                                    transform: `translate(-50%, -50%) rotate(-${ROTATION}deg)`,
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

                        {gameAbilities.map((ga, index) => (
                            <SkillBar
                                key={ga.id}
                                index={index}
                                gameAbility={ga}
                                widthOverall={SKILL_BAR_WIDTH_OVERALL}
                                width={SKILL_BAR_WIDTH}
                            />
                        ))}
                    </>
                )}
            </Stack>

            {gameAbilities && gameAbilities.length > 0 && (
                <WarMachineAbilitiesPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    toggleOpen={togglePopoverOpen}
                    warMachine={warMachine}
                    gameAbilities={gameAbilities}
                />
            )}
        </BoxSlanted>
    )
}
