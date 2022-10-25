import { Box, Fade, Stack } from "@mui/material"
import { useState } from "react"
import { ClaimsBg } from "../../assets"
import { siteZIndex } from "../../theme/theme"
import { RewardResponse } from "../../types"
import { ClaimedRewards } from "./ClaimedRewards"
import { CodeRedemption } from "./CodeRedemption"

export const Claims = () => {
    const [rewards, setRewards] = useState<RewardResponse[]>()

    return (
        <Box
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${ClaimsBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Stack justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
                <Fade in>
                    <Stack justifyContent="center">
                        {!rewards && <CodeRedemption setRewards={setRewards} />}
                        {rewards && <ClaimedRewards rewards={rewards} />}
                    </Stack>
                </Fade>
            </Stack>
        </Box>
    )
}
