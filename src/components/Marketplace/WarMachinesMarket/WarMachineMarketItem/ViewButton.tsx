import { Stack, Typography } from "@mui/material"
import { useHistory } from "react-router"
import { FancyButton } from "../../.."
import { SvgWallet, SvgHammer } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts, colors } from "../../../../theme/theme"

export const ViewButton = ({ isGridView, id, buyout }: { isGridView: boolean; id: string; buyout: boolean; auction: boolean }) => {
    const theme = useTheme()
    const history = useHistory()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const auctionColor = colors.auction

    return (
        <Stack justifyContent="center">
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "6px",
                    backgroundColor: buyout ? primaryColor : auctionColor,
                    opacity: 1,
                    border: { isFancy: true, borderColor: buyout ? primaryColor : auctionColor, borderThickness: "1px" },
                    sx: { position: "relative", width: isGridView ? "100%" : "14rem" },
                }}
                sx={{ py: ".25rem", color: buyout ? secondaryColor : "#FFFFFF" }}
                onClick={() => history.push(`/marketplace/war-machines/${id}${location.hash}`)}
            >
                <Stack direction="row" spacing=".8rem" alignItems="center" justifyContent="center">
                    {buyout ? <SvgWallet size="1.9rem" fill={secondaryColor} /> : <SvgHammer size="2rem" />}

                    <Typography
                        variant="caption"
                        sx={{
                            flexShrink: 0,
                            color: buyout ? secondaryColor : "#FFFFFF",
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {buyout ? "BUY NOW" : "PLACE BID"}
                    </Typography>
                </Stack>
            </FancyButton>
        </Stack>
    )
}
