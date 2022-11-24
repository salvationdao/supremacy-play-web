import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { truncateTextLines } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { Keycard } from "../../../types"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { TypographyTruncated } from "../TypographyTruncated"

interface KeycardCardProps {
    keycard: Keycard
}

export const KeycardCard = React.memo(function KeycardCard({ keycard }: KeycardCardProps) {
    return (
        <>
            {keycard.count > 0 && <KeycardCardInner keycard={keycard} />}
            {keycard.item_sale_ids?.map((itemSaleID) => {
                return <KeycardCardInner key={itemSaleID} keycard={keycard} itemSaleID={itemSaleID} />
            })}
        </>
    )
})

interface KeycardCardInnerProps extends KeycardCardProps {
    itemSaleID?: string
}

const KeycardCardInner = React.memo(function KeycardCardInner({ keycard, itemSaleID }: KeycardCardInnerProps) {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    return (
        <NiceBoxThing
            border={{
                color: "#FFFFFF20",
                thickness: "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem", width: "100%", height: "100%", overflow: "hidden" }}
        >
            <Stack spacing="1.2rem">
                {/* Keycard name and count */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing="1rem">
                    {/* Keycard name */}
                    <TypographyTruncated sx={{ fontFamily: fonts.nostromoBlack }}>{keycard.blueprints.label}</TypographyTruncated>

                    {!itemSaleID && (
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {keycard.count}x
                        </Typography>
                    )}
                </Stack>

                {/* Keycard image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.palette.background] }}
                    sx={{ position: "relative", boxShadow: 0.4, flex: 1 }}
                >
                    <MediaPreview
                        imageUrl={keycard.blueprints.image_url}
                        videoUrls={[keycard.blueprints.animation_url, keycard.blueprints.card_animation_url]}
                        objectFit="cover"
                        sx={{ height: "20rem" }}
                        allowModal
                    />
                </NiceBoxThing>

                {/* Keycard description */}
                <Typography variant="h6" sx={{ ...truncateTextLines(2) }}>
                    {keycard.blueprints.description}
                </Typography>
            </Stack>
        </NiceBoxThing>
    )
})
