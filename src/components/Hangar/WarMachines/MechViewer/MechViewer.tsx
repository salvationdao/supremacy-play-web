import { Box, Fade } from "@mui/material"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../../containers/theme"

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
                        border: `${theme.factionTheme.primary}90 .3rem solid`,
                        borderLeft: "none",
                        boxShadow: 2,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            boxShadow: `inset 0 0 50px 60px ${theme.factionTheme.background}90`,
                            zIndex: 4,
                        }}
                    />

                    <Box
                        component="video"
                        sx={{
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "50% 8%",
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
