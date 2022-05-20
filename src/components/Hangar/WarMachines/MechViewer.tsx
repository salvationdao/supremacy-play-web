import { Box, Fade } from "@mui/material"
import { useHangarWarMachine } from "../../../containers/hangar/hangarWarMachines"

export const MechViewer = () => {
    const { selectedMechDetails } = useHangarWarMachine()

    if (!selectedMechDetails) return null

    const skin = selectedMechDetails.chassis_skin || selectedMechDetails.default_chassis_skin
    const imageUrl = skin?.large_image_url || selectedMechDetails.large_image_url

    return (
        <Box sx={{ height: "100%", flex: 1, boxShadow: 3 }}>
            <Fade in key={`mech-viewer-${selectedMechDetails.id}`}>
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                    }}
                />
            </Fade>
        </Box>
    )
}
