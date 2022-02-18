import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useWebsocket } from '../../containers/socket'
import { useStream } from '../../containers'
import { getDistanceFromLatLonInKm, getObjectFromArrayByKey } from '../../helpers'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { Stream } from '../../types'

const MAX_OPTIONS = 7

export const StreamSelect = () => {
    const { state, subscribe } = useWebsocket()
    const { currentStream, setCurrentStream, setSelectedWsURL, setSelectedStreamID } = useStream()
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])

    // Subscribe to list of streams
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<Stream[]>(HubKey.GetStreamList, (payload) => {
            console.log('this is payload', payload)

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
        SetNewStreamOptions(quietestStreams)

        // If we have access to user's location, then choose servers that are closest to user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const closestStreams: Stream[] = []

                availStreams.map((x) => {
                    // Get distance between user and server and populate "distance" key
                    const userLat = position.coords.latitude
                    const userLong = position.coords.longitude
                    const serverLat = x.latitude
                    const serverLong = x.longitude
                    const distance = getDistanceFromLatLonInKm(userLat, userLong, serverLat, serverLong)
                    closestStreams.push({ ...x, distance })
                })

                closestStreams.sort((a, b) => {
                    if (!a.distance || !b.distance) return 0
                    return a.distance > b.distance ? 1 : -1
                })

                SetNewStreamOptions(closestStreams)
            })
        }
    }, [streams])

    const SetNewStreamOptions = (newStreamOptions: Stream[]) => {
        // Limit to only a few for the dropdown and include our current selection if not already in the list
        const temp = newStreamOptions.slice(0, MAX_OPTIONS)
        if (currentStream && !getObjectFromArrayByKey(temp, currentStream.host, 'host')) {
            newStreamOptions[newStreamOptions.length - 1] = currentStream
        }

        // If there is no current stream selected then pick the first (best) option in streamOptions
        if (!currentStream && newStreamOptions && newStreamOptions.length > 0) setCurrentStream(newStreamOptions[0])

        // Reverse the order for rendering so best is closer to user's mouse
        setStreamOptions(temp.reverse())
    }

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
                defaultValue={currentStream?.host}
                value={currentStream ? currentStream.host : ''}
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
                {streamOptions.map((x) => {
                    return (
                        <MenuItem
                            key={x.host}
                            value={x.host}
                            onClick={() => {
                                console.log('this is xxxx', x)

                                setCurrentStream(x)
                                setSelectedStreamID(x.streamID)
                                setSelectedWsURL(x.wsURL)
                            }}
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
