import { Stack, Box, Typography } from "@mui/material"
import { getMultiplierGuide, getMutiplierDeets } from "../../helpers"
import { colors } from "../../theme/theme"

const MultiplierGuideComponent = ({ multiplierKey }: { multiplierKey: string }) => {
    const { title, description, amount, duration } = getMultiplierGuide(multiplierKey)

    return (
        <Stack direction="row" spacing="1.3rem">
            <Box
                sx={{
                    height: "3.2rem",
                    width: "3.2rem",
                    mt: ".7rem",
                    flexShrink: 0,
                    backgroundImage: `url(${getMutiplierDeets(multiplierKey).image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    backgroundSize: "contain",
                    border: `${"#FFFFFF"} 1px solid`,
                    borderRadius: 0.6,
                }}
            />
            <Stack>
                <Typography variant="h6" sx={{ color: colors.offWhite, fontWeight: "fontWeightBold" }}>
                    {title.toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: "1.5rem" }}>
                    <strong>Multiplier:</strong> {amount}x
                    <br />
                    <strong>Duration:</strong> {duration} battle{duration == 1 ? "" : "s"}
                    <br />
                    {description}
                </Typography>
            </Stack>
        </Stack>
    )
}

export default MultiplierGuideComponent
