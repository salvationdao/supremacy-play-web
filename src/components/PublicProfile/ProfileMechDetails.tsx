import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { getRarityDeets } from "../../helpers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { fonts } from "../../theme/theme"
import { MechBasic, MechDetails } from "../../types"
import { FancyButton } from "../Common/FancyButton"
import { MediaPreview } from "../Common/MediaPreview/MediaPreview"

export const ProfileWarmachineItem = ({
    mech,
    isGridView,
    primaryColour,
    backgroundColour,
}: {
    mech: MechBasic
    isGridView?: boolean
    primaryColour: string
    backgroundColour: string
}) => {
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mech.id}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const imageUrl = mechDetails?.chassis_skin?.avatar_url || mech.avatar_url
    const largeImageUrl = mechDetails?.large_image_url || mech.large_image_url

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: backgroundColour,
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: primaryColour, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColour, textAlign: "start", height: "100%" }}
                // TODO create public mech view
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `8rem auto repeat(2, 20rem)`, // hard-coded to have 6 columns, adjust as required
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: isGridView ? "15rem" : "100%",
                            width: "100%",
                        }}
                    >
                        <MediaPreview imageUrl={imageUrl} objectFit={isGridView ? "cover" : "contain"} />
                    </Box>

                    <Stack>
                        <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                            {rarityDeets.label}
                        </Typography>

                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mech.label}</Typography>

                        <Typography variant="h6" sx={{}}>
                            {mech.name}
                        </Typography>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${largeImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.06,
                        zIndex: -2,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF08, ${backgroundColour}90)`,
                        zIndex: -1,
                    }}
                />
            </FancyButton>
        </Box>
    )
}
