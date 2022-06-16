import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { FancyButton } from ".."
import { useTheme } from "../../containers/theme"
import { getRarityDeets } from "../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechBasic, MechDetails, MechStatus, MechStatusEnum } from "../../types"
import { MechGeneralStatus } from "../Hangar/WarMachinesHangar/WarMachineHangarItem/MechGeneralStatus"
import { MechThumbnail } from "../Hangar/WarMachinesHangar/WarMachineHangarItem/MechThumbnail"

interface MechDeployListItemProps {
    mech: MechBasic
}

export const MechDeployListItem = ({ mech }: MechDeployListItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])
    const [mechState, setMechState] = useState<MechStatusEnum>()

    // Get addition mech data
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: mech.id,
                })
                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [mech.id, send])

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mech.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || mechState === MechStatusEnum.Sold) return
            setMechState(payload.status)
        },
    )

    return (
        <Stack
            direction="row"
            spacing="1.5rem"
            alignItems="flex-start"
            sx={{
                position: "relative",
                py: ".7rem",
                px: ".5rem",
            }}
        >
            <Stack sx={{ height: "8rem" }}>
                <MechThumbnail mech={mech} mechDetails={mechDetails} smallSize />
            </Stack>

            <Stack alignItems="flex-start" sx={{ py: ".2rem" }}>
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

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <MechGeneralStatus mechID={mech.id} smallSize />

                    {(mechState === MechStatusEnum.Idle || mechState === MechStatusEnum.Queue) && (
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "5px",
                                backgroundColor: mechState === MechStatusEnum.Idle ? colors.green : theme.factionTheme.background,
                                opacity: 1,
                                border: {
                                    isFancy: true,
                                    borderColor: mechState === MechStatusEnum.Idle ? colors.green : colors.yellow,
                                    borderThickness: "1px",
                                },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1.6rem", pt: 0, pb: ".1rem", color: theme.factionTheme.primary }}
                            // onClick={onClick}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: mechState === MechStatusEnum.Idle ? "#FFFFFF" : colors.yellow,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                {mechState === MechStatusEnum.Idle ? "DEPLOY" : "UNDEPLOY"}
                            </Typography>
                        </FancyButton>
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}
