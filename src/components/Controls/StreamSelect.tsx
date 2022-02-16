import { Menu, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { SocketState, useWebsocket } from '../../containers/socket'
import { useStream } from '../../containers/stream'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { Stream } from '../../types'

export const StreamSelect = () => {
    const { state, subscribe } = useWebsocket()
    const { currentStream, setCurrentStream } = useStream()
    const [streamArray, setStreamArray] = useState<Stream[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN) return
        return subscribe<Stream[]>(HubKey.StreamList, (streamArray) => {
            if (!streamArray || streamArray.length <= 0) return

            // Sorting if the stream is full and stream is online
            const availableStreamsArr = streamArray.filter((x) => {
                return x.usersNow < x.userMax && x.status === 'online'
            })

            // Getting random selection (max of 7 servers) to not overwhelm user
            const arr: Stream[] = []
            for (let i = 0; i < 7; i++) {
                const index = Math.floor(Math.random() * availableStreamsArr.length)
                const randomStream = availableStreamsArr[index]
                arr.push(randomStream)
                // Take out stream from array of options, to not repeat option
                availableStreamsArr.splice(index, 1)
            }
            setStreamArray(arr)
        })
    }, [])

    // Setting the closest server out of the 7 randomly chosen available and online servers to be default
    useEffect(() => {
        const arr: Stream[] = []
        streamArray.map((x) => {
            if (!navigator.geolocation) return
            // Only runs once, despite having dependency on
            if (currentStream) return

            let dist: number
            navigator.geolocation.watchPosition((position) => {
                // Get distance between user and server
                const userLat = position.coords.latitude
                const userLong = position.coords.longitude

                const radlat1 = (Math.PI * x.latitude) / 180
                const radlat2 = (Math.PI * userLat) / 180
                const theta = x.longitude - userLong
                const radtheta = (Math.PI * theta) / 180
                dist =
                    Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
                if (dist > 1) {
                    dist = 1
                }
                dist = Math.acos(dist)
                dist = (dist * 180) / Math.PI
                dist = dist * 60 * 1.1515

                // Setting a new stream with distance
                const distStream = { ...x, distance: dist }

                // Pushing stream with distance to new array
                arr.push(distStream)

                // Filtering if it already exists,
                const sortedClosestStreamArr = arr.filter((e, i) => arr.findIndex((a) => a.id === e.id) === i)

                // Sorting by distance to user
                sortedClosestStreamArr.sort((a, b) => {
                    if (!a.distance || !b.distance) return 0
                    return a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
                })

                setCurrentStream(sortedClosestStreamArr[0])
            })
        })
    }, [streamArray])

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                STREAM SERVER:{' '}
            </Typography>

            <Select
                sx={{
                    width: 150,
                    borderRadius: 0.5,
                    '&:hover': {
                        backgroundColor: colors.darkNavy,
                    },
                    '& .MuiSelect-outlined': { px: 1, pt: 0.6, pb: 0 },
                }}
                defaultValue={currentStream?.id}
                value={currentStream ? currentStream.id : ''}
                MenuProps={{
                    variant: 'menu',
                    sx: {
                        '&& .Mui-selected': {
                            backgroundColor: colors.darkerNeonBlue,
                        },
                    },
                    PaperProps: {
                        sx: {
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.5,
                        },
                    },
                }}
            >
                {streamArray.map((x) => {
                    return (
                        <MenuItem
                            key={x.id}
                            value={x.id}
                            onClick={() => setCurrentStream(x)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: colors.darkNavyBlue,
                                },
                            }}
                        >
                            <Typography variant="body2">{x.name}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
