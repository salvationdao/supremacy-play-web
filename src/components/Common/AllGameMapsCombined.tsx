import { Box, Stack, SxProps } from "@mui/material"
import React from "react"
import { useArena } from "../../containers"

export const AllGameMapsCombined = React.memo(function AllGameMapsCombined({ sx }: { sx?: SxProps }) {
    const { gameMaps } = useArena()

    return (
        <Box sx={{ overflow: "hidden", ...sx }}>
            <Stack direction="row" alignItems="center" sx={{ transform: "skewX(-10deg)", width: "100%", height: "100%" }}>
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
        </Box>
    )
})
