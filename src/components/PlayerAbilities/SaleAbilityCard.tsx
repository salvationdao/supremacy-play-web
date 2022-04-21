import { LoadingButton } from "@mui/lab"
import { Box, ButtonBase, ButtonBaseProps, Fade, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../assets"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { SaleAbility } from "../../types"
import { TooltipHelper } from "../Common/TooltipHelper"

export interface AbilityCardProps extends ButtonBaseProps {
    abilityID: string
}

const purchaseModalWidth = 400

export const SaleAbilityCard = ({ abilityID, ...props }: AbilityCardProps) => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [saleAbilityPrice, setSaleAbilityPrice] = useState<string | null>(null)
    const [saleAbility, setSaleAbility] = useState<SaleAbility | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Purchasing
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)

    let abilityTypeIcon = <SvgQuestionMark />
    switch (saleAbility?.ability?.type) {
        case "GLOBAL":
            abilityTypeIcon = <SvgGlobal />
            break
        case "LOCATION_SELECT":
            abilityTypeIcon = <SvgTarget />
            break
        case "MECH_SELECT":
            abilityTypeIcon = <SvgMicrochip />
    }

    const onPurchase = async () => {
        try {
            setPurchaseLoading(true)
            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: abilityID,
                amount: saleAbilityPrice,
            })
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
                    setSaleAbilityPrice(resp)
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

    if (!saleAbility || !saleAbilityPrice) {
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
                            <Typography>{supFormatter(saleAbilityPrice)}</Typography>
                        </Stack>
                        {/* {saleAbility.available_until && <Typography variant="caption">{timeSince(saleAbility.available_until)}</Typography>} */}
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
                            padding: "1rem",
                            border: "1px solid orangered",
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
                        <LoadingButton loading={purchaseLoading} onClick={() => onPurchase()}>
                            Purchase for {supFormatter(saleAbilityPrice, 2)}
                        </LoadingButton>
                        {purchaseError && <Typography color={colors.red}>Error: {purchaseError}</Typography>}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
