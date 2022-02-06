// import BigNumber from 'bignumber.js'
// import { useEffect, useState } from 'react'
// import { createContainer } from 'unstated-next'
// import { NullUUID } from '../constants'
// import { NetMessageType } from '../types'
// import { useAuth } from './auth'
// import { useWebsocket } from './socket'

// /**
//  * A Container contain NEW STUFF
//  */
// export const NewStuffTempContainer = createContainer(() => {
//     const { state, subscribeNetMessage } = useWebsocket()
//     const { user } = useAuth()
//     const userID = user?.id
//     const factionID = user?.factionID

//     // Forecast next vote price
//     const [factionVotePriceIndicator, setFactionVotePriceIndicator] = useState<BigNumber>(new BigNumber('0'))
//     useEffect(() => {
//         if (
//             state !== WebSocket.OPEN ||
//             !subscribeNetMessage ||
//             !userID ||
//             userID === '' ||
//             !factionID ||
//             factionID === NullUUID
//         )
//             return
//         return subscribeNetMessage<string | undefined>(NetMessageType.VotePriceForecastTick, (payload) => {
//             if (!payload) return
//             setFactionVotePriceIndicator(new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')))
//         })
//     }, [state, subscribeNetMessage, userID, factionID])

//     return {
//         factionVotePriceIndicator,
//     }
// })

// export const NewStuffTempProvider = NewStuffTempContainer.Provider
// export const useNewStuffTemp = NewStuffTempContainer.useContainer

export {}
