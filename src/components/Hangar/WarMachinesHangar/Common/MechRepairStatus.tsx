import { Stack } from "@mui/material"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"

interface RepairStatus {
    blocks_default: number
    blocks_required_repair: number
    blocks_repaired: number
}

export const MechRepairStatus = ({ mechID }: { mechID?: string }) => {
    const repairStatus = useGameServerSubscription<RepairStatus>({
        URI: `/public/mech/${mechID}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
    })

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0

    return (
        <Stack
            direction="row"
            spacing="3px"
            sx={{
                pt: ".1rem",
                height: "10px",
                width: "100%",
                maxWidth: "30rem",
                "& > div": {
                    flex: 1,
                    height: "100%",
                    backgroundColor: repairStatus?.blocks_default ? colors.green : "#FFFFFF35",
                },
                [`& > div:nth-last-child(-n+${remainDamagedBlocks})`]: {
                    backgroundColor: colors.red,
                },
            }}
        >
            {new Array(repairStatus?.blocks_default || 24).fill(0).map((_, index) => (
                <div key={index} />
            ))}
        </Stack>
    )
}
