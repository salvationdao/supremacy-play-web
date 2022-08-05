import { Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { FancyButton } from ".."
import { useSnackbar } from "../../containers"
import { useTheme } from "../../containers/theme"
import { getRarityDeets } from "../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechBasic, MechDetails, MechStatus, MechStatusEnum } from "../../types"
import { MechGeneralStatus } from "../Hangar/WarMachinesHangar/Common/MechGeneralStatus"
import { MechThumbnail } from "../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { QueueFeed } from "../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"

interface QuickDeployItemProps {
    mech: MechBasic
    queueFeed?: QueueFeed
}

export const QuickDeployItem = ({ mech }: QuickDeployItemProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])
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
        },
    )

    const onDeployQueue = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                asset_hash: mech.hash,
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
    }, [send, mech.hash, newSnackbarMessage])

    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            alignItems="flex-start"
            sx={{
                position: "relative",
                py: ".7rem",
                pl: ".5rem",
                pr: ".7rem",
            }}
        >
            <Stack sx={{ height: "8rem" }}>
                <MechThumbnail mech={mech} mechDetails={mechDetails} smallSize />
            </Stack>

            <Stack alignItems="flex-start" sx={{ py: ".2rem", flex: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        color: rarityDeets.color,
                    }}
                >
                    {rarityDeets.label}
                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
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
                    {mech.name || mech.label}
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1rem" justifyContent="space-between" sx={{ width: "100%" }}>
                    <MechGeneralStatus mechID={mech.id} smallVersion />

                    {!error && mechDetails && mechStatus?.can_deploy && (
                        <FancyButton
                            loading={isLoading}
                            clipThingsProps={{
                                clipSize: "5px",
                                backgroundColor: colors.green,
                                opacity: 1,
                                border: {
                                    borderColor: colors.green,
                                    borderThickness: "1px",
                                },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1rem", pt: 0, pb: ".1rem", color: theme.factionTheme.primary }}
                            onClick={onDeployQueue}
                        >
                            <Stack direction="row" alignItems="center" spacing=".5rem">
                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    DEPLOY
                                </Typography>
                            </Stack>
                        </FancyButton>
                    )}

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
