import { Box, Fade } from "@mui/material"
import { useHangarWarMachine } from "../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../containers/theme"

export const MechViewer = () => {
    const theme = useTheme()
    const { selectedMechDetails } = useHangarWarMachine()

    if (!selectedMechDetails) return null

    const skin = selectedMechDetails.chassis_skin || selectedMechDetails.default_chassis_skin
    const imageUrl = skin?.large_image_url || selectedMechDetails.large_image_url
    const animationUrl = skin?.animation_url || selectedMechDetails.animation_url

    return (
        <Box sx={{ height: "100%", flex: 1, py: "1.5rem" }}>
            <Fade in key={`mech-viewer-${selectedMechDetails.id}`}>
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        border: `${theme.factionTheme.primary}90 1px solid`,
                        boxShadow: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            background: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            filter: "blur(2px)",
                            zIndex: 2,
                        }}
                    />

                    <Box
                        component="video"
                        sx={{
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            zIndex: 3,
                        }}
                        loop
                        muted
                        autoPlay
                        poster={`${imageUrl}`}
                    >
                        <source src={animationUrl} type="video/mp4" />
                    </Box>
                </Box>
            </Fade>
        </Box>
    )
}
