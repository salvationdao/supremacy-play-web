import { Stack, Box, Typography } from "@mui/material"
import { getMutiplierDeets } from "../../helpers"
import { MultiplierGuide } from "../../types"

const MultiplierGuideComponent = ({ multiplierType, description, title }: MultiplierGuide) => {
    return (
        <Stack direction="row" spacing="1.3rem">
            <Box
                sx={{
                    height: "3rem",
                    width: "3rem",
                    mt: ".7rem",
                    backgroundImage: `url(${getMutiplierDeets(multiplierType).image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    backgroundSize: "cover",
                    border: `${"#FFFFFF"} 1px solid`,
                    borderRadius: 0.6,
                }}
            />
            <Stack>
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                    {title}
                </Typography>
                <Typography>{description}</Typography>
            </Stack>
        </Stack>
    )
}

export default MultiplierGuideComponent
