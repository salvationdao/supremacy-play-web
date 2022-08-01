import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../assets"
import { useSnackbar } from "../../containers"
import { supFormatter } from "../../helpers"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { scaleUpKeyframes } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { LocationSelectType, SaleAbility, SaleAbilityAvailability } from "../../types"
import { FancyButton } from "../Common/FancyButton"
import { TooltipHelper } from "../Common/TooltipHelper"

export interface QuickPlayerAbilitiesItemProps {
    saleAbility: SaleAbility
    price?: string
    amount?: number
    setError: React.Dispatch<React.SetStateAction<string | undefined>>
    onClaim: () => void
    onPurchase: () => void
    availability: SaleAbilityAvailability
}

export const QuickPlayerAbilitiesItem = ({
    saleAbility,
    price = saleAbility.current_price,
    amount = 0,
    setError,
    onClaim: onClaimCallback,
    onPurchase: onPurchaseCallback,
    availability,
}: QuickPlayerAbilitiesItemProps) => {
    // Purchasing
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [loading, setLoading] = useState(false)

    const disabled = availability === SaleAbilityAvailability.Unavailable

    const actionWord = useMemo(() => {
        switch (availability) {
            case SaleAbilityAvailability.CanPurchase:
                return (
                    <Typography>
                        PURCHASE ABILITY FOR{" "}
                        <Box
                            key={price}
                            component="span"
                            sx={{
                                animation: `${scaleUpKeyframes} .2s ease-out`,
                            }}
                        >
                            {supFormatter(price, 2)} SUPS
                        </Box>
                    </Typography>
                )
            case SaleAbilityAvailability.CanClaim:
                return <Typography>CLAIM ABILITY</Typography>
            default:
                return <Typography>UNAVAILABLE</Typography>
        }
    }, [availability, price])

    const [abilityTypeIcon] = useMemo(() => {
        switch (saleAbility.ability.location_select_type) {
            case LocationSelectType.GLOBAL:
                return [<SvgGlobal key={LocationSelectType.GLOBAL} />, "This ability will affect all units on the map."]
            case LocationSelectType.LOCATION_SELECT:
                return [<SvgTarget key={LocationSelectType.LOCATION_SELECT} />, "This ability will target a specific location on the map."]
            case LocationSelectType.MECH_SELECT:
                return [<SvgMicrochip key={LocationSelectType.MECH_SELECT} />, "This ability will target a specific mech on the map."]
            case LocationSelectType.LINE_SELECT:
                return [<SvgLine key={LocationSelectType.LINE_SELECT} />, "This ability will target a straight line on the map."]
        }

        return [<SvgQuestionMark key="MISCELLANEOUS" />, "Miscellaneous ability type."]
    }, [saleAbility])

    const onClaim = useCallback(async () => {
        try {
            setLoading(true)
            await send(GameServerKeys.SaleAbilityClaim, {
                ability_id: saleAbility.id,
            })
            newSnackbarMessage(`Successfully claimed 1 x ${saleAbility.ability.label || "ability"}`, "success")
            onClaimCallback()
            setError(undefined)
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        } finally {
            setLoading(false)
        }
    }, [send, saleAbility.id, saleAbility.ability.label, newSnackbarMessage, onClaimCallback, setError])

    const onPurchase = useCallback(async () => {
        try {
            setLoading(true)
            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: saleAbility.id,
                price,
            })
            newSnackbarMessage(`Successfully purchased 1 x ${saleAbility.ability.label || "ability"}`, "success")
            onPurchaseCallback()
            setError(undefined)
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        } finally {
            setLoading(false)
        }
    }, [send, saleAbility.id, saleAbility.ability.label, price, newSnackbarMessage, onPurchaseCallback, setError])

    const onClick = useMemo(() => {
        if (availability === SaleAbilityAvailability.CanClaim) {
            return onClaim
        } else if (availability === SaleAbilityAvailability.CanPurchase) {
            return onPurchase
        }
    }, [availability, onClaim, onPurchase])

    return (
        <>
            <Fade in={true} timeout={1000}>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        clipSlantSize: "0px",
                        corners: {
                            topLeft: true,
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        },
                        backgroundColor: colors.darkNavy,
                        opacity: 1,
                        border: { borderColor: saleAbility.ability.colour, borderThickness: "1px" },
                    }}
                    sx={{
                        color: saleAbility.ability.colour,
                        p: 0,
                        minWidth: 0,
                        height: "100%",
                        filter: !disabled ? "grayScale(0)" : "grayscale(1)",
                    }}
                    onClick={onClick}
                    loading={loading}
                    disabled={disabled}
                >
                    <TooltipHelper text={saleAbility.ability.description} placement="bottom">
                        <Box
                            sx={{
                                position: "relative",
                                px: ".4rem",
                                py: ".3rem",
                            }}
                        >
                            {!disabled && (
                                <Box
                                    sx={{
                                        zIndex: 10,
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                                        opacity: 0,
                                        transition: "opacity .2s ease-out",
                                        "&:hover": {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    {actionWord}
                                </Box>
                            )}

                            <Stack spacing=".3rem" sx={{ height: "100%" }}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        pt: "100%", // 1:1 width-height ratio
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: ".2rem",
                                            right: ".2rem",
                                            zIndex: 2,
                                        }}
                                    >
                                        {abilityTypeIcon}
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 2,
                                            position: "absolute",
                                            bottom: ".2rem",
                                            left: ".2rem",
                                            backgroundColor: "#000000DD",
                                            p: ".2rem .4rem",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                            {amount} Owned
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: `center center`,
                                            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, .4) 15%, rgba(255, 255, 255, 0.0))`,
                                            backgroundSize: "cover",
                                        }}
                                    />

                                    <Box
                                        component="img"
                                        src={saleAbility.ability.image_url}
                                        alt={`Thumbnail image for ${saleAbility.ability.label}`}
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transformOrigin: "center",
                                            transition: "transform .1s ease-out, filter .1s ease-out",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.2,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        fontWeight: "fontWeightBold",
                                    }}
                                >
                                    {saleAbility.ability.label}
                                </Typography>
                            </Stack>
                        </Box>
                    </TooltipHelper>
                </FancyButton>
            </Fade>
        </>
    )
}
