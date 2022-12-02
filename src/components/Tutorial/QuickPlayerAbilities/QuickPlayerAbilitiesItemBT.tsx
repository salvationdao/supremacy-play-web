import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../../assets"
import { useGlobalNotifications, useTraining } from "../../../containers"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbilityPrePurchase, PlayerAbilityStages, SaleAbility } from "../../../types"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { truncateTextLines } from "../../../helpers"

export interface QuickPlayerAbilitiesItemProps {
    saleAbility: SaleAbility
    amount?: number
    setError: React.Dispatch<React.SetStateAction<string | undefined>>
    disabled?: boolean
}

export const QuickPlayerAbilitiesItemBT = ({ saleAbility, amount = 0, setError, disabled }: QuickPlayerAbilitiesItemProps) => {
    // Purchasing
    const { newSnackbarMessage } = useGlobalNotifications()
    const { trainingStage, setTrainingStage } = useTraining()

    const actionWord = useMemo(() => {
        if (trainingStage in PlayerAbilityPrePurchase) return <Typography>CLAIM ABILITY</Typography>
        else
            return (
                <Typography>
                    PURCHASE ABILITY FOR <strong style={{ color: colors.yellow, animation: `${scaleUpKeyframes} .2s ease-out` }}>10 SUPS</strong>
                </Typography>
            )
    }, [trainingStage])

    const [abilityTypeIcon] = useMemo(() => {
        switch (saleAbility.ability.location_select_type) {
            case LocationSelectType.Global:
                return [<SvgGlobal key={LocationSelectType.Global} />, "This ability will affect all units on the map."]
            case LocationSelectType.LocationSelect:
                return [<SvgTarget key={LocationSelectType.LocationSelect} />, "This ability will target a specific location on the map."]
            case LocationSelectType.MechSelect:
                return [<SvgMicrochip key={LocationSelectType.MechSelect} />, "This ability will target a specific mech on the map."]
            case LocationSelectType.LineSelect:
                return [<SvgLine key={LocationSelectType.LineSelect} />, "This ability will target a straight line on the map."]
        }

        return [<SvgQuestionMark key="MISCELLANEOUS" />, "Miscellaneous ability type."]
    }, [saleAbility])

    const onPurchase = useCallback(async () => {
        setTrainingStage(PlayerAbilityStages.ShowPurchasePA)
        newSnackbarMessage(`Successfully claimed 1 ${saleAbility.ability.label || "ability"}`, "success")
        setError(undefined)
    }, [setTrainingStage, newSnackbarMessage, saleAbility.ability.label, setError])

    return (
        <>
            <Fade in={true} timeout={1000}>
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
                        border: { borderColor: saleAbility.ability.colour, borderThickness: "1px" },
                    }}
                    sx={{
                        color: saleAbility.ability.colour,
                        p: 0,
                        minWidth: 0,
                        height: "100%",
                        filter: !disabled ? "grayScale(0)" : "grayscale(1)",
                        cursor: trainingStage in PlayerAbilityPrePurchase ? "pointer" : "unset",
                    }}
                    onClick={trainingStage in PlayerAbilityPrePurchase ? onPurchase : undefined}
                    disabled={
                        (trainingStage !== PlayerAbilityStages.ClaimPA && trainingStage !== PlayerAbilityStages.ShowPurchasePA) ||
                        saleAbility.ability.label !== "EMP"
                    }
                >
                    <NiceTooltip text={saleAbility.ability.description} placement="bottom">
                        <Box
                            sx={{
                                position: "relative",
                                px: ".4rem",
                                py: ".3rem",
                            }}
                        >
                            <Box
                                sx={{
                                    zIndex: 10,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                                    opacity: 0,
                                    transition: "opacity .2s ease-out",
                                    "&:hover": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {actionWord}
                            </Box>

                            <Stack spacing=".3rem" sx={{ height: "100%" }}>
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
                                            top: ".2rem",
                                            right: ".2rem",
                                            zIndex: 2,
                                        }}
                                    >
                                        {abilityTypeIcon}
                                    </Box>
                                    {trainingStage in PlayerAbilityPrePurchase ? (
                                        <Box
                                            sx={{
                                                zIndex: 2,
                                                position: "absolute",
                                                top: ".2rem",
                                                right: ".2rem",
                                                backgroundColor: "#000000DD",
                                                p: ".2rem .4rem",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ lineHeight: 1, color: colors.gold }}>
                                                FREE
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            sx={{
                                                zIndex: 2,
                                                position: "absolute",
                                                top: ".2rem",
                                                right: ".2rem",
                                                backgroundColor: "#000000DD",
                                                p: ".2rem .4rem",
                                            }}
                                        >
                                            <SvgSupToken size="1.6rem" fill={colors.gold} />
                                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                                10.00 SUPS
                                            </Typography>
                                        </Stack>
                                    )}

                                    <Box
                                        sx={{
                                            zIndex: 2,
                                            position: "absolute",
                                            bottom: ".2rem",
                                            left: ".2rem",
                                            backgroundColor: "#000000DD",
                                            p: ".2rem .4rem",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                            {amount} Owned
                                        </Typography>
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
                                        src={saleAbility.ability.image_url}
                                        alt={`Thumbnail image for ${saleAbility.ability.label}`}
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
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.2,
                                        ...truncateTextLines(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    {saleAbility.ability.label}
                                </Typography>
                            </Stack>
                        </Box>
                    </NiceTooltip>
                </FancyButton>
            </Fade>
        </>
    )
}
