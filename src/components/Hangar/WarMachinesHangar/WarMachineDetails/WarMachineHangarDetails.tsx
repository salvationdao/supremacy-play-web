import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { SvgCubes, SvgSkin, SvgStats } from "../../../../assets"
import { BATTLE_ARENA_OPEN } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { pulseEffect } from "../../../../theme/keyframes"
import { fonts } from "../../../../theme/theme"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MechBattleHistoryDetails } from "../../../Marketplace/WarMachinesMarket/WarMachineMarketDetails/MechBattleHistoryDetails"
import { MechBarStats } from "../Common/MechBarStats"
import { MechGeneralStatus } from "../Common/MechGeneralStatus"
import { MechRepairBlocks } from "../Common/MechRepairBlocks"
import { MechButtons } from "./MechButtons"
import { MechLoadout } from "./MechLoadout/MechLoadout"
import { MechName } from "./MechName"
import { DeployModal } from "./Modals/DeployModal"
import { StakeModal } from "./Modals/StakeModal"
import { RepairModal } from "./Modals/RepairModal/RepairModal"

interface WarMachineHangarDetailsProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
}

export const WarMachineHangarDetails = ({ drawerContainerRef, mechID }: WarMachineHangarDetailsProps) => {
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [stakeMechModalOpen, setStakeMechModalOpen] = useState<boolean>(false)
    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachineHangarDetailsInner
                drawerContainerRef={drawerContainerRef}
                mechID={mechID}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setStakeMechModalOpen={setStakeMechModalOpen}
                setRepairMechModalOpen={setRepairMechModalOpen}
            />

            {BATTLE_ARENA_OPEN && selectedMechDetails && deployMechModalOpen && (
                <DeployModal
                    selectedMechDetails={selectedMechDetails}
                    deployMechModalOpen={deployMechModalOpen}
                    setDeployMechModalOpen={setDeployMechModalOpen}
                />
            )}

            {selectedMechDetails && stakeMechModalOpen && (
                <StakeModal selectedMechDetails={selectedMechDetails} rentalMechModalOpen={stakeMechModalOpen} setRentalMechModalOpen={setStakeMechModalOpen} />
            )}

            {selectedMechDetails && repairMechModalOpen && (
                <RepairModal
                    selectedMechDetails={selectedMechDetails}
                    repairMechModalOpen={repairMechModalOpen}
                    setRepairMechModalOpen={setRepairMechModalOpen}
                />
            )}
        </>
    )
}

interface WarMachineHangarDetailsInnerProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setStakeMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarMachineHangarDetailsInner = ({
    drawerContainerRef,
    mechID,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setStakeMechModalOpen,
    setRepairMechModalOpen,
}: WarMachineHangarDetailsInnerProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [mechStatus, setMechStatus] = useState<MechStatus>()

    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.chassis_skin?.tier || mechDetails?.tier || ""), [mechDetails])

    const updateMechDetails = (newMechDetails: MechDetails) => setMechDetails(newMechDetails)

    const [mechIsStaked, setMechIsStaked] = useState(false)
    useGameServerSubscription<boolean>(
        {
            URI: `/public/mech/${mechID}/is_staked`,
            key: GameServerKeys.SubMechIsStaked,
        },
        setMechIsStaked,
    )

    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${mechID}/details`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechID}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || payload.status === MechStatusEnum.Sold) return
            setMechStatus(payload)
        },
    )

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url
    const imageUrl = mechDetails?.chassis_skin?.image_url || mechDetails?.image_url

    return (
        <Stack position="relative" direction="row" spacing="1rem" sx={{ height: "100%" }}>
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
                                    bottom: "1rem",
                                    left: "1.2rem",
                                    minWidth: "10rem",
                                    backgroundColor: `${backgroundColor}DF`,
                                    zIndex: 2,
                                }}
                            >
                                <MechGeneralStatus mechID={mechID} />
                            </Box>

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
                            pr: "1.3rem",
                            mr: ".6rem",
                            mt: ".5rem",
                            mb: "1.5rem",
                            py: ".5rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: 0 }}>
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

                                        <MechName
                                            onRename={(newName) => setMechDetails({ ...mechDetails, name: newName })}
                                            mech={mechDetails}
                                            allowEdit={userID === mechDetails.owner_id}
                                        />
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
                    </Box>

                    {/* Status and buttons */}
                    {mechDetails && (
                        <MechButtons
                            mechDetails={mechDetails}
                            mechStatus={mechStatus}
                            mechIsStaked={mechIsStaked}
                            setSelectedMechDetails={setSelectedMechDetails}
                            setDeployMechModalOpen={setDeployMechModalOpen}
                            setStakeMechModalOpen={setStakeMechModalOpen}
                            setRepairMechModalOpen={setRepairMechModalOpen}
                            marketLocked={mechDetails.market_locked}
                        />
                    )}
                </Stack>
            </ClipThing>

            {/* Right side */}
            {mechDetails ? (
                <MechLoadout drawerContainerRef={drawerContainerRef} mechDetails={mechDetails} mechStatus={mechStatus} onUpdate={updateMechDetails} />
            ) : (
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Typography
                            variant="h4"
                            fontWeight="fontWeightBold"
                            sx={{
                                animation: `${pulseEffect} 2s infinite`,
                            }}
                        >
                            LOADING MECH...
                        </Typography>
                    </Stack>
                </ClipThing>
            )}
        </Stack>
    )
}
