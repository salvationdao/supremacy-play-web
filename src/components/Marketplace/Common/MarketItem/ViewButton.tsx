import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { useHistory } from "react-router"
import { FancyButton } from "../../.."
import { fonts } from "../../../../theme/theme"

export const ViewButton = ({
    isGridView,
    primaryColor,
    secondaryColor,
    listingTypeLabel,
    ctaLabel,
    icon,
    to,
}: {
    isGridView: boolean
    primaryColor: string
    secondaryColor: string
    listingTypeLabel: string
    ctaLabel: string
    icon: ReactNode
    to: string
}) => {
    const history = useHistory()

    return (
        <Stack alignItems="center" spacing={isGridView ? ".3rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: primaryColor }}>
                {listingTypeLabel}
            </Typography>
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
                onClick={() => history.push(to)}
            >
                <Stack direction="row" spacing=".8rem" alignItems="center" justifyContent="center">
                    {icon}

                    <Typography
                        variant="caption"
                        sx={{
                            flexShrink: 0,
                            color: secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {ctaLabel}
                    </Typography>
                </Stack>
            </FancyButton>
        </Stack>
    )
}
