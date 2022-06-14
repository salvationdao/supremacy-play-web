import { Box, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useEffect, useState } from "react"
import { SupBackground } from "../../assets"
import { DEV_ONLY, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream } from "../../containers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { Music } from "../Music/Music"
import { Trailer } from "./Trailer"

import OvenPlayer from "ovenplayer"

interface OvenPlayerConfig {
    aspectRatio?: string
    title?: string
    waterMark?: object
    autoStart?: boolean
    autoFallback?: boolean
    controls?: boolean
    loop?: boolean
    showBigPlayButton?: boolean
    disableSeekUI?: boolean
    showSeekControl?: boolean
    seekControlInterval?: number
    expandFullScreenUI?: boolean
    mute?: boolean
    timecode?: boolean
    playbackRate?: number
    playbackRates?: number[]
    currentProtocolOnly?: boolean
    tracks?: object[]
    volume?: number
    adTagUrl?: string
    adClient?: "googleima" | "vast"
    playlist?: OvenPlayerPlayList
    hidePlaylistIcon?: boolean
    webrtcConfig?: object
    hlsConfig?: any
    dashConfig?: any
    sources: OvenPlayerSource[]
}

type OvenPlayerPlayList = OvenPlayerSource[][]

interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
}

export const Stream = () => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const { iframeDimensions } = useDimension()
    const { currentStream, isMute, streamResolutions, vidRefCallback } = useStream()
    const { isOpen } = useTour()

    const options: OvenPlayerConfig = {
        sources: [
            {
                label: "label_for_webrtc",
                // Set the type to 'webrtc'
                type: "mp4",
                file: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            },
        ],
    }

    if (!watchedTrailer) {
        return <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} />
    }

    if (isOpen) return null

    const isPlaying = streamResolutions && streamResolutions.length > 0

    return (
        <>
            {currentStream?.name === "newthing" ? (
                <OutputPlayerOven
                    playerConfig="file"
                    link="test"
                    conenctMetaSocket={() => {}}
                    handlePlayEnd={(s: string) => {}}
                    setCurrentPlayBack={(s: string) => {}}
                    handleVideoSeek={(s: string) => {}}
                    sources={options.sources}
                />
            ) : (
                <Stack sx={{ width: "100%", height: "100%", zIndex: siteZIndex.Stream }}>
                    {!isPlaying && <NoStreamScreen />}

                    <video
                        key={currentStream?.stream_id}
                        id={"remoteVideo"}
                        muted={isMute}
                        ref={vidRefCallback}
                        autoPlay
                        controls={false}
                        playsInline
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                            width: iframeDimensions.width,
                            height: iframeDimensions.height,
                            zIndex: siteZIndex.Stream,
                            background: isPlaying ? "unset" : `center url(${SupBackground}) ${colors.darkNavy} cover no-repeat`,
                        }}
                    />
                </Stack>
            )}

            {DEV_ONLY && <Music />}
        </>
    )
}

// Shows a generic poster and checks wallet for sups, and toggle have sups
const NoStreamScreen = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: `center url(${SupBackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: siteZIndex.Stream + 1,
            }}
        >
            <Stack
                sx={{
                    position: "relative",
                    alignItems: "center",
                    textAlign: "center",
                    WebkitTextStrokeColor: "black",
                    textShadow: "1px 3px black",
                    zIndex: 2,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        WebkitTextStrokeWidth: "2px",
                        "@media (max-width:1440px)": {
                            fontSize: "5vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "6vmin",
                        },
                    }}
                >
                    Battle Arena
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        WebkitTextStrokeWidth: "1px",
                        "@media (max-width:1440px)": {
                            fontSize: "4vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "5vmin",
                        },
                    }}
                >
                    Powered by <span style={{ color: colors.yellow, fontFamily: "inherit" }}>$SUPS</span>
                </Typography>
            </Stack>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(5,12,18,0.4)",
                    zIndex: 1,
                }}
            />
        </Box>
    )
}

const OutputPlayerOven = (props: {
    playerConfig: string
    link: string
    conenctMetaSocket: () => void

    handlePlayEnd: (s: string) => void
    setCurrentPlayBack: (arg: any) => void
    handleVideoSeek: (arg: any) => void

    sources: OvenPlayerSource[]
}) => {
    const [loading, setLoading] = useState(true)
    const [showGoLiveButton, setShowGoLiveButton] = useState(false)
    const [sourceFile, setSourceFile] = useState(true)
    const [userSeek, setUserSeek] = useState(true)

    let ovenPlayer: any = null
    let reloadTimeout: any
    let posTimeout: any

    // useEffect(() => {
    //     // OvenPlayer.debug(true)

    //     return () => {
    //         // cleaned up
    //         ovenPlayer = null
    //         clearTimeout(posTimeout)
    //     }
    // }, [])

    // useEffect(() => {
    //     if (props.playerConfig === "file") setSourceFile(true)
    //     else setSourceFile(false)
    // }, [props.playerConfig])

    const loadOvenPlayer = () => {
        console.log("in loadOvenPlayer")

        // if (ovenPlayer) {
        //   ovenPlayer.remove()
        // }

        // let source: OvenPlayerSource[] = [
        //     {
        //         label: `testStream`,
        //         type: "webrtc",
        //         file: "path",
        //     },
        // ]

        if (document.getElementById("player")) {
            ovenPlayer = OvenPlayer.create("player", {
                // autoStart: true,
                // controls: true,
                // mute: true,
                // autoFallback: true,
                // currentProtocolOnly: false,
                // showBigPlayButton: false,
                // showSeekControl: false,
                // disableSeekUI: false,
                // hidePlaylistIcon: true,
                // timecode: true,
                // playbackRate: 1,
                // playbackRates: [1],
                sources: props.sources,
            })

            // Reload OvenPlayer when error occured.
            ovenPlayer.on("error", (error: any) => {
                // console.log('error =>', error)

                // Wait 2 sec and relaod.
                reloadTimeout = setTimeout(() => {
                    loadOvenPlayer()
                }, 2000)
            })

            ovenPlayer.on("ready", () => {
                getPosition()
            })
            ovenPlayer.on("metaChanged", (event: any) => {
                console.log("metaChanged =>", event)
                props.conenctMetaSocket()
            })
            ovenPlayer.on("stateChanged", (event: any) => {
                if (event.newstate === "playing") {
                    clearTimeout(reloadTimeout)
                    console.log("Play time=>", new Date())
                    setLoading(false)
                } else if (event.newstate === "complete") {
                    props.handlePlayEnd("ended")
                    clearTimeout(posTimeout)
                }
            })
            ovenPlayer.on("seeked", () => {
                setLoading(false)
            })
            ovenPlayer.on("time", (event: any) => {
                console.log("time update =>", event)
                props.setCurrentPlayBack(event.position)
                // seekHandler(event: any)
            })
        }
    }

    const getPosition = () => {
        // if (ovenPlayer) {
        //     let position = ovenPlayer.getPosition()
        //     console.log("position before if =>", position)
        //     if (position) {
        //         console.log("position =>", position)
        //         props.setCurrentPlayBack(position)
        //     }
        // }
        // posTimeout = setTimeout(() => {
        //     getPosition()
        // }, 1000)
    }

    useEffect(() => {
        if ((props.link || props.sources.length) && props.playerConfig) loadOvenPlayer()
    }, [])

    const handleLiveClick = () => {
        if (!sourceFile) {
            setShowGoLiveButton(false)
        }
        const player = document.getElementById("player")
        // player.currentTime = player.duration
    }

    const seekHandler = (event: any) => {
        if (!sourceFile) {
            if (userSeek) {
                setUserSeek(false)
            } else {
                setShowGoLiveButton(true)
                console.log("handleVideoSeek =>", event.newstate, event.position, event.newstate - event.position)
                if (event.newstate - event.position < 60) {
                    props.handleVideoSeek(undefined)
                } else {
                    props.handleVideoSeek(event.position)
                }
            }
        }
    }

    return (
        <div className="outputPlayerWrapper">
            {loading ? "loading" : null}
            <div id="player" style={{ opacity: loading ? 0 : 1 }} />
            {showGoLiveButton ? (
                <div className="resumeLive" onClick={handleLiveClick}>
                    <div className="resumeLiveIcon"></div>
                    <span className="resumeLiveLabel">Go Live</span>
                </div>
            ) : null}
        </div>
    )
}
