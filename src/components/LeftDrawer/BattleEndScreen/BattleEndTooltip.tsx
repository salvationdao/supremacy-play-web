import { Box } from "@mui/material"
import { SvgInfoIcon } from "../../../assets"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"

export const BattleEndTooltip = ({ text, color }: { text: string; color?: string }) => {
    return (
        <NiceTooltip color={color} text={text} placement="right-start">
            <Box sx={{ position: "absolute", top: "-.4rem", right: "-1.1rem", opacity: 0.6, ":hover": { opacity: 1 } }}>
                <SvgInfoIcon fill={color} size="1rem" />
            </Box>
        </NiceTooltip>
    )
}
