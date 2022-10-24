import { Box, Grow, Skeleton, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef } from "react"
import { ClipThing } from "../../.."
import { SvgLock, SvgSwap, SvgWrapperProps } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Rarity } from "../../../../types"
import { BackgroundOpacity, CaretPosition } from "../../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../../Common/Nice/NiceButton"

export interface LoadoutItem {
    TopRight?: React.ReactNode
    Icon?: React.VoidFunctionComponent<SvgWrapperProps>
    slotNumber?: number
    imageUrl?: string
    label: string
    subLabel?: string
    onClick?: () => void
    rarity?: Rarity
    locked?: boolean
    disabled?: boolean
    isEmpty?: boolean
    shape?: "square" | "rectangle"
    size?: "small" | "regular"
}

export interface MechLoadoutItemProps extends LoadoutItem {
    side?: "left" | "right"
    prevEquipped?: LoadoutItem
    onUnequip?: () => void
    renderModal?: (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => React.ReactNode
}

export const MechLoadoutItem = React.forwardRef<HTMLDivElement, MechLoadoutItemProps>(function MechLoadoutItem(props, ref) {
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

                    {/* {!props.disabled && !props.locked && onUnequip && (
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
                    )} */}
                </Box>
                <Grow in={!!prevEquipped} mountOnEnter unmountOnExit>
                    <Stack direction={side === "left" ? "row" : "row-reverse"} alignItems="center">
                        <SvgSwap sx={{ opacity: 0.6 }} />
                        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                        <MechLoadoutItemButton {...(prevEquipped! || memoizedPrevEquipped.current)} isPreviouslyEquipped />
                    </Stack>
                </Grow>
            </Stack>

            {showLoadoutModal && renderModal && renderModal(toggleShowLoadoutModal)}
        </>
    )
})

interface MechLoadoutItemButtonProps extends LoadoutItem {
    isPreviouslyEquipped?: boolean
}

const MechLoadoutItemButton = ({
    TopRight,
    Icon,
    slotNumber,
    imageUrl,
    label,
    subLabel,
    onClick,
    isEmpty,
    rarity,
    locked,
    disabled,
    shape = "rectangle",
    size = "regular",
    isPreviouslyEquipped,
}: MechLoadoutItemButtonProps) => {
    const height = size === "regular" ? 120 : 100
    const width = size === "regular" ? 260 : 200
    const color = isEmpty ? "#ffffff88" : "white"

    return (
        <>
            <NiceButton
                onClick={onClick}
                disabled={disabled || locked}
                border={{
                    color: rarity ? rarity.color : colors.darkGrey,
                    thickness: 2,
                }}
                caret={
                    !isEmpty
                        ? {
                              position: CaretPosition.BottomRight,
                          }
                        : undefined
                }
                background={{
                    color: [colors.black2, rarity ? rarity.color : colors.darkGrey],
                    opacity: BackgroundOpacity.Half,
                }}
                sx={{
                    width: shape === "rectangle" ? width : height,
                    height: height,
                    padding: 0,
                }}
            >
                {isEmpty ? (
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontSize: size === "regular" ? "2.6rem" : "2rem",
                                color,
                            }}
                        >
                            EMPTY
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={imageUrl}
                        alt={label}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                )}
                {Icon && (
                    <Icon
                        fill="white"
                        size="3rem"
                        sx={{
                            position: "absolute",
                            top: ".5rem",
                            left: ".5rem",
                        }}
                    />
                )}
                {TopRight && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: ".5rem",
                            right: ".5rem",
                        }}
                    >
                        {TopRight}
                    </Box>
                )}
                {!isEmpty && (
                    <Stack
                        sx={{
                            position: "absolute",
                            left: ".5rem",
                            bottom: ".5rem",
                        }}
                        alignItems="start"
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBold,
                                fontSize: size === "regular" ? "1.6rem" : "1.4rem",
                                color,
                            }}
                        >
                            {label}
                        </Typography>
                        {subLabel && (
                            <Typography
                                sx={{
                                    fontFamily: fonts.shareTech,
                                    fontSize: size === "regular" ? "1.4rem" : "1.2rem",
                                    color,
                                }}
                            >
                                {subLabel}
                            </Typography>
                        )}
                    </Stack>
                )}
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
            </NiceButton>
        </>
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
}

const MechLoadoutItemDraggableBase = React.forwardRef<HTMLDivElement, MechLoadoutItemDraggableProps>(function MechLoadoutItemDraggable(
    { slotNumber, imageUrl, label, subLabel, isEmpty, Icon, rarity, locked, ...draggableProps },
    ref,
) {
    return <Stack ref={ref} position="relative" direction="row" spacing="1rem" alignItems="center" {...draggableProps}></Stack>
})

export const MechLoadoutItemDraggable = React.memo(MechLoadoutItemDraggableBase)
