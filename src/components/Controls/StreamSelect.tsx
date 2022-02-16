import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useWebsocket } from '../../containers/socket'
import { useStream } from '../../containers/stream'
import { getDistanceFromLatLonInKm } from '../../helpers'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { Stream } from '../../types'

const MAX_OPTIONS = 7

export const StreamSelect = () => {
    const { state, subscribe } = useWebsocket()
    const { currentStream, setCurrentStream } = useStream()
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])

    // Subscribe to list of streams
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<Stream[]>(HubKey.GetStreamList, (payload) => {
            if (!payload) return
            setStreams(payload)
        })
    }, [state, subscribe])

    // Build stream options for the drop down
    useEffect(() => {
        if (!streams || streams.length <= 0) return

        // Filter for servers that have capacity and is onlnine
        const availStreams = streams.filter((x) => {
            return x.usersNow < x.userMax && x.status === 'online'
        })

        if (availStreams.length <= 0) return

        // Reduce the list of options so it's not too many for the user
        // By default its sorted by quietest servers first
        const quietestStreams = availStreams.sort((a, b) => (a.usersNow / a.userMax > b.usersNow / b.userMax ? 1 : -1))
        let newStreamOptions = quietestStreams

        // If we have access to user's location, then choose servers that are closest to user
        if (navigator.geolocation) {
            const closestStreams: Stream[] = []
            navigator.geolocation.watchPosition((position) => {
                availStreams.map((x) => {
                    // Get distance between user and server
                    const userLat = position.coords.latitude
                    const userLong = position.coords.longitude
                    const serverLat = x.latitude
                    const serverLong = x.longitude
                    const distance = getDistanceFromLatLonInKm(userLat, userLong, serverLat, serverLong)
                    closestStreams.push({ ...x, distance })
                })

                newStreamOptions = closestStreams.sort((a, b) => {
                    if (!a.distance || !b.distance) return 0
                    return a.distance > b.distance ? 1 : -1
                })

                setStreamOptions(newStreamOptions.slice(0, MAX_OPTIONS))
            })
        } else {
            setStreamOptions(newStreamOptions.slice(0, MAX_OPTIONS))
        }
    }, [streams])

    // If there is no current stream selected then pick the first (best) option in streamOptions
    useEffect(() => {
        if (!currentStream && streamOptions && streamOptions.length > 0) setCurrentStream(streamOptions[0])
    }, [streamOptions])

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
                {streamOptions.reverse().map((x) => {
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
