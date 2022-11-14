import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useHistory } from "react-router-dom"
import { getMechStatusDeets, getRarityDeets } from "../../../../../helpers"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecured } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { MechBasic, MechDetails, MechStatus, MechStatusEnum } from "../../../../../types"
import { RepairStatus } from "../../../../../types/jobs"
import { NiceBoxThing } from "../../../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import { MechRepairBlocks } from "../../Common/MechRepairBlocks"

export interface MechPickerItemProps {
    initialData: MechBasic
    onPick: () => void
}

export const MechPickerItem = ({ initialData, onPick }: MechPickerItemProps) => {
    const history = useHistory()

    const [mech, setMech] = useState<MechDetails>()
    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${initialData.id}/details`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMech(payload)
        },
    )

    const [mechStatus, setMechStatus] = useState<MechStatus>()
    const statusDeets = useMemo(() => getMechStatusDeets(mechStatus?.status), [mechStatus])
    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${initialData.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || payload.status === MechStatusEnum.Sold) return
            setMechStatus(payload)
        },
    )

    useGameServerSubscriptionSecured<RepairStatus>(
        {
            URI: `/mech/${initialData.id}/repair_case`,
            key: GameServerKeys.SubMechRepairStatus,
        },
        (payload) => {
            if (!payload) return
        },
    )

    return (
        <NiceButton
            onClick={() => {
                onPick()
                history.push(`/mech/${mech?.id || initialData.id}`)
            }}
            border={{
                thickness: "very-lean",
                color: `${colors.lightGrey}66`,
            }}
            background={{
                colors: [colors.lightGrey],
                opacity: 0.4,
            }}
            sx={{
                p: "1rem",
                alignItems: "start",
                justifyContent: "start",
                textAlign: "left",
            }}
        >
            <NiceBoxThing
                border={{
                    color: getRarityDeets(mech?.tier || initialData.tier).color,
                    thickness: "lean",
                }}
                caret={{
                    position: "bottom-right",
                }}
                sx={{
                    width: 70,
                    height: 70,
                }}
            >
                <Box
                    component="img"
                    src={mech?.avatar_url || mech?.image_url || initialData.avatar_url || initialData.image_url}
                    alt={`${mech?.label || initialData.label} mech avatar`}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </NiceBoxThing>
            <Stack
                ml="1rem"
                flex={1}
                sx={{
                    flex: 1,
                    ml: "1rem",
                    alignItems: "start",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBold,
                        color: mech?.name || initialData.name ? "white" : colors.grey,
                    }}
                >
                    {mech?.name || initialData.name || "UNNAMED"}
                </Typography>
                <Typography>{mech?.label || initialData.label}</Typography>
                <Stack direction="row" spacing="1rem" justifyContent="space-between" width="100%" alignItems="center">
                    <Box
                        sx={{
                            p: ".5rem",
                            backgroundColor: `${statusDeets.color}44`,
                        }}
                    >
                        {statusDeets.label}
                    </Box>
                    <Box maxWidth={80}>
                        <MechRepairBlocks mechID={initialData.id} defaultBlocks={mech?.repair_blocks} size={8} />
                    </Box>
                </Stack>
            </Stack>
        </NiceButton>
    )
}
