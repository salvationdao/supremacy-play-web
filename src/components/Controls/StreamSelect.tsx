import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useWebsocket } from "../../containers/socket"
import { useStream } from "../../containers"
import { getObjectFromArrayByKey } from "../../helpers"
import HubKey from "../../keys"
import { colors } from "../../theme/theme"
import { Stream } from "../../types"

const MAX_OPTIONS = 7

export const StreamSelect = () => {
    const { state, subscribe } = useWebsocket()
    const { currentStream, setCurrentStream, setSelectedWsURL, setSelectedStreamID } = useStream()
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])

    // Subscribe to list of streams``
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
            return x.usersNow < x.userMax && x.status === "online"
        })

        if (availStreams.length <= 0) return

        // Reduce the list of options so it's not too many for the user
        // By default its sorted by quietest servers first
        const quietestStreams = availStreams.sort((a, b) => (a.usersNow / a.userMax > b.usersNow / b.userMax ? 1 : -1))
        SetNewStreamOptions(quietestStreams)
    }, [streams])

    const SetNewStreamOptions = (newStreamOptions: Stream[]) => {
        // Limit to only a few for the dropdown and include our current selection if not already in the list
        const temp = newStreamOptions.slice(0, MAX_OPTIONS)
        if (currentStream && !getObjectFromArrayByKey(temp, currentStream.host, "host")) {
            newStreamOptions[newStreamOptions.length - 1] = currentStream
        }

        // If there is no current stream selected then pick the first use default stream
        // if (!currentStream && newStreamOptions && newStreamOptions.length > 0) {
        //     setCurrentStream(newStreamOptions[0])
        //     setSelectedStreamID(newStreamOptions[0].streamID)
        //     setSelectedWsURL(newStreamOptions[0].url)
        // }

        // If there is nno current stream selected then pick the US one (for now)
        if (!currentStream && newStreamOptions && newStreamOptions.length > 0) {
            const usaStreams = newStreamOptions.filter((s) => s.name == "USA")
            if (usaStreams && usaStreams.length > 0) {
                setCurrentStream(usaStreams[0])
                setSelectedStreamID(usaStreams[0].streamID)
                setSelectedWsURL(usaStreams[0].url)
            }
        }

        // Reverse the order for rendering so best is closer to user's mouse
        setStreamOptions(temp.reverse())
    }

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                STREAM SERVER:{" "}
            </Typography>

            <Select
                sx={{
                    width: 150,
                    borderRadius: 0.5,
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    "& .MuiSelect-outlined": { px: 1, pt: 0.6, pb: 0 },
                }}
                defaultValue={currentStream?.host}
                value={currentStream ? currentStream.host : ""}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
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
                                setCurrentStream(x)
                                setSelectedStreamID(x.streamID)
                                setSelectedWsURL(x.url)
                            }}
                            sx={{
                                "&:hover": {
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
