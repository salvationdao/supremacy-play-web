import { Box, Checkbox, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgUserDiamond } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { NiceBoxThing } from "../Nice/NiceBoxThing"

export const MechCardWeaponAndStats = React.memo(function MechCardWeaponAndStats({
    mech,
    isSelected,
    toggleSelected,
}: {
    mech: NewMechStruct
    isSelected: boolean
    toggleSelected: (mech: NewMechStruct) => void
}) {
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    return (
        <NiceBoxThing
            border={{
                color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                thickness: isSelected ? "lean" : "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack spacing="1.2rem">
                <Stack direction="row" spacing="1.2rem">
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                        background={{ colors: [ownerFaction.background_color] }}
                        sx={{ boxShadow: 0.4 }}
                    >
                        <Box
                            component="img"
                            src={mech.avatar_url}
                            sx={{
                                height: "7rem",
                                width: "7rem",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    <Stack flex={1} spacing=".4rem" sx={{ py: ".2rem" }}>
                        {/* Mech name and checkbox */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                            {/* Mech name */}
                            <Link to={`/mech/${mech.id}`}>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{mech.name || mech.label}</Typography>
                            </Link>

                            <Checkbox
                                checked={isSelected}
                                onClick={() => toggleSelected(mech)}
                                sx={{
                                    "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue} !important` },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                                }}
                            />
                        </Stack>

                        {/* Owner name */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: ownerFaction.primary_color,
                                fontWeight: "bold",
                                ...truncateTextLines(1),
                            }}
                        >
                            <SvgUserDiamond size="2.5rem" inline fill={ownerFaction.primary_color} /> {mech.owner.username}#{mech.owner.gid}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
