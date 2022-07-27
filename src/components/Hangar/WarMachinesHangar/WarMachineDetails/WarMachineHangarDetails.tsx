import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { SvgCubes, SvgSkin, SvgStats } from "../../../../assets"
import { BATTLE_ARENA_OPEN } from "../../../../constants"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MechBattleHistoryDetails } from "../../../Marketplace/WarMachinesMarket/WarMachineMarketDetails/MechBattleHistoryDetails"
import { MechBarStats } from "../Common/MechBarStats"
import { MechGeneralStatus } from "../Common/MechGeneralStatus"
import { MechRepairBlocks } from "../Common/MechRepairBlocks"
import { MechButtons } from "./MechButtons"
import { MechLoadout } from "./MechLoadout"
import { MechName } from "./MechName"
import { MechViewer } from "./MechViewer"
import { DeployModal } from "./Modals/DeployModal"
import { LeaveModal } from "./Modals/LeaveModal"
import { RentalModal } from "./Modals/RentalModal"
import { RepairModal } from "./Modals/RepairModal/RepairModal"

export const WarMachineHangarDetails = ({ mechID }: { mechID: string }) => {
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [leaveMechModalOpen, setLeaveMechModalOpen] = useState<boolean>(false)
    const [rentalMechModalOpen, setRentalMechModalOpen] = useState<boolean>(false)
    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachineHangarDetailsInner
                mechID={mechID}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setLeaveMechModalOpen={setLeaveMechModalOpen}
                setRentalMechModalOpen={setRentalMechModalOpen}
                setRepairMechModalOpen={setRepairMechModalOpen}
            />

            {BATTLE_ARENA_OPEN && selectedMechDetails && deployMechModalOpen && (
                <DeployModal
                    selectedMechDetails={selectedMechDetails}
                    deployMechModalOpen={deployMechModalOpen}
                    setDeployMechModalOpen={setDeployMechModalOpen}
                />
            )}

            {selectedMechDetails && leaveMechModalOpen && (
                <LeaveModal selectedMechDetails={selectedMechDetails} leaveMechModalOpen={leaveMechModalOpen} setLeaveMechModalOpen={setLeaveMechModalOpen} />
            )}

            {selectedMechDetails && rentalMechModalOpen && (
                <RentalModal
                    selectedMechDetails={selectedMechDetails}
                    rentalMechModalOpen={rentalMechModalOpen}
                    setRentalMechModalOpen={setRentalMechModalOpen}
                />
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
    mechID: string
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarMachineHangarDetailsInner = ({
    mechID,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setRentalMechModalOpen,
    setRepairMechModalOpen,
}: WarMachineHangarDetailsInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send: userSend } = useGameServerCommandsUser("/user_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.chassis_skin?.tier || mechDetails?.tier || ""), [mechDetails])

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

    const renameMech = useCallback(
        async (newName: string) => {
            try {
                const resp = await userSend<string>(GameServerKeys.MechRename, {
                    mech_id: mechID,
                    new_name: newName,
                })

                if (!resp || !mechDetails) return
                setMechDetails({ ...mechDetails, name: newName })
                newSnackbarMessage("Successfully updated war machine name.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to update war machine name."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [setMechDetails, mechDetails, mechID, userSend, newSnackbarMessage],
    )

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
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
                            pr: "1.4rem",
                            mt: ".6rem",
                            mb: ".8rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                                borderRadius: 3,
                            },
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

                                        <MechName renameMech={renameMech} mechDetails={mechDetails} />
                                    </Stack>

                                    {/* Repair status */}
                                    <Stack spacing=".5rem">
                                        <Stack direction="row" spacing=".8rem" alignItems="center">
                                            <SvgCubes fill={primaryColor} size="1.6rem" />
                                            <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>SYSTEM STATUS</Typography>
                                        </Stack>

                                        <MechRepairBlocks mechID={mechID} defaultBlocks={mechDetails?.model.repair_blocks} />
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
                            setSelectedMechDetails={setSelectedMechDetails}
                            setDeployMechModalOpen={setDeployMechModalOpen}
                            setLeaveMechModalOpen={setLeaveMechModalOpen}
                            setRentalMechModalOpen={setRentalMechModalOpen}
                            setRepairMechModalOpen={setRepairMechModalOpen}
                            marketLocked={mechDetails.market_locked}
                        />
                    )}
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
                        <MechLoadout mechDetails={mechDetails} />
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
