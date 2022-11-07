import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgCubes, SvgSkin, SvgStats } from "../../../assets"
import { getRarityDeets } from "../../../helpers"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { MechDetails } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { MechViewer } from "../../Hangar/WarMachinesHangar/WarMachineDetails/MechViewer/MechViewer"
import { MechBattleHistoryDetails } from "../../Marketplace/WarMachinesMarket/WarMachineMarketDetails/MechBattleHistoryDetails"

export const WarmachineDetails = ({ mechID, primaryColor, backgroundColor }: { mechID: string; primaryColor: string; backgroundColor: string }) => {
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.chassis_skin?.tier || mechDetails?.tier || ""), [mechDetails])

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mechID}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url
    const imageUrl = mechDetails?.chassis_skin?.image_url || mechDetails?.image_url

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            {/* Left side */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
                sx={{ flexShrink: 0, height: "100%", width: "39rem" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <ClipThing clipSize="10px" corners={{ topRight: true }} opacity={0.7} sx={{ flexShrink: 0 }}>
                        <Box sx={{ position: "relative", borderBottom: `${primaryColor}60 2.2px solid` }}>
                            <MediaPreview imageUrl={avatarUrl || imageUrl} objectFit="cover" sx={{ height: "30rem" }} />

                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: `linear-gradient(#FFFFFF00 60%, #000000)`,
                                    zIndex: 1,
                                }}
                            />
                        </Box>
                    </ClipThing>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            ml: "1.9rem",
                            pr: "1.4rem",
                            mt: ".6rem",
                            mb: ".8rem",
                            direction: "ltr",
                        }}
                    >
                        {mechDetails ? (
                            <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                                {/* Mech avatar, label, name etc */}
                                <Stack spacing=".5rem">
                                    <Stack spacing=".5rem" direction="row" alignItems="center">
                                        <SvgSkin fill={rarityDeets.color} />
                                        <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                                            {rarityDeets.label}
                                        </Typography>
                                    </Stack>

                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mechDetails.label}</Typography>
                                    {mechDetails.name && <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mechDetails.name}</Typography>}
                                </Stack>

                                {/* Repair status */}
                                <Stack spacing=".5rem">
                                    <Stack direction="row" spacing=".8rem" alignItems="center">
                                        <SvgCubes fill={primaryColor} size="1.6rem" />
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>SYSTEM STATUS</Typography>
                                    </Stack>

                                    <MechRepairBlocks mechID={mechID} defaultBlocks={mechDetails?.repair_blocks} />
                                </Stack>

                                {/* Bar stats */}
                                <Stack spacing=".5rem">
                                    <Stack direction="row" spacing=".8rem" alignItems="center">
                                        <SvgStats fill={primaryColor} size="1.6rem" />
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>WAR MACHINE STATS</Typography>
                                    </Stack>

                                    <MechBarStats
                                        mech={mechDetails}
                                        mechDetails={mechDetails}
                                        color={primaryColor}
                                        fontSize="1.2rem"
                                        width="100%"
                                        spacing="1.2rem"
                                        barHeight=".9rem"
                                    />
                                </Stack>

                                {/* Mech battle history */}
                                <Box sx={{ pt: "2rem" }}>
                                    <MechBattleHistoryDetails mechDetails={mechDetails} smallSize />
                                </Box>
                            </Stack>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "20rem" }}>
                                <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </ClipThing>

            {/* Right side */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                backgroundColor={backgroundColor}
                sx={{ height: "100%", flex: 1 }}
            >
                {mechDetails ? (
                    <>
                        <MechViewer mechDetails={mechDetails} />
                    </>
                ) : (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                )}
            </ClipThing>
        </Stack>
    )
}
