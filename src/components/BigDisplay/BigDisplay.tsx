import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useUI } from "../../containers"
import { BattleArenaBanner } from "./BattleArenaBanner"
import { MiniMap } from "./MiniMap/MiniMap"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    const { setBigDisplayRef } = useUI()

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", width: "100%", height: "100%" }}>
                <BattleArenaBanner />

                <Box ref={setBigDisplayRef} sx={{ position: "relative", width: "100%", flex: 1 }}>
                    {/* One of the stream and minimap will mount itself to the left drawer, not both are rendered here */}
                    <Stream />
                    <MiniMap />
                </Box>
            </Stack>
        )
    }, [setBigDisplayRef])
}
