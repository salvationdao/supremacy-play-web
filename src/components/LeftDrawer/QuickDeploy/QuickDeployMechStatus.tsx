import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { colors, fonts } from "../../../theme/theme"
import { MechBasicWithQueueStatus, MechStatusEnum } from "../../../types"

export const QuickDeployMechStatus = ({ mech }: { mech: MechBasicWithQueueStatus }) => {
    const color = useMemo(() => {
        switch (mech.status) {
            case MechStatusEnum.Idle:
                return colors.green
            case MechStatusEnum.Queue:
                return colors.yellow
            case MechStatusEnum.Battle:
                return colors.orange
            case MechStatusEnum.Market:
                return colors.red
            case MechStatusEnum.Sold:
                return colors.lightGrey
            case MechStatusEnum.Damaged:
                return colors.bronze
            default:
                return colors.lightGrey
        }
    }, [mech.status])

    return (
        <>
            <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ flexShrink: 0 }}>
                <Stack
                    spacing=".8rem"
                    sx={{
                        position: "relative",
                        p: ".4rem 1rem",
                        backgroundColor: `${color}25`,
                        border: `${color} 1.5px dashed`,
                    }}
                >
                    <Typography variant={"caption"} sx={{ lineHeight: 1, color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        {mech.status}
                    </Typography>
                </Stack>
            </Stack>
        </>
    )
}
