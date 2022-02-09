import { Box, Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { SvgPriceDownArrow, SvgPriceUpArrow, SvgSupToken } from '../../assets'
import { NullUUID } from '../../constants'
import { useAuth, useGame, useWebsocket } from '../../containers'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { NetMessageType } from '../../types'

const ReUsedText = ({ caption, price, prevPrice }: { caption: string; price: number; prevPrice: number }) => {
    return (
        <Stack spacing={1.2} direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
            <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: 'fontWeightBold' }}>
                {caption}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="center">
                <SvgSupToken size="15.5px" fill={colors.yellow} />
                <Typography
                    key={price.toString()}
                    variant="body1"
                    sx={{ lineHeight: 1, animation: `${zoomEffect(1.05)} 300ms ease-out` }}
                >
                    {price.toFixed(10)}
                </Typography>

                {price > prevPrice ? (
                    <SvgPriceUpArrow size="16px" fill={'#6fff4b'} />
                ) : (
                    <SvgPriceDownArrow size="16px" fill={'#FF4A4A'} />
                )}
            </Stack>
        </Stack>
    )
}

export const Prices = () => {
    const { factionVotePrice, prevFactionVotePrice } = useGame()
    // const { state, subscribeNetMessage } = useWebsocket()
    // const { user } = useAuth()
    // const userID = user?.id
    // const factionID = user?.factionID
    // const [forecastPrice, setForecastPrice] = useState<BigNumber>(new BigNumber('0'))

    // Forecast next vote price
    // useEffect(() => {
    //     if (
    //         state !== WebSocket.OPEN ||
    //         !subscribeNetMessage ||
    //         !userID ||
    //         userID === '' ||
    //         !factionID ||
    //         factionID === NullUUID
    //     )
    //         return
    //     return subscribeNetMessage<string | undefined>(NetMessageType.VotePriceForecastTick, (payload) => {
    //         if (!payload) return
    //         setForecastPrice(new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')))
    //     })
    // }, [state, subscribeNetMessage, userID, factionID])

    return (
        <Stack spacing={0.5}>
            <ReUsedText
                caption="Cost per vote:"
                price={factionVotePrice.toNumber()}
                prevPrice={prevFactionVotePrice.toNumber()}
            />
            {/* <ReUsedText
                caption="Forecasted price per vote:"
                price={forecastPrice.toNumber()}
                prevPrice={forecastPrice.toNumber()}
            /> */}
        </Stack>
    )
}
