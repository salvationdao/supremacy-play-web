import { LoadingButton } from "@mui/lab"
import { Box, ButtonBase, ButtonBaseProps, Fade, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../assets"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { pulseEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { SaleAbility } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { TooltipHelper } from "../Common/TooltipHelper"

export interface AbilityCardProps extends ButtonBaseProps {
    abilityID: string
}

const purchaseModalWidth = 400

export const SaleAbilityCard = ({ abilityID, ...props }: AbilityCardProps) => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [saleAbility, setSaleAbility] = useState<SaleAbility | null>(null)
    const [price, setPrice] = useState<string | null>(null)
    const [previousPrice, setPreviousPrice] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Purchasing
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)

    let abilityTypeIcon = <SvgQuestionMark />
    let abilityTypeDescription = "Miscellaneous ability type."
    switch (saleAbility?.ability?.location_select_type) {
        case "GLOBAL":
            abilityTypeDescription = "This ability will affect all units on the map."
            abilityTypeIcon = <SvgGlobal />
            break
        case "LOCATION_SELECT":
            abilityTypeDescription = "This ability will target a specific location on the map."
            abilityTypeIcon = <SvgTarget />
            break
        case "MECH_SELECT":
            abilityTypeDescription = "This ability will target a specific mech on the map."
            abilityTypeIcon = <SvgMicrochip />
    }

    const onPurchase = async () => {
        try {
            setPurchaseLoading(true)
            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: abilityID,
                amount: price,
            })
            toggleShowPurchaseModal(false)
        } catch (e) {
            if (e instanceof Error) {
                setPurchaseError(e.message)
            } else if (typeof e === "string") {
                setPurchaseError(e)
            }
        } finally {
            setPurchaseLoading(false)
        }
    }

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !user) return

        try {
            ;(async () => {
                const resp = await send<SaleAbility>(GameServerKeys.SaleAbilityDetailed, {
                    ability_id: abilityID,
                })

                setSaleAbility(resp)
            })()

            return subscribe<string>(
                GameServerKeys.SaleAbilityPriceSubscribe,
                (resp) => {
                    setPrice((prev) => {
                        if (prev) {
                            setPreviousPrice(prev)
                        }

                        return resp
                    })
                },
                {
                    ability_id: abilityID,
                },
            )
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        }
    }, [state, send, subscribe, user])

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
                            innerSx={{
                                padding: "1rem",
                                backgroundColor: colors.darkNavy,
                            }}
                            border={{
                                borderColor: colors.neonBlue,
                                borderThickness: ".15rem",
                                isFancy: true,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: ".5rem",
                                    fontFamily: fonts.nostromobold,
                                    textTransform: "uppercase",
                                }}
                            >
                                Purchase {saleAbility.ability?.label || "Ability"}
                            </Typography>
                            <Stack direction="row" spacing="1rem">
                                <ClipThing
                                    innerSx={{
                                        position: "relative",
                                        minHeight: "100px",
                                        minWidth: "100px",
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
                                onClick={() => onPurchase()}
                                loading={purchaseLoading}
                            >
                                <Typography variant="body2">Purchase for</Typography>
                                <SvgSupToken size="1.5rem" fill={colors.gold} />
                                <Typography variant="body2">{supFormatter(price, 2)}</Typography>
                            </LoadingButton>
                            {purchaseError && <Typography color={colors.red}>Error: {purchaseError}</Typography>}
                            {error && <Typography color={colors.red}>Error: Something went wrong while loading this ability.</Typography>}
                        </ClipThing>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
