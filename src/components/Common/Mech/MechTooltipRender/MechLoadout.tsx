import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { RarityEnum } from "../../../../types"
import { NiceBoxThing } from "../../Nice/NiceBoxThing"

export interface LoadoutItem {
    name: string
    imageUrl: string
    tier?: RarityEnum
}

export const MechLoadout = React.memo(function MechLoadout({
    items,
    title,
    fallbackColor,
    totalSlots,
}: {
    items: LoadoutItem[]
    title: string
    fallbackColor?: string
    totalSlots?: number // If supplied, will render blank slots
}) {
    return (
        <Box sx={{ overflow: "hidden" }}>
            <Typography gutterBottom fontFamily={fonts.nostromoBlack}>
                {title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing="1.6rem" sx={{ pb: ".6rem", overflowX: "auto", overflowY: "hidden" }}>
                {items.map((item, i) => {
                    const rarityDeets = item.tier ? getRarityDeets(item.tier) : undefined
                    const color = rarityDeets?.color || fallbackColor || colors.neonBlue

                    return (
                        <NiceBoxThing
                            key={`item-${i}`}
                            border={{ color: color }}
                            background={{ colors: [`${color}20`] }}
                            sx={{ width: "6.5rem", height: "6.5rem", flexShrink: 0 }}
                        >
                            <Box
                                component="img"
                                src={item.imageUrl}
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                }}
                            />
                        </NiceBoxThing>
                    )
                })}

                {/* Empty slots */}
                {totalSlots &&
                    totalSlots - items.length > 0 &&
                    new Array(totalSlots - items.length).fill(0).map((_, index) => {
                        return (
                            <NiceBoxThing
                                key={`empty-slot-${index}`}
                                border={{ color: colors.grey }}
                                background={{ colors: [`${colors.grey}20`] }}
                                sx={{
                                    width: "6.5rem",
                                    height: "6.5rem",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0.5,
                                }}
                            >
                                <Typography variant="subtitle1" textAlign="center" fontFamily={fonts.nostromoBold} color={colors.grey}>
                                    EMPTY
                                </Typography>
                            </NiceBoxThing>
                        )
                    })}
            </Stack>
        </Box>
    )
})
