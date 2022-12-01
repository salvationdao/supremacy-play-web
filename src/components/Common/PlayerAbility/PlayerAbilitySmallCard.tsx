import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../../assets"
import { useGlobalNotifications, useMiniMapPixi } from "../../../containers"
import { supFormatter } from "../../../helpers"
import { useInterval, useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { AnyAbility, LocationSelectType, PlayerAbility, SaleAbilityAvailability } from "../../../types"
import { PreferenceToggle } from "../../Bar/ProfileCard/PreferencesModal/NotificationPreferences"
import { ConfirmModal } from "../Deprecated/ConfirmModal"
import { NiceButton } from "../Nice/NiceButton"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { TypographyTruncated } from "../TypographyTruncated"

type action =
    | {
          anyAbility: AnyAbility
          playerAbility?: PlayerAbility
          ownedCount?: number
          onClickAction: "buy"
          onClickCallback?: () => void
          buyConfig: {
              price: string
              availability: SaleAbilityAvailability
          }
      }
    | {
          anyAbility: AnyAbility
          playerAbility?: PlayerAbility
          ownedCount?: number
          onClickAction: "use" | "nothing"
          onClickCallback?: () => void
          buyConfig?: never
      }

export const PlayerAbilitySmallCard = React.memo(function PlayerAbilitySmallCard({
    anyAbility,
    playerAbility,
    ownedCount,
    onClickAction,
    onClickCallback,
    buyConfig,
}: action) {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { useAnyAbility } = useMiniMapPixi()
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [showConfirmation, toggleShowConfirmation] = useToggle(localStorage.getItem("hideSaleAbilitiesPurchaseConfirmation") === "true")
    const [purchaseError, setPurchaseError] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useInterval(() => {
        if (!playerAbility) return
        if (new Date().getTime() >= playerAbility.cooldown_expires_on.getTime() && disabled) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, 1000)

    const onPurchase = useCallback(async () => {
        try {
            if (!buyConfig) return

            setIsLoading(true)
            setPurchaseError(undefined)

            await send(GameServerKeys.SaleAbilityPurchase, {
                ability_id: anyAbility.id,
                price: buyConfig.price,
            })

            onClickCallback && onClickCallback()
            newSnackbarMessage(`Successfully purchased 1 x ${anyAbility.label || "ability"}`, "success")
            setShowPurchaseModal(false)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase ability"
            console.error(message)
            setPurchaseError(message)
            newSnackbarMessage(message)
        } finally {
            setIsLoading(false)
        }
    }, [anyAbility.id, anyAbility.label, buyConfig, newSnackbarMessage, onClickCallback, send])

    const onClick = useCallback(() => {
        if (onClickAction === "use") {
            useAnyAbility.current(anyAbility)
        } else if (onClickAction === "buy" && buyConfig && buyConfig.availability === SaleAbilityAvailability.CanPurchase) {
            showConfirmation ? onPurchase() : setShowPurchaseModal(true)
        }
    }, [anyAbility, buyConfig, onClickAction, onPurchase, showConfirmation, useAnyAbility])

    const abilityTypeIcon = useMemo(() => {
        switch (anyAbility.location_select_type) {
            case LocationSelectType.Global:
                return <SvgGlobal size="1.5rem" />
            case LocationSelectType.LocationSelect:
                return <SvgTarget size="1.5rem" />
            case LocationSelectType.MechSelect:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectAllied:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectOpponent:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.LineSelect:
                return <SvgLine size="1.5rem" />
        }
        return <SvgQuestionMark size="1.5rem" />
    }, [anyAbility.location_select_type])

    const isDisabled = onClickAction === "nothing" || disabled || (onClickAction === "buy" && buyConfig?.availability === SaleAbilityAvailability.Unavailable)

    return (
        <>
            <NiceTooltip color={anyAbility.colour} text={anyAbility.description} placement="bottom" enterDelay={450} enterNextDelay={700}>
                <Box>
                    <NiceButton
                        disabled={isDisabled}
                        loading={isLoading}
                        buttonColor={anyAbility.colour}
                        onClick={!isDisabled ? onClick : undefined}
                        disableAutoColor
                        sx={{ p: 0, width: "100%", height: "100%" }}
                    >
                        <Stack spacing=".3rem" sx={{ width: "100%", height: "100%" }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    flex: 1,
                                    width: "100%",
                                    pt: "100%", // 1:1 width-height ratio
                                    overflow: "hidden",
                                }}
                            >
                                {/* Ability icon */}
                                <Box sx={{ position: "absolute", top: ".5rem", left: ".5rem", zIndex: 2 }}>{abilityTypeIcon}</Box>

                                {/* Owned count */}
                                {ownedCount !== undefined && (
                                    <Box sx={{ position: "absolute", top: ".6rem", right: ".5rem", zIndex: 2 }}>
                                        <TypographyTruncated variant="subtitle1" lineHeight={1}>
                                            {ownedCount} OWNED
                                        </TypographyTruncated>
                                    </Box>
                                )}

                                {/* Sup price */}
                                {buyConfig && (
                                    <Box sx={{ position: "absolute", bottom: 0, left: 0, p: "0 .3rem", zIndex: 2, backgroundColor: "#000000EE" }}>
                                        <TypographyTruncated variant="subtitle1" lineHeight={1}>
                                            <SvgSupToken inline size="1.4rem" fill={colors.gold} />
                                            {supFormatter(buyConfig.price, 2)}
                                        </TypographyTruncated>
                                    </Box>
                                )}

                                {/* Image */}
                                <Box
                                    component="img"
                                    src={anyAbility.image_url}
                                    alt={`Thumbnail image for ${anyAbility.label}`}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transformOrigin: "center",
                                        transition: "transform .1s ease-out, filter .1s ease-out",

                                        ":hover": {
                                            transform: "scale(1.2)",
                                            filter: "brightness(2)",
                                        },
                                    }}
                                />

                                {playerAbility && <PlayerAbilityCooldownIndicator playerAbility={playerAbility} />}
                            </Box>

                            <TypographyTruncated variant="body2" sx={{ px: ".3rem", fontWeight: "bold", backgroundColor: "#00000060" }}>
                                {anyAbility.label}
                            </TypographyTruncated>
                        </Stack>
                    </NiceButton>
                </Box>
            </NiceTooltip>

            {showPurchaseModal && buyConfig && (
                <ConfirmModal
                    title="Confirm Purchase"
                    onConfirm={onPurchase}
                    onClose={() => setShowPurchaseModal(false)}
                    isLoading={isLoading}
                    error={purchaseError}
                    width="50rem"
                >
                    <Typography variant="h6">
                        Purchase {anyAbility.label} for{" "}
                        <span key={buyConfig.price} style={{ color: colors.gold }}>
                            {supFormatter(buyConfig.price, 2)} SUPS
                        </span>
                        ?
                    </Typography>

                    <PreferenceToggle
                        disabled={isLoading}
                        title="Don't show this again"
                        checked={!!showConfirmation}
                        onChangeFunction={(e) => {
                            toggleShowConfirmation(e.currentTarget.checked)
                            localStorage.setItem("hideSaleAbilitiesPurchaseConfirmation", e.currentTarget.checked.toString())
                        }}
                    />
                </ConfirmModal>
            )}
        </>
    )
})

const PlayerAbilityCooldownIndicator = ({ playerAbility }: { playerAbility: PlayerAbility }) => {
    const circleRef = useRef<SVGCircleElement | null>(null)
    const radius = 100
    const circumference = Math.PI * 2 * radius

    useEffect(() => {
        const cooldownExpiresOn = playerAbility.cooldown_expires_on.getTime()
        const cooldownSeconds = playerAbility.ability.cooldown_seconds
        const t = setInterval(() => {
            requestAnimationFrame(() => {
                if (!circleRef.current) return
                const secondsLeft = Math.max((cooldownExpiresOn - new Date().getTime()) / 1000, 0)
                const percentage = Math.min((secondsLeft * 100) / cooldownSeconds, 100)
                circleRef.current.style.strokeDasharray = `${(circumference * percentage) / 100} ${circumference}`
            })
        }, 500)
        return () => clearInterval(t)
    }, [circumference, playerAbility.ability.cooldown_seconds, playerAbility.cooldown_expires_on])

    return (
        <svg
            style={{
                zIndex: 100,
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "150%",
                height: "150%",
                transform: "translate(-50%, -50%) rotate(90deg) scaleX(-1)",
            }}
            className="base-timer__svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                ref={circleRef}
                style={{
                    fill: "transparent",
                    strokeDasharray: `${(circumference * 100) / 100} ${circumference}`,
                    strokeWidth: radius * 2,
                    stroke: "#000000DD",
                    transition: "stroke-dasharray .2s ease-out",
                }}
                className="base-timer__path-elapsed"
                cx="50"
                cy="50"
                r={radius}
            />
        </svg>
    )
}
