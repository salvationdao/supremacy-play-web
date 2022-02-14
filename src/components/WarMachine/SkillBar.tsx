import { Box, Stack } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { BoxSlanted } from '..'
import { NullUUID } from '../../constants'
import { useAuth, useWebsocket } from '../../containers'
import { shadeColor } from '../../helpers'
import { colors } from '../../theme/theme'
import { GameAbility, GameAbilityTargetPrice } from '../../types'

export const SkillBar = ({
    index,
    gameAbility,
    widthOverall,
    width,
}: {
    index: number
    gameAbility: GameAbility
    widthOverall: number
    width: number
}) => {
    const { factionID } = useAuth()
    const { state, subscribeAbilityNetMessage } = useWebsocket()

    const { id } = gameAbility
    const [supsCost, setSupsCost] = useState(new BigNumber('0'))
    const [currentSups, setCurrentSups] = useState(new BigNumber('0'))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber('0'))

    const [gameAbilityTargetPrice, setGameAbilityTargetPrice] = useState<GameAbilityTargetPrice>()

    const progressPercent = initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100
    const costPercent = initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100

    // Listen on current faction ability price change
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !factionID || factionID === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityTargetPrice | undefined>(id, (payload) => {
            if (!payload) return
            setGameAbilityTargetPrice(payload)
        })
    }, [id, state, subscribeAbilityNetMessage, factionID])

    useEffect(() => {
        if (!gameAbilityTargetPrice) return
        const currentSups = new BigNumber(gameAbilityTargetPrice.currentSups).dividedBy('1000000000000000000')
        const supsCost = new BigNumber(gameAbilityTargetPrice.supsCost).dividedBy('1000000000000000000')
        setCurrentSups(currentSups)
        setSupsCost(supsCost)

        if (gameAbilityTargetPrice.shouldReset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)
        }
    }, [gameAbilityTargetPrice])

    return (
        <BoxSlanted
            key={index}
            clipSlantSize="20px"
            sx={{
                position: 'absolute',
                bottom: 0,
                right: index * width - index * 1,
                width: widthOverall,
                height: '100%',
                transform: 'scale(.95)',
                zIndex: 4,
            }}
        >
            <Stack
                justifyContent="flex-end"
                sx={{ position: 'relative', height: '100%', width: '100%', backgroundColor: '#00000040' }}
            >
                <Box
                    sx={{
                        height: `${progressPercent}%`,
                        width: '100%',
                        backgroundColor: shadeColor('#4844A0', 100 - index * 28),
                        transition: 'all .25s',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: `${costPercent - 2}%`,
                        height: 2,
                        width: '100%',
                        backgroundColor: colors.red,
                        zIndex: 6,
                    }}
                />
            </Stack>
        </BoxSlanted>
    )
}
