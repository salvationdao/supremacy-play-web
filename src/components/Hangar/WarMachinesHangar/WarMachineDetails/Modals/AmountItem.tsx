import { Box, Stack, Typography } from "@mui/material"
import { NiceTooltip } from "../../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../../assets"
import { colors, fonts } from "../../../../../theme/theme"

export interface QueueFeed {
    queue_position: number
    queue_cost: string
}

export const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color?: string
    value: string | number
    tooltip?: string
    disableIcon?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ mr: ".4rem", fontFamily: fonts.nostromoHeavy }}>
                {title}
            </Typography>

            {!disableIcon && <SvgSupToken size="1.8rem" fill={colors.yellow} sx={{ mr: ".1rem", pb: ".4rem" }} />}

            <Typography variant="body1" sx={{ mr: "3.2rem", color: color || colors.offWhite, fontWeight: "bold" }}>
                {value || "---"}
            </Typography>

            {tooltip && (
                <NiceTooltip placement="right-start" text={tooltip}>
                    <Box sx={{ ml: "auto" }}>
                        <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                    </Box>
                </NiceTooltip>
            )}
        </Stack>
    )
}
