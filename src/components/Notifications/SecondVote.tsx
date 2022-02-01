import { Box, CardMedia, Slider, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { ClipThing, FancyButton } from '..'
import { SvgSupToken } from '../../assets'
import { useWebsocket, Vote } from '../../containers'
import { useNotifications } from '../../containers/notifications'
import { useInterval } from '../../hooks'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { zoomEffect } from '../../theme/keyframes'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import BigNumber from 'bignumber.js'
import { supFormatter } from '../../helpers'
import { useWallet } from '@ninjasoftware/passport-gamebar'

interface VoteRequest {
    factionID: string
    factionAbilityID: string
    isAgreed: boolean
}

const VotingButton = ({ data, isAgreed }: { data: Vote; isAgreed: boolean }) => {
    const { send } = useWebsocket()
    const { onWorldSups } = useWallet()

    const { faction, factionAbility, endTime } = data

    const amount: BigNumber = new BigNumber(1000000000000000000)

    const isVotable =
        onWorldSups &&
        onWorldSups.isGreaterThanOrEqualTo(amount) &&
        moment.duration(moment(endTime).diff(moment())).asMilliseconds() > 0

    const onVote = useCallback(async () => {
        try {
            const resp = await send<boolean, VoteRequest>(HubKey.SubmitSecondVote, {
                factionID: faction.id,
                factionAbilityID: factionAbility.id,
                isAgreed,
            })

            if (resp) {
                return true
            } else {
                throw new Error()
            }
        } catch (e) {
            return false
        }
    }, [])

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipSize="4px"
            clipSx={{ flex: 1 }}
            sx={{ pt: 0.5, pb: 0.4 }}
            backgroundColor={isAgreed ? colors.green : colors.red}
            borderColor={isAgreed ? colors.green : colors.red}
            onClick={onVote}
        >
            <Stack alignItems="center" direction="row" spacing={0.3}>
                <Typography variant="caption" sx={{ lineHeight: 1, fontWeight: 'fontWeightBold' }}>
                    {`${isAgreed ? 'ACCEPT' : 'REJECT'} ( `}
                </Typography>
                <SvgSupToken size="13px" />
                <Typography
                    variant="caption"
                    sx={{ lineHeight: 1, fontWeight: 'fontWeightBold', fontFamily: 'Nostromo Regular Medium' }}
                >
                    {supFormatter(amount)} )
                </Typography>
            </Stack>
        </FancyButton>
    )
}

const VotingBar = ({ factionID, notiID, endTime }: { factionID: string; notiID: string; endTime: Date }) => {
    const { secondVoteBar } = useNotifications()
    const [redAmount, setRedAmount] = useState<number>(0.5)

    useEffect(() => {
        if (moment.duration(moment(endTime).diff(moment())).asSeconds() >= 0 && secondVoteBar?.factionID == factionID) {
            setRedAmount(secondVoteBar?.result)
        }
    }, [secondVoteBar])

    return (
        <Stack spacing={0.8} direction="row" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
            <Typography
                key={Math.round(redAmount * 100) + 'red'}
                variant="caption"
                sx={{
                    fontWeight: 'fontWeightBold',
                    color: colors.red,
                    animation: `${zoomEffect} 300ms ease-out`,
                }}
            >
                {Math.round(redAmount * 100)}%
            </Typography>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ mt: '-5px' }}>
                    <Slider
                        name={notiID}
                        defaultValue={0.5}
                        value={redAmount}
                        min={0}
                        max={1}
                        valueLabelDisplay="on"
                        sx={{
                            py: 0,
                            borderRadius: 0.2,
                            height: '4px',
                            '& .MuiSlider-track': {
                                color: colors.red,
                                backgroundColor: colors.red,
                            },
                            '& .MuiSlider-thumb': { display: 'none' },
                            '& .MuiSlider-rail': {
                                height: '5.4px',
                                opacity: 1,
                                backgroundColor: colors.green,
                            },
                        }}
                    />
                </Box>
            </Box>
            <Typography
                key={Math.round((1 - redAmount) * 100) + 'green'}
                variant="caption"
                sx={{ fontWeight: 'fontWeightBold', color: colors.green, animation: `${zoomEffect} 300ms ease-out` }}
            >
                {Math.round((1 - redAmount) * 100)}%
            </Typography>
        </Stack>
    )
}

const CountDownTimer = ({ endTime }: { endTime: Date }) => {
    const [timeRemain, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)

    useEffect(() => {
        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.round(d.asSeconds()))
            return
        }
        setDelay(null)
    }, [endTime])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, -1))
    }, delay)

    if (timeRemain < 0) return null

    return (
        <Typography variant="h4" sx={{ fontWeight: 'fontWeightBold' }}>
            {timeRemain}
        </Typography>
    )
}

export const SecondVote = ({ data, notiID }: { data: Vote; notiID: string }) => {
    const { faction, factionAbility, endTime } = data
    const theme = useTheme<Theme>()
    const { label: factionName, id: factionID } = faction
    const { label, colour, imageUrl } = factionAbility

    return (
        <Box>
            <ClipThing border={{ isFancy: true, borderColor: colour, borderThickness: '2px' }} clipSize="6px">
                <Box sx={{ width: 360, backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" sx={{ minHeight: 75 }}>
                        <ClipThing
                            border={{ isFancy: true, borderColor: colour, borderThickness: '2px' }}
                            clipSize="6px"
                            fillHeight
                            sx={{ height: 'unset' }}
                        >
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    position: 'relative',
                                    backgroundColor: theme.factionTheme.background,
                                    height: '100%',
                                    width: 75,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: '#000000',
                                        opacity: 0.5,
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <CountDownTimer endTime={endTime} />
                                </Box>
                                <CardMedia
                                    component="img"
                                    alt={'aaa'}
                                    height="100%"
                                    image={imageUrl}
                                    sx={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            </Stack>
                        </ClipThing>

                        <Stack
                            spacing={0.5}
                            alignItems="flex-start"
                            sx={{ backgroundColor: colors.darkNavy, px: 2, py: 1.4 }}
                        >
                            <Typography variant="body2" sx={{ span: { fontWeight: 'fontWeightBold', color: colour } }}>
                                {`${factionName} wants to initiate `}
                                <span>{`${label}`}</span>
                            </Typography>

                            <VotingBar notiID={notiID} factionID={factionID} endTime={endTime} />

                            <Stack direction="row" spacing={0.4} sx={{ width: '100%' }}>
                                <VotingButton data={data} isAgreed={false} />
                                <VotingButton data={data} isAgreed={true} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </ClipThing>
        </Box>
    )
}
