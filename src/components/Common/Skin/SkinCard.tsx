import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgLoadoutSkin } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { MechSkin, WeaponSkin } from "../../../types"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { TypographyTruncated } from "../TypographyTruncated"

interface SkinCardProps {
    skin: MechSkin | WeaponSkin
}

export const SkinCard = React.memo(function SkinCard({ skin }: SkinCardProps) {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])
    const rarityDeets = useMemo(() => getRarityDeets(skin.tier), [skin.tier])

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
                {/* Skin name and count */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing="1rem">
                    {/* Skin name */}
                    <NiceTooltip placement="bottom-start" text={skin.label}>
                        <TypographyTruncated sx={{ fontFamily: fonts.nostromoBlack }}>{skin.label}</TypographyTruncated>
                    </NiceTooltip>

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: skin.equipped_on ? colors.green : colors.grey, whiteSpace: "nowrap" }}>
                        {skin.equipped_on ? "Equipped" : "Not Equipped"}
                    </Typography>
                </Stack>

                <TypographyTruncated
                    variant="h6"
                    sx={{
                        color: rarityDeets.color,
                        fontWeight: "bold",
                        mt: ".3rem !important",
                    }}
                >
                    <SvgLoadoutSkin inline size="2rem" fill={rarityDeets.color} /> {rarityDeets.label}{" "}
                    {typeof skin.level !== "undefined" && <>[{skin.level}]</>}
                </TypographyTruncated>

                {/* Skin image */}
                <NiceBoxThing
                    border={{ color: `${rarityDeets.color}20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.palette.background] }}
                    sx={{ position: "relative", boxShadow: 0.4, flex: 1 }}
                >
                    <MediaPreview
                        imageUrl={
                            skin.swatch_images?.avatar_url ||
                            skin.swatch_images?.image_url ||
                            skin.swatch_images?.large_image_url ||
                            skin?.avatar_url ||
                            skin?.image_url ||
                            skin?.large_image_url ||
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
