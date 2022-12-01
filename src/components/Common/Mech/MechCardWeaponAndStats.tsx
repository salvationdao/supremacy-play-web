import { Checkbox, Stack, SxProps } from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgUserDiamond } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { MechWeaponSlot } from "../../../types/battle_queue"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { TypographyTruncated } from "../TypographyTruncated"
import { MechTooltipRender } from "./MechTooltipRender/MechTooltipRender"

const MIN_NUM_WEAPONS = 4

export const MechCardWeaponAndStats = React.memo(function MechCardWeaponAndStats({
    mech,
    isSelected,
    toggleSelected,
    sx,
}: {
    mech: NewMechStruct
    isSelected?: boolean
    toggleSelected?: (mech: NewMechStruct) => void
    sx?: SxProps
}) {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    return (
        <NiceTooltip
            placement="right-start"
            enterDelay={450}
            enterNextDelay={700}
            renderNode={<MechTooltipRender mech={mech} />}
            color={ownerFaction.palette.primary}
        >
            <NiceBoxThing
                border={{
                    color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                    thickness: isSelected ? "lean" : "very-lean",
                }}
                background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
                sx={{ p: "1rem 1.5rem", width: "100%", height: "100%", overflow: "hidden", ...sx }}
            >
                <Stack spacing="1.2rem" sx={{ overflow: "hidden" }}>
                    <Stack direction="row" spacing="1.2rem">
                        {/* Mech image */}
                        <NiceBoxThing
                            border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                            background={{ colors: [ownerFaction.palette.background] }}
                            sx={{ boxShadow: 0.4 }}
                        >
                            <MediaPreview imageUrl={mech.avatar_url} objectFit="cover" sx={{ height: "7rem", width: "7rem" }} />
                        </NiceBoxThing>

                        <Stack flex={1} spacing=".4rem" sx={{ py: ".2rem" }}>
                            {/* Mech name and checkbox */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                                {/* Mech name */}
                                <Link to={`/mech/${mech.id}`}>
                                    <TypographyTruncated sx={{ fontFamily: fonts.nostromoBlack }}>{mech.name || mech.label}</TypographyTruncated>
                                </Link>

                                {toggleSelected && (
                                    <Checkbox
                                        checked={isSelected}
                                        onClick={() => toggleSelected(mech)}
                                        sx={{
                                            "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue} !important` },
                                            ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Owner name */}
                            <TypographyTruncated
                                variant="h6"
                                sx={{
                                    color: userID === mech.owner.id ? colors.gold : ownerFaction.palette.primary,
                                    fontWeight: "bold",
                                }}
                            >
                                <SvgUserDiamond size="2.5rem" inline fill={userID === mech.owner.id ? colors.gold : ownerFaction.palette.primary} />{" "}
                                {mech.owner.username}#{mech.owner.gid}
                            </TypographyTruncated>
                        </Stack>
                    </Stack>

                    {/* Equipped weapons */}
                    <Stack direction="row" spacing="1rem" sx={{ overflowX: "auto", pb: ".5rem" }}>
                        {/* Mech stats
                    <MechStats mech={mech} sx={{ flex: 1 }} /> */}
                        {mech.weapon_slots && mech.weapon_slots.map((ws) => <WeaponSlot key={`weapon-${ws.slot_number}`} weaponSlot={ws} />)}

                        {/* Empty slots */}
                        {MIN_NUM_WEAPONS - (mech.weapon_slots?.length || 0) > 0 &&
                            new Array(MIN_NUM_WEAPONS - (mech.weapon_slots?.length || 0))
                                .fill(0)
                                .map((_, index) => <WeaponSlot key={`weapon-empty-${index}`} />)}
                    </Stack>
                </Stack>
            </NiceBoxThing>
        </NiceTooltip>
    )
})

const WeaponSlot = React.memo(function WeaponSlot({ weaponSlot }: { weaponSlot?: MechWeaponSlot }) {
    if (!weaponSlot?.weapon) {
        return <div style={{ flex: 1 }} />
    }

    return (
        <MediaPreview
            showBorder
            imageUrl={weaponSlot.weapon.avatar_url || weaponSlot.weapon.image_url}
            objectFit="contain"
            sx={{ height: "5rem", minWidth: "5rem", flex: 1, p: ".6rem", background: "#00000018" }}
        />
    )
})
