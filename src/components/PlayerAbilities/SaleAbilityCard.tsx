import { LoadingButton } from "@mui/lab"
import { Box, ButtonBase, ButtonBaseProps, Fade, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgClose, SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../assets"
import { useSnackbar } from "../../containers"
import { supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { useGameServerCommandsUser, useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { pulseEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { LocationSelectType, SaleAbility } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { TooltipHelper } from "../Common/TooltipHelper"

interface AbilityCardProps extends ButtonBaseProps {
    abilityID: string
}

const purchaseModalWidth = 400

export const SaleAbilityCard = ({ abilityID, ...props }: AbilityCardProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [saleAbility, setSaleAbility] = useState<SaleAbility | null>(null)
    const [price, setPrice] = useState<string | null>(null)
    const [previousPrice, setPreviousPrice] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [abilityTypeIcon, setAbilityTypeIcon] = useState<JSX.Element>(<SvgQuestionMark />)
    const [abilityTypeDescription, setAbilityTypeDescription] = useState("Miscellaneous ability type.")

    // Purchasing
    const { newSnackbarMessage } = useSnackbar()
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)

    useEffect(() => {
        switch (saleAbility?.ability?.location_select_type) {
            case LocationSelectType.GLOBAL:
                setAbilityTypeDescription("This ability will affect all units on the map.")
                setAbilityTypeIcon(<SvgGlobal />)
                break
            case LocationSelectType.LOCATION_SELECT:
                setAbilityTypeDescription("This ability will target a specific location on the map.")
                setAbilityTypeIcon(<SvgTarget />)
                break
            case LocationSelectType.MECH_SELECT:
                setAbilityTypeDescription("This ability will target a specific mech on the map.")
                setAbilityTypeIcon(<SvgMicrochip />)
                break
            case LocationSelectType.LINE_SELECT:
                setAbilityTypeDescription("This ability will target a straight line on the map.")
                setAbilityTypeIcon(<SvgLine />)
                break
        }
    }, [saleAbility])

    const onPurchase = useCallback(async () => {
        try {
            setPurchaseLoading(true)
            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: abilityID,
                amount: price,
            })
            newSnackbarMessage(`Successfully purchased 1 ${saleAbility?.ability?.label || "ability"}`, "success")
            toggleShowPurchaseModal(false)
            setPurchaseError(null)
        } catch (e) {
            if (e instanceof Error) {
                setPurchaseError(e.message)
            } else if (typeof e === "string") {
                setPurchaseError(e)
            }
        } finally {
            setPurchaseLoading(false)
        }
    }, [abilityID, newSnackbarMessage, price, saleAbility?.ability?.label, send, toggleShowPurchaseModal])

    useGameServerSubscription<{ id: string; price: string }>(
        {
            URI: "xxxxxxxxx",
            key: GameServerKeys.SaleAbilityPriceSubscribe,
        },
        (payload) => {
            if (!payload || payload.id !== abilityID) return
            setPrice((prev) => {
                if (prev) setPreviousPrice(prev)
                return payload.price
            })
        },
    )

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<SaleAbility>(GameServerKeys.SaleAbilityDetailed, {
                    ability_id: abilityID,
                })

                if (!resp) return
                setSaleAbility(resp)
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message)
                } else if (typeof e === "string") {
                    setError(e)
                }
            }
        })()
    }, [abilityID, send])

    if (!saleAbility || !price) {
        return <Box>Loading...</Box>
    }

    return (
        <>
            <TooltipHelper text={saleAbility.ability?.description}>
                <ButtonBase
                    {...props}
                    onClick={() => toggleShowPurchaseModal(true)}
                    sx={{
                        display: "block",
                        textAlign: "left",
                        backgroundColor: colors.navy,
                        ":hover img": {
                            filter: "grayscale(0)",
                            transform: "scale(1.2)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            padding: ".3rem",
                        }}
                    >
                        <Box
                            sx={{
                                overflow: "hidden",
                                position: "relative",
                                width: "100%",
                                paddingTop: "100%", // 1:1 width-height ratio
                            }}
                        >
                            <Box
                                sx={{
                                    zIndex: 1,
                                    position: "absolute",
                                    top: ".2rem",
                                    right: ".2rem",
                                }}
                            >
                                {abilityTypeIcon}
                            </Box>
                            <Box
                                component="img"
                                src={saleAbility.ability?.image_url}
                                alt={`Thumbnail image for ${saleAbility.ability?.label}`}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    filter: "grayscale(1)",
                                    transformOrigin: "center",
                                    transition: "transform .1s ease-out",
                                }}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            padding: ".2rem",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                overflowX: "hidden",
                                width: "100%",
                                whiteSpace: "nowrap",
                                textDecoration: "ellipsis",
                            }}
                        >
                            {saleAbility.ability?.label}
                        </Typography>
                        <Stack direction="row" alignItems="center">
                            <SvgSupToken fill={colors.yellow} size="1.5rem" />
                            <Typography>{supFormatter(price)}</Typography>
                        </Stack>
                    </Box>
                </ButtonBase>
            </TooltipHelper>
            <Modal open={showPurchaseModal} onClose={() => toggleShowPurchaseModal(false)} closeAfterTransition>
                <Fade in={showPurchaseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: `50%`,
                            left: `50%`,
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            maxWidth: purchaseModalWidth,
                        }}
                    >
                        <ClipThing
                            border={{
                                borderColor: saleAbility.ability?.colour || colors.neonBlue,
                                borderThickness: ".15rem",
                                isFancy: true,
                            }}
                            backgroundColor={colors.darkNavy}
                            sx={{
                                position: "relative",
                            }}
                        >
                            <IconButton size="small" onClick={() => toggleShowPurchaseModal(false)} sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}>
                                <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                            </IconButton>
                            <Box sx={{ px: "2rem", py: "1.5rem" }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: ".5rem",
                                        fontFamily: fonts.nostromoBold,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Purchase {saleAbility.ability?.label || "Ability"}
                                </Typography>
                                <Stack direction="row" spacing="1rem">
                                    <ClipThing sx={{ flexShrink: 0 }} backgroundColor={colors.darkNavy}>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                height: "60px",
                                                width: "60px",
                                                background: `center center`,
                                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .8) 20%, rgba(255, 255, 255, 0.0)), url(${saleAbility.ability?.image_url})`,
                                                backgroundSize: "cover",
                                            }}
                                        >
                                            <TooltipHelper text={abilityTypeDescription} placement="top-start">
                                                <Box
                                                    sx={{
                                                        zIndex: 1,
                                                        position: "absolute",
                                                        bottom: ".2rem",
                                                        right: ".2rem",
                                                    }}
                                                >
                                                    {abilityTypeIcon}
                                                </Box>
                                            </TooltipHelper>
                                        </Box>
                                    </ClipThing>
                                    <Box
                                        sx={{
                                            alignSelf: "stretch",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography>{saleAbility.ability?.description}</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                alignSelf: "end",
                                            }}
                                        >
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "inline-block",
                                                    width: 7,
                                                    height: 7,
                                                    marginRight: ".5rem",
                                                    borderRadius: "50%",
                                                    backgroundColor: colors.red,
                                                    animation: `${pulseEffect} 3s infinite`,
                                                }}
                                            />
                                            Price Trend:
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: ".5rem",
                                                    color: previousPrice && previousPrice > price ? colors.blue : colors.offWhite,
                                                }}
                                            >
                                                {!previousPrice || previousPrice === price ? "Same" : previousPrice > price ? "Down" : "Up"}
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Stack>
                                <LoadingButton
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        width: "100%",
                                        minWidth: 0,
                                        mt: "1rem",
                                        mb: ".5rem",
                                        px: ".8rem",
                                        py: ".6rem",
                                        fontWeight: "fontWeightBold",
                                        color: colors.offWhite,
                                        lineHeight: 1,
                                        textTransform: "uppercase",
                                        backgroundColor: colors.green,
                                        border: `${colors.green} 1px solid`,
                                        borderRadius: 0.3,
                                        ":hover": {
                                            backgroundColor: `${colors.green}90`,
                                        },
                                    }}
                                    onClick={onPurchase}
                                    loading={purchaseLoading}
                                >
                                    <Typography variant="body2">Purchase for</Typography>
                                    <SvgSupToken size="1.5rem" fill={colors.gold} />
                                    <Typography variant="body2">{supFormatter(price, 2)}</Typography>
                                </LoadingButton>
                                {purchaseError && <Typography color={colors.red}>Error: {purchaseError}</Typography>}
                                {error && <Typography color={colors.red}>Error: Something went wrong while loading this ability.</Typography>}
                            </Box>
                        </ClipThing>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
