import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useMiniMapPixi } from "../../../containers"
import { useInterval } from "../../../hooks"
import { AnyAbility, LocationSelectType, PlayerAbility } from "../../../types"
import { NiceButton } from "../Nice/NiceButton"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { TypographyTruncated } from "../TypographyTruncated"

export const PlayerAbilitySmallCard = React.memo(function PlayerAbilitySmallCard({
    anyAbility,
    playerAbility,
    viewOnly,
}: {
    anyAbility: AnyAbility
    playerAbility?: PlayerAbility
    viewOnly?: boolean
}) {
    const { useAnyAbility } = useMiniMapPixi()
    const [disabled, setDisabled] = useState(false)

    useInterval(() => {
        if (!playerAbility) return
        if (new Date().getTime() >= playerAbility.cooldown_expires_on.getTime() && disabled) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, 1000)

    const onActivate = useCallback(() => {
        useAnyAbility.current(anyAbility)
    }, [anyAbility, useAnyAbility])

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

    const isDisabled = viewOnly || disabled

    return (
        <NiceTooltip color={anyAbility.colour} text={anyAbility.description} placement="bottom">
            <NiceButton disabled={isDisabled} buttonColor={anyAbility.colour} onClick={!disabled ? onActivate : undefined} disableAutoColor sx={{ p: 0 }}>
                <Stack spacing=".3rem" sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            pt: "100%", // 1:1 width-height ratio
                            overflow: "hidden",
                        }}
                    >
                        {/* Ability icon */}
                        <Box sx={{ position: "absolute", top: ".5rem", left: ".5rem", zIndex: 2 }}>{abilityTypeIcon}</Box>

                        {/* Owned count */}
                        {playerAbility && (
                            <Box sx={{ position: "absolute", top: ".5rem", right: ".5rem", zIndex: 2 }}>
                                <Typography variant="body2" lineHeight={1}>
                                    {playerAbility.count}x
                                </Typography>
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
        </NiceTooltip>
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
