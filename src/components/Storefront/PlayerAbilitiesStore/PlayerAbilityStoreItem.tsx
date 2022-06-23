import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import { FancyButton } from "../.."
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { LocationSelectType, SaleAbility } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { ConfirmModal } from "../../Common/ConfirmModal"

export interface PlayerAbilityStoreItemProps {
    saleAbility: SaleAbility
    updatedPrice: string
}

export const PlayerAbilityStoreItem = ({ saleAbility, updatedPrice }: PlayerAbilityStoreItemProps) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const [abilityTypeIcon, setAbilityTypeIcon] = useState<JSX.Element>(<SvgQuestionMark />)
    const [abilityTypeDescription, setAbilityTypeDescription] = useState("Miscellaneous ability type.")

    // Purchasing
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string>()

    useEffect(() => {
        switch (saleAbility.ability.location_select_type) {
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
                ability_id: saleAbility.id,
                amount: updatedPrice,
            })
            newSnackbarMessage(`Successfully purchased 1 ${saleAbility.ability.label || "ability"}`, "success")
            toggleShowPurchaseModal(false)
            setPurchaseError(undefined)
        } catch (e) {
            if (e instanceof Error) {
                setPurchaseError(e.message)
            } else if (typeof e === "string") {
                setPurchaseError(e)
            }
        } finally {
            setPurchaseLoading(false)
        }
    }, [send, saleAbility, updatedPrice, newSnackbarMessage, toggleShowPurchaseModal])

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
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
                }}
            >
                <Fade in={true} timeout={1000}>
                    <Stack
                        sx={{
                            height: "100%",
                            p: "1.5rem",
                        }}
                    >
                        <Stack direction="row" spacing="1.5rem" mb="1rem">
                            <ClipThing
                                corners={{
                                    topLeft: true,
                                }}
                                sx={{
                                    position: "relative",
                                    width: "100px",
                                    height: "100px",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={saleAbility.ability.image_url}
                                    alt={`Thumbnail image for ${saleAbility.ability.label}`}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 0,
                                        display: "flex",
                                        height: "3rem",
                                        width: "3rem",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    }}
                                >
                                    {abilityTypeIcon}
                                </Box>
                            </ClipThing>
                            <Stack
                                sx={{
                                    flex: 1,
                                    px: ".4rem",
                                    py: ".3rem",
                                }}
                            >
                                <Typography gutterBottom variant="h4" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                    {saleAbility.ability.label}
                                </Typography>
                                <Typography sx={{ fontSize: "2.1rem" }}>{saleAbility.ability.description}</Typography>
                            </Stack>
                        </Stack>
                        <FancyButton
                            onClick={() => toggleShowPurchaseModal(true)}
                            clipThingsProps={{
                                clipSize: "5px",
                                backgroundColor: primaryColor,
                                opacity: 1,
                                border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                sx: {
                                    marginTop: "auto",
                                },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem" }}
                        >
                            <Typography variant="body1" sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                                BUY FOR {supFormatter(updatedPrice, 2)} SUPS
                            </Typography>
                        </FancyButton>
                    </Stack>
                </Fade>
            </ClipThing>

            {showPurchaseModal && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={onPurchase}
                    onClose={() => {
                        setPurchaseError(undefined)
                        toggleShowPurchaseModal(false)
                    }}
                    isLoading={purchaseLoading}
                    error={purchaseError}
                    confirmSuffix={
                        <Stack direction="row" sx={{ ml: ".4rem" }}>
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                (
                            </Typography>
                            <SvgSupToken size="1.8rem" />
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {supFormatter(updatedPrice, 2)})
                            </Typography>
                        </Stack>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to purchase one <strong>{saleAbility.ability.label}</strong> for <span>{supFormatter(updatedPrice, 2)}</span> SUPS?
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
