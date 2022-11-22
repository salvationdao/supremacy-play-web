import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgSkin } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { getRarityDeets, truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { MechSkin, WeaponSkin } from "../../../types"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"

interface SubmodelCardProps {
    submodel: MechSkin | WeaponSkin
}

export const SubmodelCard = React.memo(function SubmodelCard({ submodel }: SubmodelCardProps) {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])
    const rarityDeets = useMemo(() => getRarityDeets(submodel.tier), [submodel.tier])

    return (
        <NiceBoxThing
            border={{
                color: `${rarityDeets.color}50`,
                thickness: "very-lean",
            }}
            background={{ colors: [rarityDeets.color, rarityDeets.color], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem", width: "100%", height: "100%", overflow: "hidden" }}
        >
            <Stack spacing="1.2rem">
                {/* Submodel name and count */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing="1rem">
                    {/* Submodel name */}
                    <NiceTooltip placement="bottom-start" text={submodel.label}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{submodel.label}</Typography>
                    </NiceTooltip>

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: submodel.equipped_on ? colors.green : colors.grey, whiteSpace: "nowrap" }}>
                        {submodel.equipped_on ? "Equipped" : "Not Equipped"}
                    </Typography>
                </Stack>

                <Typography
                    variant="h6"
                    sx={{
                        color: rarityDeets.color,
                        fontWeight: "bold",
                        mt: ".3rem !important",
                        ...truncateTextLines(1),
                    }}
                >
                    <SvgSkin inline size="2rem" fill={rarityDeets.color} /> {rarityDeets.label}{" "}
                    {typeof submodel.level !== "undefined" && <>[{submodel.level}]</>}
                </Typography>

                {/* Submodel image */}
                <NiceBoxThing
                    border={{ color: `${rarityDeets.color}20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.palette.background] }}
                    sx={{ position: "relative", boxShadow: 0.4, flex: 1 }}
                >
                    <MediaPreview
                        imageUrl={
                            submodel.swatch_images?.avatar_url ||
                            submodel.swatch_images?.image_url ||
                            submodel.swatch_images?.large_image_url ||
                            submodel?.avatar_url ||
                            submodel?.image_url ||
                            submodel?.large_image_url ||
                            ""
                        }
                        objectFit="contain"
                        sx={{ height: "20rem" }}
                        allowModal
                    />
                </NiceBoxThing>
            </Stack>
        </NiceBoxThing>
    )
})
