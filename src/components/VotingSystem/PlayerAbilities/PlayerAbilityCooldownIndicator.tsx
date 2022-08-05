import { useEffect, useRef } from "react"
import { colors } from "../../../theme/theme"
import { PlayerAbility } from "../../../types"

export interface PlayerAbilityCooldownIndicatorProps {
    playerAbility: PlayerAbility
}

export const PlayerAbilityCooldownIndicator = ({ playerAbility }: PlayerAbilityCooldownIndicatorProps) => {
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
                transform: "translate(-50%, -50%) rotate(-90deg)",
                opacity: 0.6,
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
                    stroke: colors.black2,
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
