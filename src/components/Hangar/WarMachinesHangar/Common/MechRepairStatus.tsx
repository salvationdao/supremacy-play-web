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
            flexWrap="wrap"
            sx={{
                width: "100%",
                "& > div": {
                    p: "1.5px",
                    ".single-block": {
                        height: "8px",
                        width: "8px",
                        backgroundColor: repairStatus?.blocks_default ? colors.green : "#FFFFFF35",
                    },
                },
                [`& > div:nth-last-child(-n+${remainDamagedBlocks})`]: {
                    ".single-block": {
                        backgroundColor: colors.red,
                    },
                },
            }}
        >
            {new Array(repairStatus?.blocks_default || 18).fill(0).map((_, index) => (
                <div key={index}>
                    <div className="single-block" />
                </div>
            ))}
        </Stack>
    )
}
