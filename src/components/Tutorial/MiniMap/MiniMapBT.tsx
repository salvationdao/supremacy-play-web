import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { useDimension, useTraining } from "../../../containers"
import { fonts } from "../../../theme/theme"
import { BattleAbilityStages, Map, PlayerAbilityStages, TrainingLocationSelects } from "../../../types"
import { TOP_BAR_HEIGHT } from "../../BigDisplay/MiniMap/MiniMap"
import { LEFT_DRAWER_WIDTH } from "../LeftDrawer/LeftDrawerBT"
import { HighlightedMechAbilitiesBT } from "./MapOutsideItems/HighlightedMechAbilitiesBT"
import { TargetHintBT } from "./MapOutsideItems/TargetHintBT"
import { MiniMapInsideBT } from "./MiniMapInsideBT"

const PADDING = 6 // rems
const BOTTOM_PADDING = 10.5 // rems

export const MiniMapBT = () => {
    const ref = useRef<HTMLElement | null>(null)
    const { map, isStreamBigDisplay, smallDisplayRef, bigDisplayRef } = useTraining()

    useEffect(() => {
        const thisElement = ref.current
        const newContainerElement = isStreamBigDisplay ? smallDisplayRef : bigDisplayRef

        if (thisElement && newContainerElement) {
            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay, smallDisplayRef, bigDisplayRef])

    return useMemo(() => {
        if (!map) return null

        return (
            <Box ref={ref}>
                <MiniMapInner map={map} />
            </Box>
        )
    }, [map])
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map }: { map: Map }) => {
    const {
        remToPxRatio,
        gameUIDimensions: { width, height },
    } = useDimension()
    const { setTutorialRef, trainingStage, setIsStreamBigDisplay, isStreamBigDisplay, isEnlarged } = useTraining()

    const ref = useRef<HTMLDivElement>(null)
    const mapHeightWidthRatio = useRef(1)

    useEffect(() => {
        if (trainingStage in TrainingLocationSelects) {
            setIsStreamBigDisplay(false)
        } else {
            setIsStreamBigDisplay(true)
        }
    }, [setIsStreamBigDisplay, trainingStage])

    useEffect(() => {
        if (
            !isStreamBigDisplay &&
            trainingStage in TrainingLocationSelects &&
            trainingStage !== BattleAbilityStages.LocationExplainBA &&
            trainingStage !== PlayerAbilityStages.LocationExplainPA
        ) {
            setTutorialRef(ref)
        }
    }, [setTutorialRef, ref, trainingStage, isStreamBigDisplay])

    // Set size
    const sizes = useMemo(() => {
        // Step 1
        mapHeightWidthRatio.current = map.Height / map.Width

        let defaultWidth = width
        let defaultHeight = 0
        if (!isStreamBigDisplay) {
            defaultHeight = Math.min(defaultWidth * mapHeightWidthRatio.current, height)
        } else {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        }

        if (isEnlarged) defaultHeight = height

        // Step 2
        const padding = !isStreamBigDisplay && !isEnlarged ? PADDING * remToPxRatio : 0
        let bottomPadding = padding
        if (!isStreamBigDisplay) bottomPadding += BOTTOM_PADDING * remToPxRatio

        let outsideWidth = defaultWidth - padding
        let outsideHeight = defaultHeight - bottomPadding
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight

        if (!isStreamBigDisplay && !isEnlarged) {
            const maxHeight = outsideWidth * mapHeightWidthRatio.current
            const maxWidth = outsideHeight / mapHeightWidthRatio.current

            if (outsideHeight > maxHeight) outsideHeight = maxHeight
            insideHeight = outsideHeight

            if (outsideWidth > maxWidth) {
                outsideWidth = maxWidth
                insideWidth = outsideWidth
            }
        }

        outsideHeight += TOP_BAR_HEIGHT * remToPxRatio

        return {
            outsideWidth,
            outsideHeight,
            insideWidth,
            insideHeight,
        }
    }, [map, width, isStreamBigDisplay, isEnlarged, height, remToPxRatio])

    return useMemo(() => {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    pb: !isStreamBigDisplay ? `${BOTTOM_PADDING}rem` : 0,
                    boxShadow: 2,
                    border: (theme) => `${theme.factionTheme.primary}60 1px solid`,
                }}
            >
                <Box
                    ref={ref}
                    tabIndex={0}
                    sx={{
                        position: "relative",
                        boxShadow: 1,
                        width: sizes.outsideWidth,
                        height: sizes.outsideHeight,
                        transition: "width .2s, height .2s",
                        overflow: "hidden",
                        pointerEvents: "all",
                        zIndex: 2,
                        boxSizing: "border-box",
                        "&.MuiBox-root": {
                            border: "1px transparent solid",

                            outline: "none",
                        },
                    }}
                >
                    {/* Top bar */}
                    <Stack
                        spacing="1rem"
                        direction="row"
                        alignItems="center"
                        sx={{
                            p: ".6rem 1.6rem",
                            height: `${TOP_BAR_HEIGHT}rem`,
                            background: (theme) => `linear-gradient(${theme.factionTheme.background} 26%, ${theme.factionTheme.background}BB)`,
                            zIndex: 99,
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>
                            {map.Name.replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>
                    </Stack>

                    <MiniMapInsideBT containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }} />

                    <TargetHintBT />

                    <HighlightedMechAbilitiesBT />
                </Box>

                {/* not scaled map background image, for background only */}
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `url(${map?.Image_Url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: 0.15,
                        zIndex: 1,
                    }}
                />
            </Stack>
        )
    }, [sizes.outsideWidth, sizes.outsideHeight, sizes.insideWidth, sizes.insideHeight, map.Name, map?.Image_Url, isStreamBigDisplay])
}
