import { Stack, Typography } from "@mui/material"
import React from "react"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairStatus } from "../../../../types/jobs"

export const RepairBlocks = ({
    defaultBlocks,
    remainDamagedBlocks,
    hideNumber,
    size = 8,
}: {
    defaultBlocks?: number
    remainDamagedBlocks: number
    hideNumber?: boolean
    size?: number
}) => {
    return (
        <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ width: "100%" }}>
            <Stack
                direction="row"
                flexWrap="wrap"
                sx={{
                    "& > div": {
                        p: `${size * 0.1875}px`,
                        ".single-block": {
                            height: `${size}px`,
                            width: `${size}px`,
                            backgroundColor: defaultBlocks ? colors.red : "#FFFFFF35",
                        },
                    },
                    [`& > div:nth-child(-n+${defaultBlocks ? defaultBlocks - remainDamagedBlocks : 0})`]: {
                        ".single-block": {
                            backgroundColor: colors.green,
                        },
                    },
                }}
            >
                {new Array(defaultBlocks || remainDamagedBlocks).fill(0).map((_, index) => (
                    <div key={index}>
                        <div className="single-block" />
                    </div>
                ))}

                {!hideNumber && defaultBlocks && remainDamagedBlocks > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            ml: ".5rem",
                            pt: ".8px",
                            lineHeight: 1,
                            fontFamily: fonts.nostromoBlack,
                            color: remainDamagedBlocks > 0 ? colors.red : colors.green,
                        }}
                    >
                        {remainDamagedBlocks || defaultBlocks}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}

export const MechRepairBlocks = React.memo(function MechRepairBlocks({
    mechID,
    defaultBlocks,
    hideNumber,
}: {
    mechID?: string
    defaultBlocks?: number
    hideNumber?: boolean
}) {
    const repairStatus = useGameServerSubscription<RepairStatus>({
        URI: `/public/mech/${mechID}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
    })

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0

    return <RepairBlocks defaultBlocks={defaultBlocks} remainDamagedBlocks={remainDamagedBlocks} hideNumber={hideNumber} />
})
