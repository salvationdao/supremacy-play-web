import { Box, Slide, Stack, Typography } from "@mui/material"
import React, { MouseEventHandler, useEffect, useRef } from "react"
import { SvgCancelled, SvgLock, SvgWrapperProps } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Rarity } from "../../../../types"
import { NiceButton } from "../../../Common/Nice/NiceButton"

export interface LoadoutItem {
    TopRight?: React.ReactNode
    Icon?: React.VoidFunctionComponent<SvgWrapperProps>
    slotNumber?: number
    imageUrl?: string
    label: string
    subLabel?: string
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLDivElement>
    rarity?: Rarity
    locked?: boolean
    disabled?: boolean
    isEmpty?: boolean
    shape?: "square" | "rectangle"
    size?: "small" | "regular" | "full-width"
}

export interface MechLoadoutItemProps extends LoadoutItem {
    prevEquipped?: LoadoutItem
    onUnequip?: () => void
    renderModal?: (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => React.ReactNode
    side?: "left" | "right"
}

export const MechLoadoutItem = React.forwardRef<HTMLDivElement, MechLoadoutItemProps>(function MechLoadoutItem(props, ref) {
    const { prevEquipped, onUnequip, renderModal, side = "left", onClick, ...loadoutItemButtonProps } = props
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
                sx={{
                    position: "relative",
                    flexDirection: side === "right" ? "row-reverse" : "row",
                    alignItems: "stretch",
                    height: "auto",
                    width: props.size === "full-width" ? "100%" : "fit-content",
                }}
            >
                <MechLoadoutItemButton
                    onClick={(e) => {
                        onClick && onClick(e)
                        toggleShowLoadoutModal(true)
                    }}
                    {...loadoutItemButtonProps}
                />
                <Box overflow="hidden">
                    <Slide in={!!onUnequip} unmountOnExit>
                        <NiceButton
                            onClick={onUnequip}
                            disabled={props.disabled || props.locked}
                            border={{
                                color: colors.red,
                                thickness: "lean",
                            }}
                            sx={
                                side === "right"
                                    ? {
                                          borderRight: "none",
                                      }
                                    : {
                                          borderLeft: "none",
                                      }
                            }
                        >
                            <SvgCancelled />
                        </NiceButton>
                    </Slide>
                </Box>
            </Stack>

            {showLoadoutModal && renderModal && renderModal(toggleShowLoadoutModal)}
        </>
    )
})

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
}: LoadoutItem) => {
    const height = size === "full-width" ? "auto" : size === "regular" ? 120 : 100
    const width = size === "full-width" ? "100%" : size === "regular" ? 260 : 200
    const color = isEmpty ? "#ffffff88" : "white"

    return (
        <>
            <NiceButton
                onClick={onClick}
                disabled={disabled || locked}
                border={{
                    color: rarity ? rarity.color : colors.darkGrey,
                    thickness: "lean",
                }}
                caret={
                    !isEmpty
                        ? {
                              position: "bottom-right",
                          }
                        : undefined
                }
                background={{
                    color: [colors.black2, rarity ? rarity.color : colors.darkGrey],
                    opacity: "half",
                }}
                sx={{
                    width: shape === "rectangle" ? width : height,
                    height: height,
                    padding: 0,
                }}
            >
                {/* Maintain aspect ratio with padding-bottom hack */}
                {size === "full-width" && (
                    <Box
                        sx={{
                            pb: shape === "square" ? "100%" : "56.25%",
                        }}
                    />
                )}
                {isEmpty ? (
                    <Stack
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontSize: size === "regular" ? "2.6rem" : "2rem",
                                color,
                            }}
                        >
                            EMPTY
                        </Typography>
                    </Stack>
                ) : (
                    <>
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={label}
                            sx={{
                                width: "100%",
                                height: "100%",
                                maxHeight: size === "full-width" && shape === "rectangle" ? 100 : undefined,
                                objectFit: "contain",
                                pointerEvents: "none",
                            }}
                        />
                    </>
                )}
                {Icon && (
                    <Icon
                        fill="white"
                        sx={{
                            position: "absolute",
                            top: ".5rem",
                            left: ".5rem",
                        }}
                        width={size === "small" ? "2.6rem" : "4rem"}
                        height="auto"
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
                                textAlign: "left",
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
