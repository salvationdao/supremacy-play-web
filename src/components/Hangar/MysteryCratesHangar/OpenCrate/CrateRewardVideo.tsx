import { Box } from "@mui/material"
import { useEffect } from "react"
import { FactionIDs } from "../../../../constants"
import { siteZIndex } from "../../../../theme/theme"
import { MysteryCrateType } from "../../../../types"

const CRATE_OPENING_VIDEOS_MECH: { [factionID: string]: string } = {
    [FactionIDs.ZHI]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/X3_Crate_OpeningVideo.mov",
    [FactionIDs.BC]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/Daison_Crate_OpeningVideo.mov",
    [FactionIDs.RM]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/mech/UMC_Crate_OpeningVideo.mov",
}

const CRATE_OPENING_VIDEOS_WEAPON: { [factionID: string]: string } = {
    [FactionIDs.ZHI]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Warsui_Crate_OpeningVideo.mov",
    [FactionIDs.BC]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Pyro_Crate_OpeningVideo.mov",
    [FactionIDs.RM]: "https://afiles.ninja-cdn.com/passport/nexus/lootbox/opening/weapon/Archon_Crate_OpeningVideo.mov",
}

export const CrateRewardVideo = ({ factionID, crateType, onClose }: { factionID: string; crateType: MysteryCrateType; onClose: () => void }) => {
    const videos = crateType === MysteryCrateType.Mech ? CRATE_OPENING_VIDEOS_MECH : CRATE_OPENING_VIDEOS_WEAPON
    const videoToPlay = videos[factionID]

    useEffect(() => {
        if (!videoToPlay) onClose()
    }, [onClose, videoToPlay])

    if (!videoToPlay) return null

    return (
        <Box
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                zIndex: siteZIndex.Modal * 2,
                border: (theme) => `${theme.factionTheme.primary} 4px solid`,
            }}
        >
            <Box
                component="video"
                sx={{
                    height: "100%",
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
                // poster={`${imageUrl}`}
            >
                <source src={videoToPlay} type="video/mp4" />
            </Box>
        </Box>
    )
}
