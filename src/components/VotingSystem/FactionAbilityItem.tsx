import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { Box, Fade, Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { ClipThing, VotingButton } from '..'
import { useGame, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { FactionAbility, FactionAbilityTargetPrice } from '../../types'
import { useToggle } from '../../hooks'

const ContributionBar = ({
    color,
    initialTargetCost,
    currentSups,
    supsCost,
}: {
    color: string
    initialTargetCost: BigNumber
    currentSups: BigNumber
    supsCost: BigNumber
}) => {
    const percent = currentSups.dividedBy(supsCost).toNumber() * 100

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: '100%', px: 1.5, py: 1.2, backgroundColor: '#00000050', borderRadius: 1 }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ flex: 1, height: 5.5, backgroundColor: `${colors.text}20` }}
            >
                <Box
                    sx={{
                        width: `${percent}%`,
                        height: '100%',
                        transition: 'all .25s',
                        backgroundColor: color,
                    }}
                ></Box>
            </Stack>

            <Typography
                key={percent}
                variant="caption"
                sx={{
                    fontWeight: 'fontWeightBold',
                    lineHeight: 1,
                    animation: `${zoomEffect()} 300ms ease-out`,
                }}
            >
                {Math.round(percent)}%
            </Typography>
        </Stack>
    )
}

interface FactionAbilityContributeRequest {
    factionAbilityID: string
    amount: BigNumber
}

interface FactionAbilityItemProps {
    factionAbility: FactionAbility
    pricing: FactionAbilityTargetPrice
}

export const FactionAbilityItem = ({ factionAbility, pricing }: FactionAbilityItemProps) => {
    const { send } = useWebsocket()
    const theme = useTheme<Theme>()
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber('0'))
    const [refresh, toggleRefresh] = useToggle()

    const factionAbilityID = factionAbility.id
    const currentSups = new BigNumber(pricing.currentSups).dividedBy('1000000000000000000')
    const supsCost = new BigNumber(pricing.supsCost).dividedBy('1000000000000000000')
    const shouldReset = pricing.shouldReset
    const isVoting = supsCost.isGreaterThanOrEqualTo(currentSups)

    useEffect(() => {
        if (shouldReset) {
            setInitialTargetCost(supsCost)
            toggleRefresh()
        }
    }, [shouldReset])

    const onContribute = useCallback(
        (amount: number) => async () => {
            try {
                const resp = await send<boolean, FactionAbilityContributeRequest>(HubKey.FactionAbilityContribute, {
                    factionAbilityID,
                    amount: new BigNumber(amount),
                })

                if (resp) {
                    return true
                } else {
                    throw new Error()
                }
            } catch (e) {
                return false
            }
        },
        [],
    )

    const { label, colour, imageUrl } = factionAbility

    return (
        <Box key={refresh}>
            <Fade in={true}>
                <Box>
                    <ClipThing
                        border={{ isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: '1.5px' }}
                        clipSize="6px"
                    >
                        <Box sx={{ backgroundColor: colors.darkNavy }}>
                            <Stack direction="row" sx={{ height: 118, minWidth: 180 }}>
                                <ClipThing
                                    border={{
                                        isFancy: true,
                                        borderColor: theme.factionTheme.primary,
                                        borderThickness: '1px',
                                    }}
                                    clipSize="6px"
                                    fillHeight
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: colour,
                                            height: '100%',
                                            width: 95,
                                            backgroundImage: `url(${imageUrl})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                        }}
                                    />
                                </ClipThing>

                                <Stack
                                    spacing={1}
                                    alignItems="flex-start"
                                    sx={{ flex: 1, backgroundColor: colors.darkNavy, px: 2, py: 1.2 }}
                                >
                                    <Stack
                                        spacing={1.2}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        alignSelf="stretch"
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 'fontWeightBold',
                                                fontFamily: 'Nostromo Regular Medium',
                                                color: colour,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 200,
                                            }}
                                        >
                                            {label}
                                        </Typography>

                                        <Stack direction="row" alignItems="center" justifyContent="center">
                                            <Typography
                                                key={`currentSups-${currentSups.toFixed()}`}
                                                variant="body2"
                                                sx={{
                                                    lineHeight: 1,
                                                    color: `${colour} !important`,
                                                    animation: `${zoomEffect(1.5)} 300ms ease-out`,
                                                }}
                                            >
                                                {currentSups.toFixed(2)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1, color: `${colour} !important` }}
                                            >
                                                &nbsp;/&nbsp;
                                            </Typography>
                                            <Typography
                                                key={`supsCost-${supsCost.toFixed()}`}
                                                variant="body2"
                                                sx={{
                                                    lineHeight: 1,
                                                    color: `${colour} !important`,
                                                    animation: `${zoomEffect(1.5)} 300ms ease-out`,
                                                }}
                                            >
                                                {supsCost.toFixed(2)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1, color: `${colour} !important` }}
                                            >
                                                &nbsp;SUPS
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <ContributionBar
                                        color={colour}
                                        initialTargetCost={initialTargetCost}
                                        currentSups={currentSups}
                                        supsCost={supsCost}
                                    />

                                    <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                        <VotingButton
                                            color={colour}
                                            amount={1}
                                            cost={1}
                                            isVoting={isVoting}
                                            onClick={onContribute(1)}
                                            suffix="SUP"
                                            disableHover
                                        />
                                        <VotingButton
                                            color={colour}
                                            amount={25}
                                            cost={25}
                                            isVoting={isVoting}
                                            onClick={onContribute(25)}
                                            suffix="SUP"
                                            disableHover
                                        />
                                        <VotingButton
                                            color={colour}
                                            amount={100}
                                            cost={100}
                                            isVoting={isVoting}
                                            onClick={onContribute(100)}
                                            suffix="SUP"
                                            disableHover
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}
