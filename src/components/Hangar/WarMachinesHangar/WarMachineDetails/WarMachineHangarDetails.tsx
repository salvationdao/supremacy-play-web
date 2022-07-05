import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { SvgStats } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsFaction, useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MechBarStats } from "../Common/MechBarStats"
import { MechGeneralStatus } from "../Common/MechGeneralStatus"
import { DeployModal } from "./Modals/DeployModal"
import { LeaveModal } from "./Modals/LeaveModal"
import { MechButtons } from "./MechButtons"
import { MechName } from "./MechName"
import { RentalModal } from "./Modals/RentalModal"
import { MechViewer } from "./MechViewer"
import { MechLoadout } from "./MechLoadout"
import { MechBattleHistoryDetails } from "../../../Marketplace/WarMachinesMarket/WarMachineMarketDetails/MechBattleHistoryDetails"

export const WarMachineHangarDetails = ({ mechID }: { mechID: string }) => {
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [leaveMechModalOpen, setLeaveMechModalOpen] = useState<boolean>(false)
    const [rentalMechModalOpen, setRentalMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachineHangarDetailsInner
                mechID={mechID}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setLeaveMechModalOpen={setLeaveMechModalOpen}
                setRentalMechModalOpen={setRentalMechModalOpen}
            />
            {selectedMechDetails && deployMechModalOpen && (
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
        </>
    )
}

interface WarMachineHangarDetailsInnerProps {
    mechID: string
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarMachineHangarDetailsInner = ({
    mechID,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setRentalMechModalOpen,
}: WarMachineHangarDetailsInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { send: userSend } = useGameServerCommandsUser("/user_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.tier || ""), [mechDetails])

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: mechID,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [mechID, send])

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
                sx={{ flexShrink: 0, height: "100%", width: "41rem" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <ClipThing clipSize="10px" corners={{ topRight: true }} opacity={0.7} sx={{ flexShrink: 0 }}>
                        <Box sx={{ height: "13.5rem", position: "relative", borderBottom: `${primaryColor}60 2.2px solid` }}>
                            <MediaPreview imageUrl={mechDetails?.avatar_url} objectFit="cover" objectPosition="50% 40%" />

                            <Box sx={{ position: "absolute", bottom: ".8rem", left: "1.2rem", minWidth: "10rem", backgroundColor: `${backgroundColor}DF` }}>
                                <MechGeneralStatus mechID={mechID} />
                            </Box>

                            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: `linear-gradient(#FFFFFF00 60%, #00000050)` }} />
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
                                        <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                                            {rarityDeets.label}
                                        </Typography>

                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mechDetails.label}</Typography>

                                        <MechName renameMech={renameMech} mechDetails={mechDetails} />
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
                opacity={0.7}
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
