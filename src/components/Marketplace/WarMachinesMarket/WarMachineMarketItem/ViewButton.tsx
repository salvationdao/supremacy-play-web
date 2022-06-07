import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useHistory } from "react-router"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"

export const ViewButton = ({ isGridView, id, marketItem }: { isGridView: boolean; id: string; marketItem: MarketplaceMechItem }) => {
    const theme = useTheme()
    const history = useHistory()

    const marketItemDeets = useMemo(() => consolidateMarketItemDeets(marketItem, theme), [marketItem, theme])

    return (
        <Stack justifyContent="center">
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "6px",
                    backgroundColor: marketItemDeets.primaryColor,
                    opacity: 1,
                    border: { isFancy: true, borderColor: marketItemDeets.primaryColor, borderThickness: "1px" },
                    sx: { position: "relative", width: isGridView ? "100%" : "14rem" },
                }}
                sx={{ py: ".25rem", color: marketItemDeets.secondaryColor }}
                onClick={() => history.push(`/marketplace/war-machines/${id}${location.hash}`)}
            >
                <Stack direction="row" spacing=".8rem" alignItems="center" justifyContent="center">
                    {<marketItemDeets.Icon size="1.9rem" fill={marketItemDeets.secondaryColor} />}

                    <Typography
                        variant="caption"
                        sx={{
                            flexShrink: 0,
                            color: marketItemDeets.secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {marketItemDeets.ctaLabel}
                    </Typography>
                </Stack>
            </FancyButton>
        </Stack>
    )
}
