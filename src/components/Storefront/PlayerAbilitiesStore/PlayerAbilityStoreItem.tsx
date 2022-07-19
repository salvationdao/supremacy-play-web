import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { FancyButton, TooltipHelper } from "../.."
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { numberCommaFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, SaleAbility } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { ConfirmModal } from "../../Common/ConfirmModal"

export interface PlayerAbilityStoreItemProps {
    saleAbility: SaleAbility
    onPurchase: () => void
    disabled?: boolean
}

export const PlayerAbilityStoreItem = ({ saleAbility, onPurchase: onPurchaseCallback, disabled }: PlayerAbilityStoreItemProps) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    // Purchasing
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [showPurchaseModal, toggleShowPurchaseModal] = useToggle(false)
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string>()

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

    const onPurchase = useCallback(async () => {
        try {
            setPurchaseLoading(true)
            await send(GameServerKeys.SaleAbilityClaim, {
                ability_id: saleAbility.id,
            })
            newSnackbarMessage(`Successfully claimed 1 ${saleAbility.ability.label || "ability"}`, "success")
            toggleShowPurchaseModal(false)
            onPurchaseCallback()
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
    }, [send, saleAbility.id, saleAbility.ability.label, newSnackbarMessage, toggleShowPurchaseModal, onPurchaseCallback])

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
                                        span: {
                                            fontFamily: "inherit",
                                            color: colors.neonBlue,
                                        },
                                    }}
                                >
                                    <span>{numberCommaFormatter(0)}</span> Owned
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
                                CLAIM ABILITY
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
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", ml: ".4rem" }}>
                            CLAIM
                        </Typography>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to claim one <strong>{saleAbility.ability.label}</strong>?
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
