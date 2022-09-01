import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { FancyButton } from "../.."
import { useGlobalNotifications } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechDetails, MechStatus, MechStatusEnum } from "../../../types"
import { MechGeneralStatus } from "../../Hangar/WarMachinesHangar/Common/MechGeneralStatus"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { MechName } from "../../Hangar/WarMachinesHangar/WarMachineDetails/MechName"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"

interface QuickDeployItemProps {
    mech: MechBasic
    queueFeed?: QueueFeed
    isSelected?: boolean
    toggleIsSelected?: () => void
    childrenMechStatus: React.MutableRefObject<{
        [mechID: string]: MechStatus
    }>
}

export const QuickDeployItem = ({ isSelected, toggleIsSelected, mech, childrenMechStatus }: QuickDeployItemProps) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.tier || mech.tier || ""), [mech, mechDetails])
    const [mechStatus, setMechStatus] = useState<MechStatus>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    // Get addition mech data
    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${mech.id}/brief_info`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mech.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || mechStatus?.status === MechStatusEnum.Sold) return
            setMechStatus(payload)
            childrenMechStatus.current[mech.id] = payload
        },
    )

    const onDeployQueue = useCallback(
        async (e) => {
            e.stopPropagation()
            e.preventDefault()

            try {
                setIsLoading(true)
                const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                    mech_ids: [mech.id],
                })

                if (resp && resp.success) {
                    newSnackbarMessage("Successfully deployed war machine.", "success")
                    setError(undefined)
                }
            } catch (e) {
                setError(typeof e === "string" ? e : "Failed to deploy war machine.")
                console.error(e)
                return
            } finally {
                setIsLoading(false)
            }
        },
        [send, mech.id, newSnackbarMessage],
    )

    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            alignItems="center"
            onClick={() => mechDetails && toggleIsSelected && toggleIsSelected()}
            sx={{
                position: "relative",
                py: ".8rem",
                pl: ".5rem",
                pr: ".7rem",
                backgroundColor: isSelected ? "#FFFFFF20" : "unset",
                borderRadius: 0.8,
            }}
        >
            {/* Mech image and deploy button */}
            <Stack>
                <Stack sx={{ height: "8rem" }}>
                    <MechThumbnail mech={mech} mechDetails={mechDetails} smallSize />
                </Stack>

                {!error && mechDetails && mechStatus?.can_deploy && (
                    <FancyButton
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "2px",
                            clipSlantSize: "0px",
                            corners: {
                                topLeft: true,
                                topRight: true,
                                bottomLeft: true,
                                bottomRight: true,
                            },
                            backgroundColor: colors.green,
                            opacity: 1,
                            border: {
                                borderColor: colors.green,
                                borderThickness: "1px",
                            },
                            sx: { mt: "-9px" },
                        }}
                        sx={{ px: 0, pt: 0, pb: ".2rem", color: "#FFFFFF" }}
                        onClick={onDeployQueue}
                    >
                        <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            DEPLOY
                        </Typography>
                    </FancyButton>
                )}
            </Stack>

            {/* Right side */}
            <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ py: ".2rem", flex: 1 }}>
                <Stack sx={{ flex: 1 }}>
                    <Stack spacing="1.2rem" direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ py: ".2rem", flex: 1 }}>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoHeavy,
                                    color: rarityDeets.color,
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>

                            {mechDetails && (
                                <MechName
                                    allowEdit
                                    mech={mechDetails.name ? mechDetails : mech}
                                    onRename={(newName) => setMechDetails((prev) => (prev ? { ...prev, name: newName } : prev))}
                                />
                            )}
                        </Box>

                        <MechGeneralStatus mechID={mech.id} smallVersion />
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontWeight: "fontWeightBold",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mech.label}
                    </Typography>

                    <MechRepairBlocks mechID={mech?.id || mechDetails?.id} defaultBlocks={mechDetails?.repair_blocks} />

                    {error && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {error}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}
