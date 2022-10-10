import { Box, Grow, IconButton, Skeleton, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgDrag, SvgLock, SvgPlus, SvgRemove, SvgSkin, SvgSwap, SvgWrapperProps } from "../../../../assets"
import { shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { CropMaxLengthText } from "../../../../theme/styles"
import { colors, fonts } from "../../../../theme/theme"
import { Rarity } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MediaPreviewModal } from "../../../Common/MediaPreview/MediaPreviewModal"

export interface LoadoutItem {
    slotNumber?: number
    imageUrl?: string
    videoUrls?: (string | undefined)[] | undefined
    label: string
    subLabel?: string
    onClick?: () => void
    rarity?: Rarity
    hasSkin?: boolean
    primaryColor: string
    imageTransform?: string
    Icon?: React.VoidFunctionComponent<SvgWrapperProps>
    locked?: boolean
    disabled?: boolean
    isEmpty?: boolean
}

export interface MechLoadoutItemProps extends LoadoutItem {
    side?: "left" | "right"
    prevEquipped?: LoadoutItem
    onUnequip?: () => void
    renderModal?: (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => React.ReactNode
}

export const MechLoadoutItem = React.forwardRef<HTMLDivElement, MechLoadoutItemProps>(function MechLoadoutItem(props, ref) {
    const { imageUrl, videoUrls } = props
    const { side = "left", prevEquipped, onUnequip, renderModal, onClick, ...loadoutItemButtonProps } = props
    const [showLoadoutModal, toggleShowLoadoutModal] = useToggle()
    const memoizedPrevEquipped = useRef<LoadoutItem>()

    useEffect(() => {
        if (!prevEquipped) return
        // Prevents white-page bug. Bug is caused by the Grow component
        // trying to render a MechLouadoutItemButton with a LoadoutItem that
        // has been set to undefined
        memoizedPrevEquipped.current = prevEquipped
    }, [prevEquipped])

    return (
        <>
            <Stack
                ref={ref}
                position="relative"
                direction={side === "left" ? "row" : "row-reverse"}
                spacing="1rem"
                alignItems="center"
                sx={{ position: "relative", p: ".8rem", width: "fit-content" }}
            >
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <MechLoadoutItemButton
                        onClick={() => {
                            onClick && onClick()
                            toggleShowLoadoutModal(true)
                        }}
                        {...loadoutItemButtonProps}
                    />
                    {!props.disabled && !props.locked && onUnequip && (
                        <IconButton
                            onClick={() => {
                                onUnequip()
                            }}
                            sx={{
                                zIndex: 10,
                                position: "absolute",
                                top: "1rem",
                                right: "1rem",
                            }}
                        >
                            <SvgRemove fill={colors.red} />
                        </IconButton>
                    )}
                </Box>
                <Grow in={!!prevEquipped} mountOnEnter unmountOnExit>
                    <Stack direction={side === "left" ? "row" : "row-reverse"} alignItems="center">
                        <SvgSwap sx={{ opacity: 0.6 }} />
                        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                        <MechLoadoutItemButton {...(prevEquipped! || memoizedPrevEquipped.current)} isPreviouslyEquipped />
                    </Stack>
                </Grow>
            </Stack>

            {showLoadoutModal &&
                (renderModal ? (
                    renderModal(toggleShowLoadoutModal)
                ) : (
                    <MediaPreviewModal imageUrl={imageUrl} videoUrls={videoUrls} onClose={() => toggleShowLoadoutModal(false)} />
                ))}
        </>
    )
})

interface MechLoadoutItemButtonProps extends LoadoutItem {
    isPreviouslyEquipped?: boolean
}

const MechLoadoutItemButton = ({
    slotNumber,
    imageUrl,
    videoUrls,
    label,
    subLabel,
    primaryColor,
    onClick,
    isEmpty,
    Icon,
    rarity,
    hasSkin,
    imageTransform,
    locked,
    disabled,
    isPreviouslyEquipped,
}: MechLoadoutItemButtonProps) => {
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    return (
        <FancyButton
            disabled={disabled || locked}
            clipThingsProps={{
                clipSize: "10px",
                clipSlantSize: "0px",
                corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                backgroundColor,
                opacity: 0.9,
                border: { isFancy: false, borderColor: primaryColor, borderThickness: ".3rem" },
                sx: {
                    position: "relative",
                    ...(isPreviouslyEquipped
                        ? {
                              transform: "scale(0.8)",
                              ml: "-.5rem !important",
                          }
                        : {}),
                },
            }}
            sx={{ p: 0, color: primaryColor }}
            onClick={() => {
                onClick && onClick()
            }}
        >
            {locked && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: colors.black2,
                        opacity: 0.6,
                    }}
                >
                    <SvgLock />
                </Stack>
            )}
            {isPreviouslyEquipped && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: colors.black2,
                        opacity: 0.6,
                    }}
                >
                    <Typography>Reset Selection</Typography>
                </Stack>
            )}
            <Stack spacing="1rem" alignItems="center" sx={{ height: "16rem", width: "16rem", p: "1rem", textAlign: "center" }}>
                <Stack justifyContent="center" sx={{ position: "relative", height: "9rem", alignSelf: "stretch", backgroundColor: "#00000060" }}>
                    {isEmpty ? (
                        <SvgPlus fill={`${primaryColor}80`} size="2rem" />
                    ) : (
                        <MediaPreview
                            imageUrl={imageUrl}
                            videoUrls={videoUrls}
                            objectFit="contain"
                            sx={{ p: ".5rem", pointerEvents: "none" }}
                            imageTransform={imageTransform}
                        />
                    )}

                    <Stack spacing=".3rem" direction="row" alignItems="center" sx={{ position: "absolute", top: ".1rem", left: ".5rem" }}>
                        {Icon && <Icon fill={primaryColor} size="1.8rem" />}
                        {hasSkin && <SvgSkin fill={colors.chassisSkin} size="1.4rem" />}
                    </Stack>

                    {slotNumber != null && (
                        <Typography
                            sx={{
                                position: "absolute",
                                top: ".1rem",
                                right: ".5rem",
                                opacity: 0.6,
                            }}
                        >
                            SLOT {slotNumber}
                        </Typography>
                    )}

                    {rarity && (
                        <Typography
                            variant="caption"
                            sx={{ position: "absolute", bottom: ".3rem", left: 0, right: 0, color: rarity.color, fontFamily: fonts.nostromoBlack }}
                        >
                            {rarity.label}
                        </Typography>
                    )}
                </Stack>

                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: primaryColor,
                            fontFamily: fonts.nostromoBold,
                            ...CropMaxLengthText,
                            WebkitLineClamp: 2,
                        }}
                    >
                        {label}
                    </Typography>

                    {subLabel && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: primaryColor,
                                fontFamily: fonts.nostromoBold,
                                ...CropMaxLengthText,
                            }}
                        >
                            {subLabel}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </FancyButton>
    )
}

export const MechLoadoutItemSkeleton = () => {
    return (
        <Box>
            <ClipThing>
                <Skeleton variant="rectangular" width="100%" height={130} />
            </ClipThing>
        </Box>
    )
}

interface MechLoadoutItemDraggableProps extends LoadoutItem {
    style?: React.CSSProperties
    className?: string
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>
    onTouchStart?: React.TouchEventHandler<HTMLDivElement>
    something?: boolean
}

export const MechLoadoutItemDraggable = React.forwardRef<HTMLDivElement, MechLoadoutItemDraggableProps>(function MechLoadoutItemDraggable(
    { slotNumber, imageUrl, videoUrls, label, subLabel, primaryColor, isEmpty, Icon, rarity, hasSkin, imageTransform, locked, ...draggableProps },
    ref,
) {
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    return (
        <Stack ref={ref} position="relative" direction="row" spacing="1rem" alignItems="center" {...draggableProps}>
            {locked && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: colors.black2,
                        opacity: 0.6,
                    }}
                >
                    <SvgLock />
                </Stack>
            )}
            <ClipThing
                clipSize={"10px"}
                clipSlantSize={"0px"}
                corners={{ topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }}
                backgroundColor={backgroundColor}
                opacity={0.9}
                border={{ isFancy: false, borderColor: primaryColor, borderThickness: ".3rem" }}
                sx={{
                    width: "100%",
                }}
            >
                <Stack spacing="1rem" alignItems="center" sx={{ width: "100%", maxWidth: "16rem", p: "1rem", textAlign: "center" }}>
                    <Stack justifyContent="center" sx={{ position: "relative", height: "9rem", alignSelf: "stretch", backgroundColor: "#00000060" }}>
                        {isEmpty ? (
                            <SvgPlus fill={`${primaryColor}80`} size="2rem" />
                        ) : (
                            <MediaPreview
                                imageUrl={imageUrl}
                                videoUrls={videoUrls}
                                objectFit="contain"
                                sx={{ p: ".5rem", pointerEvents: "none" }}
                                imageTransform={imageTransform}
                            />
                        )}

                        <Stack spacing=".3rem" direction="row" alignItems="center" sx={{ position: "absolute", top: ".1rem", left: ".5rem" }}>
                            {Icon && <Icon fill={primaryColor} size="1.8rem" />}
                            {hasSkin && <SvgSkin fill={colors.chassisSkin} size="1.4rem" />}
                        </Stack>
                        <Stack
                            sx={{
                                position: "absolute",
                                top: ".1rem",
                                right: ".5rem",
                            }}
                        >
                            <SvgDrag fill={`${primaryColor}aa`} />
                        </Stack>

                        {slotNumber != null && (
                            <Typography
                                sx={{
                                    position: "absolute",
                                    top: ".1rem",
                                    right: ".5rem",
                                    opacity: 0.6,
                                }}
                            >
                                SLOT {slotNumber}
                            </Typography>
                        )}

                        {rarity && (
                            <Typography
                                variant="caption"
                                sx={{ position: "absolute", bottom: ".3rem", left: 0, right: 0, color: rarity.color, fontFamily: fonts.nostromoBlack }}
                            >
                                {rarity.label}
                            </Typography>
                        )}
                    </Stack>

                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: primaryColor,
                                fontFamily: fonts.nostromoBold,
                                ...CropMaxLengthText,
                                WebkitLineClamp: 2,
                            }}
                        >
                            {label}
                        </Typography>

                        {subLabel && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: primaryColor,
                                    fontFamily: fonts.nostromoBold,
                                    ...CropMaxLengthText,
                                }}
                            >
                                {subLabel}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </ClipThing>
        </Stack>
    )
})
