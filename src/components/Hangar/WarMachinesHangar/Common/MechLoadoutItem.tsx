import { Box, Slide, Stack, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { SvgCancelled, SvgLock, SvgWrapperProps } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"
import { Rarity } from "../../../../types"
import { NiceButton, NiceButtonProps } from "../../../Common/Nice/NiceButton"

export interface LoadoutItem {
    TopRight?: React.ReactNode
    BottomRight?: React.ReactNode
    Icon?: React.VoidFunctionComponent<SvgWrapperProps>
    imageUrl?: string
    label: string
    subLabel?: string
    rarity?: Rarity
    disabled?: boolean
    locked?: boolean
    isEmpty?: boolean
    shape?: "square" | "rectangle"
    size?: "small" | "regular" | "full-width"
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export interface MechLoadoutItemProps extends LoadoutItem {
    prevEquipped?: LoadoutItem
    onUnequip?: () => void
    renderTooltip?: () => React.ReactNode
    side?: "left" | "right"
}

export const MechLoadoutItem = React.forwardRef<HTMLDivElement, MechLoadoutItemProps>(function MechLoadoutItem(props, ref) {
    const { prevEquipped, onUnequip, renderTooltip, side = "left", onClick, ...loadoutItemButtonProps } = props
    const memoizedPrevEquipped = useRef<LoadoutItem>()
    const [hideTooltip, setHideTooltip] = useState(false)

    useEffect(() => {
        if (!prevEquipped) return
        // Prevents white-page bug. Bug is caused by the Grow component
        // trying to render a MechLouadoutItemButton with a LoadoutItem that
        // has been set to undefined
        memoizedPrevEquipped.current = prevEquipped
    }, [prevEquipped])

    const button = (
        <MechLoadoutItemButton
            onClick={(e) => {
                if (onClick) {
                    onClick(e)
                }
            }}
            onMouseDown={() => setHideTooltip(true)}
            onMouseUp={() => setHideTooltip(false)}
            {...loadoutItemButtonProps}
        />
    )

    return (
        <Stack
            ref={ref}
            sx={{
                position: "relative",
                flexDirection: side === "right" ? "row-reverse" : "row",
                alignItems: "stretch",
                height: props.size === "full-width" ? "100%" : "auto",
                width: props.size === "full-width" ? "100%" : "fit-content",
            }}
        >
            {renderTooltip ? (
                <MaybeTooltip
                    sx={{
                        opacity: hideTooltip ? 0 : 1,
                        transition: "opacity .2s ease-out",
                    }}
                    title={<>{renderTooltip()}</>}
                    followCursor
                >
                    <Box
                        sx={{
                            height: props.size === "full-width" ? "100%" : "auto",
                            width: props.size === "full-width" ? "100%" : "fit-content",
                        }}
                    >
                        {button}
                    </Box>
                </MaybeTooltip>
            ) : (
                button
            )}
            <Box overflow="hidden">
                <Slide in={!!onUnequip} unmountOnExit>
                    <NiceButton
                        buttonColor={colors.red}
                        onClick={onUnequip}
                        disabled={props.disabled || props.locked}
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
    )
})

type MechLoadoutItemButtonProps = LoadoutItem & NiceButtonProps

const MechLoadoutItemButton = ({
    TopRight,
    BottomRight,
    Icon,
    imageUrl,
    label,
    subLabel,
    isEmpty,
    rarity,
    locked,
    disabled,
    shape = "rectangle",
    size = "regular",
    ...props
}: MechLoadoutItemButtonProps) => {
    const height = size === "full-width" ? "100%" : size === "regular" ? 120 : 100
    const width = size === "full-width" ? "100%" : size === "regular" ? 260 : 200
    const color = isEmpty ? "#ffffff88" : "white"

    return (
        <>
            <NiceButton
                corners
                disabled={disabled || locked}
                disableAutoColor
                buttonColor={rarity ? rarity.color : colors.darkGrey}
                sx={{
                    width: shape === "rectangle" ? width : height,
                    height: height,
                    padding: 0,
                }}
                {...props}
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
                {BottomRight && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: ".5rem",
                            right: ".5rem",
                        }}
                    >
                        {BottomRight}
                    </Box>
                )}
                {!isEmpty && (
                    <Stack
                        sx={{
                            position: "absolute",
                            left: ".5rem",
                            bottom: ".5rem",
                            whiteSpace: "normal",
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
                                    fontFamily: fonts.rajdhaniMedium,
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

const MaybeTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 300,
        padding: "0px !important",
        backgroundColor: "transparent",
        borderRadius: 0,
    },
})
