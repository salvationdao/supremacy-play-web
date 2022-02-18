import { Box, Tooltip, Typography } from '@mui/material'
import { SvgInfoIcon } from '../../assets'

export const BattleEndTooltip = ({ text, color }: { text: string; color: string }) => {
    return (
        <Tooltip
            title={
                <Box>
                    <Typography variant="body1">{text}</Typography>
                </Box>
            }
            arrow
            placement="right-start"
            componentsProps={{
                popper: { style: { filter: 'drop-shadow(0 3px 3px #00000050)' } },
                arrow: { sx: { color: '#333333' } },
                tooltip: { sx: { maxWidth: 250, background: '#333333' } },
            }}
        >
            <Box sx={{ position: 'absolute', top: 4, right: -11, opacity: 0.6, ':hover': { opacity: 1 } }}>
                <SvgInfoIcon fill={color} size="10px" />
            </Box>
        </Tooltip>
    )
}
