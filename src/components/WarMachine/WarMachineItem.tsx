import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { GameAbility, WarMachineDestroyedRecord, WarMachineState } from '../../types'
import { BoxSlanted, ClipThing, HealthShieldBars } from '..'
import { SvgSkull } from '../../assets'
import { useAuth, useWebsocket } from '../../containers'
import { NullUUID, PASSPORT_WEB } from '../../constants'
import HubKey from '../../keys'

export const WarMachineItem = ({ warMachine }: { warMachine: WarMachineState }) => {
    const { participantID, faction, name, imageUrl } = warMachine
    const { state, subscribe } = useWebsocket()
    const { factionID } = useAuth()
    const [isAlive, setIsAlive] = useState(true)
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const [warMachineDestroyedRecord, setWarMachineDestroyedRecord] = useState<WarMachineDestroyedRecord>()

    const {
        id: warMachineFactionID,
        logoBlobID,
        theme: { primary, background },
    } = faction

    // Subscribe to battle ability updates
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

    return (
        <BoxSlanted
            clipSlantSize="20px"
            key={`WarMachineItem-${participantID}`}
            sx={{ transform: factionID == undefined || factionID == warMachine.factionID ? '' : 'scale(.9)' }}
        >
            <Stack direction="row" alignItems="center" sx={{ width: 225, opacity: isAlive ? 1 : 0.5 }}>
                <ClipThing
                    clipSize="8px"
                    clipSlantSize="20px"
                    border={{ isFancy: false, borderColor: primary, borderThickness: '2.5px' }}
                    sx={{ zIndex: 2 }}
                >
                    <Box
                        sx={{
                            width: 92,
                            height: 76,
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
                        mb: '-2.3px',
                        height: 78.4,
                        borderBottomStyle: 'solid',
                        borderBottomWidth: '2.5px',
                        borderBottomColor: primary,

                        backgroundColor: '#00000056',
                        opacity: isAlive ? 1 : 0.7,
                        zIndex: 1,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ flex: 1, pl: 3, pr: 2.2 }}>
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
                        sx={{ pl: 2.2, pr: 3.4, py: 0.7, height: 33, backgroundColor: `${background}95` }}
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
            </Stack>
        </BoxSlanted>
    )
}
