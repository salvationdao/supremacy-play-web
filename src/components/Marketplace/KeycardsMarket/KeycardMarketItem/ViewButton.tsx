import { Stack, Typography } from "@mui/material"
import { useHistory } from "react-router"
import { FancyButton } from "../../.."
import { SvgWallet } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"

export const ViewButton = ({ isGridView, id }: { isGridView: boolean; id: string }) => {
    const theme = useTheme()
    const history = useHistory()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack justifyContent="center">
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "6px",
                    backgroundColor: primaryColor,
                    opacity: 1,
                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1px" },
                    sx: { position: "relative", width: isGridView ? "100%" : "14rem" },
                }}
                sx={{ py: ".25rem", color: secondaryColor }}
                onClick={() => history.push(`/marketplace/key-cards/${id}${location.hash}`)}
            >
                <Stack direction="row" spacing=".8rem" alignItems="center" justifyContent="center">
                    {<SvgWallet size="1.9rem" fill={secondaryColor} />}

                    <Typography
                        variant="caption"
                        sx={{
                            flexShrink: 0,
                            color: secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        BUY NOW
                    </Typography>
                </Stack>
            </FancyButton>
        </Stack>
    )
}
