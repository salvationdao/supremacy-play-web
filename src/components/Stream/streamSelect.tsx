import { Menu, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SocketState, useWebsocket } from '../../containers/socket'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { Stream } from '../../types'

interface StreamSelectProps {
    setCurrentStream: (s: Stream) => void
    currentStream: Stream | undefined
}

export default function StreamSelect({ setCurrentStream, currentStream }: StreamSelectProps) {
    const { state, subscribe } = useWebsocket()

    const [streamArray, setStreamArray] = useState<Stream[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN) return
        return subscribe<Stream[]>(HubKey.StreamList, (streamArray) => {
            //sorting if the stream is full and stream is online
            const availableStreamsArr = streamArray.filter((x) => {
                return x.usersNow < x.userMax && x.status === 'online'
            })

            //getting random selection (max of 7 servers) to not overwhelm user
            const arr: Stream[] = []
            for (let i = 0; i < 7; i++) {
                const index = Math.floor(Math.random() * availableStreamsArr.length)
                const randomStream = availableStreamsArr[index]
                arr.push(randomStream)
                //take out stream from array of options, to not repeat option
                availableStreamsArr.splice(index, 1)
            }
            setStreamArray(arr)
        })
    }, [])

    //setting the closest server out of the 7 randomly chosen available and online servers to be default
    useEffect(() => {
        const arr: Stream[] = []
        streamArray.map((x) => {
            if (!navigator.geolocation) return
            //only runs once, despite having dependency on
            if (currentStream) return

            let dist: number
            navigator.geolocation.watchPosition((position) => {
                //get distance between user and server
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

                //setting a new stream with distance
                const distStream = { ...x, distance: dist }

                //pushing stream with distance to new array
                arr.push(distStream)

                // filtering if it already exists,
                const sortedClosestStreamArr = arr.filter((e, i) => arr.findIndex((a) => a.id === e.id) === i)

                //sorting by distance to user
                sortedClosestStreamArr.sort((a, b) => {
                    if (!a.distance || !b.distance) return 0
                    return a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
                })

                setCurrentStream(sortedClosestStreamArr[0])
            })
        })
    }, [streamArray])

    return (
        <Select
            sx={{
                width: '150px',
                maxHeight: '100%',
                borderRadius: '0',
                '& .MuiSelect-outlined': { padding: '0 1rem' },
                textAlign: 'center',
                '&:hover': {
                    backgroundColor: colors.darkNavy,
                },
            }}
            value={currentStream ? currentStream.id : ''}
            defaultValue={currentStream?.id}
            MenuProps={{
                sx: {
                    '&& .Mui-selected': {
                        backgroundColor: colors.darkerNeonBlue,
                    },
                },
                variant: 'menu',
                PaperProps: {
                    sx: {
                        bgcolor: colors.darkNavyBlue,
                    },
                },
            }}
        >
            {streamArray.map((x) => {
                return (
                    <MenuItem
                        sx={{
                            backgroundColor: colors.darkNavyBlue,
                            borderRadius: '0',
                            textAlign: 'center',
                            width: '100%',
                            '&:hover': {
                                backgroundColor: colors.darkNavy,
                            },
                        }}
                        key={x.id}
                        value={x.id}
                        onClick={() => {
                            setCurrentStream(x)
                        }}
                    >
                        <Typography
                            sx={{
                                borderRadius: '0',
                                textAlign: 'center',
                                width: '100%',
                            }}
                            variant="body1"
                        >
                            {x.name}
                        </Typography>
                    </MenuItem>
                )
            })}
        </Select>
    )
}
