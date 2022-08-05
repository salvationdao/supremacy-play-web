import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { FancyButton, TooltipHelper } from "../.."
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { numberCommaFormatter, supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, SaleAbility, SaleAbilityAvailability } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { ConfirmModal } from "../../Common/ConfirmModal"

export interface PlayerAbilityStoreItemProps {
    saleAbility: SaleAbility
    price?: string
    amount?: number
    onClaim: () => void
    onPurchase: () => void
    availability: SaleAbilityAvailability
}

export const PlayerAbilityStoreItem = ({
    saleAbility,
    price = saleAbility.current_price,
    amount = 0,
    onClaim: onClaimCallback,
    onPurchase: onPurchaseCallback,
    availability,
}: PlayerAbilityStoreItemProps) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    // Purchasing
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    const disabled = availability === SaleAbilityAvailability.Unavailable

    const actionWord = useMemo(() => {
        switch (availability) {
            case SaleAbilityAvailability.CanPurchase:
                return "PURCHASE"
            case SaleAbilityAvailability.CanClaim:
                return "CLAIM"
            default:
                return "PURCHASE"
        }
    }, [availability])

    const [abilityTypeIcon, abilityTypeDescription] = useMemo(() => {
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
            toggleShowPurchaseModal(false)
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
    }, [send, saleAbility.id, saleAbility.ability.label, newSnackbarMessage, toggleShowPurchaseModal, onClaimCallback])

    const onPurchase = useCallback(async () => {
        try {
            setLoading(true)
            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: saleAbility.id,
                price,
            })
            newSnackbarMessage(`Successfully purchased 1 x ${saleAbility.ability.label || "ability"}`, "success")
            toggleShowPurchaseModal(false)
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
    }, [send, saleAbility.id, saleAbility.ability.label, price, newSnackbarMessage, toggleShowPurchaseModal, onPurchaseCallback])

    const onClick = useMemo(() => {
        if (availability === SaleAbilityAvailability.CanClaim) {
            return onClaim
        } else if (availability === SaleAbilityAvailability.CanPurchase) {
            return onPurchase
        }
        return () => null
    }, [availability, onClaim, onPurchase])

    return (
        <>
            <ClipThing
                clipSize="12px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{
                    transition: "all .15s",
                    filter: !disabled ? "grayScale(0)" : "grayscale(1)",
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
                }}
            >
                <Fade in={true} timeout={1000}>
                    <Stack
                        spacing=".8rem"
                        sx={{
                            height: "100%",
                            p: "4rem",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                            }}
                        >
                            <Box
                                component="img"
                                src={saleAbility.ability.image_url}
                                alt={`Thumbnail image for ${saleAbility.ability.label}`}
                                sx={{
                                    width: "100%",
                                    objectFit: "contain",
                                    border: `1.5px solid ${primaryColor}20`,
                                }}
                            />

                            <TooltipHelper text={abilityTypeDescription} placement="bottom">
                                <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{
                                        position: "absolute",
                                        top: ".6rem",
                                        right: ".6rem",
                                        height: "3rem",
                                        width: "3rem",
                                        "& div": {
                                            p: 0,
                                        },
                                    }}
                                >
                                    {abilityTypeIcon}
                                </Stack>
                            </TooltipHelper>

                            <Box
                                sx={{
                                    position: "absolute",
                                    right: ".6rem",
                                    bottom: ".6rem",
                                    px: ".2rem",
                                    py: ".5rem",
                                    backgroundColor: "#00000095",
                                }}
                            >
                                <Typography
                                    sx={{
                                        lineHeight: 1,
                                        fontSize: "1.5rem",
                                        fontFamily: fonts.nostromoBold,
                                        span: {},
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            fontFamily: "inherit",
                                            color: colors.neonBlue,
                                        }}
                                    >
                                        {numberCommaFormatter(amount)}
                                    </Box>{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        / {numberCommaFormatter(saleAbility.ability.inventory_limit)}
                                    </Box>{" "}
                                    Owned
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {saleAbility.ability.label}
                        </Typography>

                        <Typography variant="h6">{saleAbility.ability.description}</Typography>

                        <Box sx={{ "&&": { mt: "auto" } }} />

                        <FancyButton
                            onClick={() => toggleShowPurchaseModal(true)}
                            clipThingsProps={{
                                clipSize: "5px",
                                backgroundColor: primaryColor,
                                opacity: 1,
                                border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem" }}
                            disabled={disabled}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                    color: theme.factionTheme.secondary,
                                }}
                            >
                                {availability === SaleAbilityAvailability.CanClaim ? (
                                    "CLAIM ABILITY"
                                ) : (
                                    <>
                                        PURCHASE FOR{" "}
                                        <Box
                                            key={price}
                                            component="span"
                                            sx={{
                                                font: "inherit",
                                                animation: `${scaleUpKeyframes} .2s ease-out`,
                                            }}
                                        >
                                            {supFormatter(price, 2)} SUPS
                                        </Box>
                                    </>
                                )}
                            </Typography>
                        </FancyButton>
                    </Stack>
                </Fade>
            </ClipThing>

            {showPurchaseModal && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={onClick}
                    onClose={() => {
                        setError(undefined)
                        toggleShowPurchaseModal(false)
                    }}
                    isLoading={loading}
                    error={error}
                    confirmSuffix={
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", ml: ".4rem" }}>
                            {availability === SaleAbilityAvailability.CanPurchase ? (
                                <>
                                    <Box
                                        key={price}
                                        component="span"
                                        sx={{
                                            animation: `${scaleUpKeyframes} .2s ease-out`,
                                        }}
                                    >
                                        ({supFormatter(price, 2)} SUPS)
                                    </Box>
                                </>
                            ) : availability === SaleAbilityAvailability.CanClaim ? (
                                "CLAIM"
                            ) : (
                                "UNAVAILABLE"
                            )}
                        </Typography>
                    }
                    disableConfirm={disabled}
                >
                    <Typography variant="h6">
                        Do you wish to {actionWord.toLowerCase()} one <strong>{saleAbility.ability.label}</strong>?
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
