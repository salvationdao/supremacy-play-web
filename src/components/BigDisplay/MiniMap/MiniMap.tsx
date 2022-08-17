import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { MiniMapInside } from "../.."
import { useDimension, useGame } from "../../../containers"
import { useHotkey } from "../../../containers/hotkeys"
import { useMiniMap } from "../../../containers/minimap"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { Dimension, Map } from "../../../types"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { HighlightedMechAbilities } from "./MapOutsideItems/HighlightedMechAbilities"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const TOP_BAR_HEIGHT = 3.1 // rems
const BOTTOM_PADDING = 10 // rems

export const MiniMap = () => {
    const { map, bribeStage } = useGame()
    const { isTargeting, resetSelection } = useMiniMap()
    const [battleStarted, setBattleStarted] = useState(false)

    useEffect(() => {
        if (bribeStage && bribeStage.phase !== "HOLD" ? true : false) {
            setBattleStarted(true)
        } else {
            setBattleStarted(false)
            resetSelection()
        }
    }, [bribeStage, setBattleStarted, resetSelection])

    if (!map) {
        return null
    }

    if (!battleStarted) {
        // TODO: show message saying wait for battle to start
    }

    const isPoppedout = false // TODO

    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} />
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isPoppedout }: { map: Map; isTargeting: boolean; isPoppedout: boolean }) => {
    const { isStreamBigDisplay, setIsStreamBigDisplay } = useGame()
    const theme = useTheme()
    const { handleHotKey } = useHotkey()
    const { remToPxRatio, gameUIDimensions } = useDimension()

    const [renderDimensions, setRenderDimensions] = useState<Dimension>({ width: 100, height: 100 })
    const mapHeightWidthRatio = useRef(1)
    const prevIsStreamBigDisplay = useRef(isStreamBigDisplay)

    const containFit = useMemo(() => isPoppedout || !isStreamBigDisplay, [isPoppedout, isStreamBigDisplay])

    // Set size
    useEffect(() => {
        mapHeightWidthRatio.current = map.height / map.width

        let defaultWidth = gameUIDimensions.width
        let defaultHeight = 0
        if (!containFit) {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        } else {
            defaultHeight = Math.min(defaultWidth * mapHeightWidthRatio.current, gameUIDimensions.height)
        }

        setRenderDimensions({ width: defaultWidth, height: defaultHeight })
    }, [map, remToPxRatio, gameUIDimensions, isPoppedout, isStreamBigDisplay, containFit])

    // When it's targeting, enlarge to big display, else restore to the prev location
    useEffect(() => {
        if (isTargeting) {
            setIsStreamBigDisplay((prev) => {
                prevIsStreamBigDisplay.current = prev
                return false
            })
        } else {
            setIsStreamBigDisplay(prevIsStreamBigDisplay.current)
        }
    }, [isTargeting, setIsStreamBigDisplay])

    const sizes = useMemo(() => {
        const padding = 6 * remToPxRatio
        let outsideWidth = renderDimensions.width - padding
        let outsideHeight = renderDimensions.height - padding - BOTTOM_PADDING * remToPxRatio
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight - TOP_BAR_HEIGHT * remToPxRatio

        if (containFit) {
            const maxHeight = outsideWidth * mapHeightWidthRatio.current
            const maxWidth = outsideHeight / mapHeightWidthRatio.current

            if (outsideHeight > maxHeight) {
                outsideHeight = maxHeight
            }
            insideHeight = outsideHeight

            if (outsideWidth > maxWidth) {
                outsideWidth = maxWidth
                insideWidth = outsideWidth
            }
        }

        return {
            outsideWidth,
            outsideHeight,
            insideWidth,
            insideHeight,
        }
    }, [containFit, remToPxRatio, renderDimensions.height, renderDimensions.width])

    return useMemo(() => {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    pb: containFit ? `${BOTTOM_PADDING}rem` : 0,
                }}
            >
                <Box
                    tabIndex={0}
                    onKeyDown={handleHotKey}
                    sx={{
                        position: "relative",
                        boxShadow: 1,
                        width: sizes.outsideWidth,
                        height: sizes.outsideHeight,
                        transition: "all .2s",
                        overflow: "hidden",
                        pointerEvents: "all",
                        border: isPoppedout ? `${theme.factionTheme.primary} 1.5px solid` : "unset",
                        zIndex: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            height: `${TOP_BAR_HEIGHT}rem`,
                            px: "1.8rem",
                            backgroundColor: "#000000BF",
                            borderBottom: `${theme.factionTheme.primary}80 .25rem solid`,
                            zIndex: 99,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                lineHeight: 1,
                                opacity: 0.8,
                            }}
                        >
                            {map.name
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>
                    </Stack>

                    <MiniMapInside containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }} />

                    <TargetHint />

                    <HighlightedMechAbilities />
                </Box>

                {/* Not scaled map background image, for background only */}
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `url(${map?.image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: 0.15,
                        zIndex: 1,
                    }}
                />
            </Stack>
        )
    }, [
        containFit,
        handleHotKey,
        sizes.outsideWidth,
        sizes.outsideHeight,
        sizes.insideWidth,
        sizes.insideHeight,
        isPoppedout,
        theme.factionTheme.primary,
        map.name,
        map?.image_url,
    ])
}
