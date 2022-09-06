import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../../assets"
import { useMiniMap } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { PlayerAbilityCooldownIndicator } from "./PlayerAbilityCooldownIndicator"

interface PlayerAbilityCardProps {
    playerAbility: PlayerAbility
    viewOnly?: boolean
}

const propsAreEqual = (prevProps: PlayerAbilityCardProps, nextProps: PlayerAbilityCardProps) => {
    return (
        prevProps.viewOnly === nextProps.viewOnly &&
        prevProps.playerAbility.id === nextProps.playerAbility.id &&
        prevProps.playerAbility.count === nextProps.playerAbility.count &&
        prevProps.playerAbility.last_purchased_at === nextProps.playerAbility.last_purchased_at &&
        prevProps.playerAbility.cooldown_expires_on === nextProps.playerAbility.cooldown_expires_on &&
        prevProps.playerAbility.ability.id === nextProps.playerAbility.ability.id
    )
}

export const PlayerAbilityCard = React.memo(function PlayerAbilityCard({ playerAbility, viewOnly }: PlayerAbilityCardProps) {
    const { setPlayerAbility } = useMiniMap()
    const [disabled, setDisabled] = useState(false)

    const checkIfDisabled = useCallback(() => {
        const now = new Date()
        if (now.getTime() >= playerAbility.cooldown_expires_on.getTime() && disabled) {
            setDisabled(false)
        }
    }, [disabled, playerAbility.cooldown_expires_on])

    useEffect(() => {
        const cooldownExpiresOn = playerAbility.cooldown_expires_on
        const now = new Date()

        if (now.getTime() < cooldownExpiresOn.getTime()) {
            setDisabled(true)
        }
        const t = setInterval(checkIfDisabled, 500)

        return () => clearInterval(t)
    }, [checkIfDisabled, disabled, playerAbility.cooldown_expires_on])

    const abilityTypeIcon = useMemo(() => {
        switch (playerAbility.ability.location_select_type) {
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
    }, [playerAbility])

    const onActivate = useCallback(() => {
        if (!playerAbility) return
        setPlayerAbility(playerAbility)
    }, [playerAbility, setPlayerAbility])

    const disable = viewOnly || disabled

    return (
        <>
            <TooltipHelper color={playerAbility.ability.colour} text={playerAbility.ability.description} placement="bottom">
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
                        border: { borderColor: playerAbility.ability.colour, borderThickness: "1.5px" },
                        sx: { position: "relative", px: ".4rem", py: ".3rem" },
                    }}
                    sx={{
                        color: playerAbility.ability.colour,
                        p: 0,
                        minWidth: 0,
                        height: "100%",
                        ":hover": { cursor: disable ? "default" : "pointer" },
                    }}
                    onClick={!disabled ? onActivate : undefined}
                >
                    <Stack
                        spacing=".3rem"
                        sx={{
                            height: "100%",
                            ":hover img": {
                                transform: "scale(1.2)",
                                filter: "brightness(2)",
                            },
                        }}
                    >
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
                                    top: ".5rem",
                                    left: ".5rem",
                                    zIndex: 2,
                                }}
                            >
                                {abilityTypeIcon}
                            </Box>

                            <Box
                                sx={{
                                    position: "absolute",
                                    top: ".2rem",
                                    right: ".2rem",
                                    zIndex: 2,
                                }}
                            >
                                <Typography sx={{ textTransform: "none" }}>{playerAbility.count}x</Typography>
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
                                src={playerAbility.ability.image_url}
                                alt={`Thumbnail image for ${playerAbility.ability.label}`}
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

                            <PlayerAbilityCooldownIndicator playerAbility={playerAbility} />
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
                            {playerAbility.ability.label}
                        </Typography>
                    </Stack>
                </FancyButton>
            </TooltipHelper>
        </>
    )
}, propsAreEqual)
