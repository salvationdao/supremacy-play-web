import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { Weapon } from "../../../../../../types"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"
import { WeaponStats } from "../../../../../Common/Stats/WeaponStats"

export interface WeaponTooltipProps {
    id: string
    compareTo?: Weapon
}

export const WeaponTooltip = ({ id, compareTo }: WeaponTooltipProps) => {
    const theme = useTheme()
    const [weapon, setWeapon] = useState<Weapon>()

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${id}/details`,
            key: GameServerKeys.GetWeaponDetails,
        },
        (payload) => {
            if (!payload) return
            setWeapon(payload)
        },
    )

    const content = useMemo(() => {
        if (!weapon) {
            return (
                <Stack
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="2rem" />
                </Stack>
            )
        }

        const rarity = getRarityDeets(weapon.tier)
        return (
            <>
                <Stack
                    sx={{
                        p: "2rem",
                        background: `linear-gradient(to right, ${theme.factionTheme.u800}, ${rarity.color}22)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBold,
                            fontSize: "1.6rem",
                        }}
                    >
                        {weapon.label}
                    </Typography>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{weapon.label}</Typography>
                        <Typography
                            sx={{
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                </Stack>
                <Box position="relative">
                    {weapon.brand && (
                        <Box
                            component="img"
                            src={weapon.brand.logo_url}
                            alt={`${weapon.brand.label} logo`}
                            sx={{
                                zIndex: -1,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                filter: "grayscale(100%)",
                                opacity: 0.1,
                            }}
                        />
                    )}
                    <Box
                        component="img"
                        src={weapon.image_url || weapon.avatar_url}
                        sx={{
                            width: "100%",
                            height: "100%",
                            maxHeight: 140,
                            p: "2rem",
                            objectFit: "contain",
                            borderBottom: `1px solid ${rarity.color}`,
                        }}
                    />
                </Box>
                <Stack spacing=".5rem" p="2rem">
                    <WeaponStats weapon={weapon} compareTo={compareTo} />
                </Stack>
            </>
        )
    }, [compareTo, theme.factionTheme.u800, weapon])

    return (
        <NiceBoxThing
            border={{
                color: weapon ? getRarityDeets(weapon.tier).color : theme.factionTheme.primary,
                thickness: "lean",
            }}
            background={{
                colors: [theme.factionTheme.u800],
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 250,
                width: 400,
            }}
        >
            {content}
        </NiceBoxThing>
    )
}
