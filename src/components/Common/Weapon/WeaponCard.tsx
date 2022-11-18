import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgAmmo, SvgDamage1, SvgRadius, SvgRateOfFire } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { numFormatter, truncateTextLines } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { NiceBoxThing } from "../Nice/NiceBoxThing"

interface WeaponCardProps {
    weapon: Weapon
    isGridView: boolean
    hide?: {
        stats?: boolean
    }
}

// CSS grid widths of each component in list view
const MECH_IMAGE_GRID_WIDTH = "8rem"
const MECH_NAME_GRID_WIDTH = "minmax(8rem, 1fr)"
const STATS_WIDTH = "repeat(4, 5rem)"

export const WeaponCard = React.memo(function WeaponCard({ weapon, hide, isGridView }: WeaponCardProps) {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    // CSS grid widths
    const cssGridWidths = useMemo(() => {
        const result: string[] = []
        result.push(MECH_IMAGE_GRID_WIDTH)
        result.push(MECH_NAME_GRID_WIDTH)
        if (!hide?.stats) result.push(STATS_WIDTH)
        return result.join(" ")
    }, [hide])

    const image = weapon.weapon_skin?.avatar_url || weapon.avatar_url || weapon.weapon_skin?.image_url || weapon.image_url

    // List view
    if (!isGridView) {
        return (
            <NiceBoxThing
                border={{
                    color: "#FFFFFF20",
                    thickness: "very-lean",
                }}
                background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
                sx={{
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: "1rem 1.5rem",
                        display: "grid",
                        gridTemplateRows: "8rem",
                        gridTemplateColumns: cssGridWidths,
                        gap: "3rem",
                        alignItems: "center",
                        overflowY: "hidden",
                        overflowX: "auto",
                    }}
                >
                    {/* Weapon image */}
                    <NiceBoxThing
                        border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                        background={{ colors: [ownerFaction.background_color] }}
                        sx={{ height: "100%", width: "100%", boxShadow: 0.4 }}
                    >
                        <Box
                            component="img"
                            src={image}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    {/* Weapon name */}
                    <Link to={`/weapon/${weapon.id}`}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{weapon.label}</Typography>
                    </Link>

                    {/* Weapon stats */}
                    {!hide?.stats && (
                        <>
                            <Typography whiteSpace="nowrap">
                                <SvgDamage1 inline size="1.6rem" />
                                {numFormatter(parseFloat(weapon.damage))}
                            </Typography>
                            <Typography whiteSpace="nowrap">
                                <SvgAmmo inline size="1.6rem" />
                                {numFormatter(parseFloat(weapon.max_ammo || "0"))}
                            </Typography>
                            <Typography whiteSpace="nowrap">
                                <SvgRadius inline size="1.6rem" />
                                {numFormatter(parseFloat(weapon.radius || "0"))}
                            </Typography>
                            <Typography whiteSpace="nowrap">
                                <SvgRateOfFire inline size="1.6rem" />
                                {numFormatter(parseFloat(weapon.rate_of_fire || "0"))}
                            </Typography>
                        </>
                    )}
                </Box>
            </NiceBoxThing>
        )
    }

    // Grid view
    return (
        <NiceBoxThing
            border={{
                color: "#FFFFFF20",
                thickness: "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack spacing="1.2rem">
                {/* Weapon name */}
                <Link to={`/weapon/${weapon.id}`}>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{weapon.label}</Typography>
                </Link>

                {/* Weapon image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.background_color] }}
                    sx={{ boxShadow: 0.4 }}
                >
                    <Box
                        component="img"
                        src={image}
                        sx={{
                            height: "20rem",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                </NiceBoxThing>

                {/* Weapon stats */}
                {!hide?.stats && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".8rem"
                        sx={{
                            "&>*": { flex: 1, p: ".2rem 1rem", pt: ".5rem", lineHeight: 1, backgroundColor: "#FFFFFF16", boxShadow: 0.4 },
                        }}
                    >
                        <Typography whiteSpace="nowrap">
                            <SvgDamage1 inline size="1.6rem" />
                            {numFormatter(parseFloat(weapon.damage))}
                        </Typography>
                        <Typography whiteSpace="nowrap">
                            <SvgAmmo inline size="1.6rem" />
                            {numFormatter(parseFloat(weapon.max_ammo || "0"))}
                        </Typography>
                        <Typography whiteSpace="nowrap">
                            <SvgRadius inline size="1.6rem" />
                            {numFormatter(parseFloat(weapon.radius || "0"))}
                        </Typography>
                        <Typography whiteSpace="nowrap">
                            <SvgRateOfFire inline size="1.6rem" />
                            {numFormatter(parseFloat(weapon.rate_of_fire || "0"))}
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </NiceBoxThing>
    )
})
