import { Box, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { FactionIDs } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { MysteryCrateType } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"

const CRATE_OPENING_VIDEOS_MECH: { [factionID: string]: string } = {
    [FactionIDs.ZHI]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/X3_Crate_OpeningVideo.mp4",
    [FactionIDs.RM]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/UMC_Crate_OpeningVideo.mp4",
    [FactionIDs.BC]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/Daison_Crate_OpeningVideo.mp4",
}

const CRATE_OPENING_VIDEOS_WEAPON: { [factionID: string]: string } = {
    [FactionIDs.ZHI]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Warsui_Crate_OpeningVideo.mp4",
    [FactionIDs.RM]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Pyro_Crate_OpeningVideo.mp4",
    [FactionIDs.BC]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Archon_Crate_OpeningVideo.mp4",
}

export const CrateRewardVideo = ({ factionID, crateType, onClose }: { factionID: string; crateType: MysteryCrateType; onClose: () => void }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const videos = crateType === MysteryCrateType.Mech ? CRATE_OPENING_VIDEOS_MECH : CRATE_OPENING_VIDEOS_WEAPON
    const videoToPlay = videos[factionID]

    useEffect(() => {
        if (!videoToPlay) onClose()
    }, [onClose, videoToPlay])

    if (!videoToPlay) return null

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                zIndex: siteZIndex.Modal * 2,
                backgroundColor: "#000000",
            }}
        >
            <Box
                component="video"
                sx={{
                    height: "calc(100% - 22%)",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                }}
                disablePictureInPicture
                disableRemotePlayback
                playsInline
                onEnded={onClose}
                loop={false}
                muted={false}
                autoPlay
                controls={false}
            >
                <source src={videoToPlay} type="video/mp4" />
            </Box>

            <FancyButton
                clipThingsProps={{
                    clipSize: "9px",
                    backgroundColor: backgroundColor,
                    opacity: 0.8,
                    border: { borderColor: primaryColor, borderThickness: "2px" },
                    sx: { position: "absolute", bottom: "3rem", right: "3rem" },
                }}
                sx={{ px: "1.6rem", py: ".3rem", color: primaryColor, minWidth: "10rem" }}
                onClick={onClose}
            >
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: primaryColor }}>
                    SKIP
                </Typography>
            </FancyButton>
        </Stack>
    )
}
