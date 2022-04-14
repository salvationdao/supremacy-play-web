import { Box, ButtonBase, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgMicrochip, SvgQuestionMark, SvgSupToken, SvgTarget } from "../../assets"
import { SocketState, useGameServerWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { SaleAbility } from "../../types"
import { TooltipHelper } from "../Common/TooltipHelper"

export interface AbilityCardProps {
    abilityID: string
}

export const SaleAbilityCard = ({ abilityID }: AbilityCardProps) => {
    const { state, subscribe } = useGameServerWebsocket()
    const [saleAbility, setSaleAbility] = useState<SaleAbility | null>(null)
    const [error, setError] = useState<string | null>(null)

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

    useEffect(() => {
        if (state !== SocketState.OPEN || !subscribe) return

        try {
            return subscribe<SaleAbility>(
                GameServerKeys.SaleAbilitySubscribe,
                (resp) => {
                    console.log(resp)
                    setSaleAbility(resp)
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
    }, [state, subscribe])

    if (!saleAbility) {
        return <Box>Loading...</Box>
    }

    return (
        <TooltipHelper text={saleAbility.ability?.description}>
            <ButtonBase
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
                        <Typography>{supFormatter(saleAbility.current_price)}</Typography>
                    </Stack>
                </Box>
            </ButtonBase>
        </TooltipHelper>
    )
}
