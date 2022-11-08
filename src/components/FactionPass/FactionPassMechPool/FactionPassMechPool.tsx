import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { HangarBg } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"

export const FactionPassMechPool = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: "2rem",
                position: "relative",
                height: "100%",
                backgroundColor: "#000000",
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        ></Stack>
    )
}
