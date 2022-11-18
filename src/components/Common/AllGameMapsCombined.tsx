import { Box, Stack, SxProps } from "@mui/material"
import React from "react"
import { useArena } from "../../containers"

export const AllGameMapsCombined = React.memo(function AllGameMapsCombined({ sx }: { sx?: SxProps }) {
    const { gameMaps } = useArena()

    return (
        <Stack direction="row" alignItems="center" sx={{ transform: "skewX(-10deg)", overflow: "hidden", ...sx }}>
            {gameMaps.map((gm) => (
                <Box
                    key={gm.id}
                    sx={{
                        flex: 1,
                        height: "100%",
                        backgroundImage: `url(${gm.background_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />
            ))}
        </Stack>
    )
})
