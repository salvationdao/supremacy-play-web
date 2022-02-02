import { Box, Stack, Typography } from '@mui/material'
import { SvgMapWarMachine } from '../../assets'
import { Map, WarMachineState } from '../../types'

export const MapWarMachine = ({ warMachine, map }: { warMachine: WarMachineState; map: Map }) => {
    const { tokenID, faction, name, health, position, rotation } = warMachine

    if (!position) return null

    const primaryColor = faction && faction.theme ? faction.theme.primary : '#FFFFFF'

    return (
        <Stack
            key={`warMachine-${tokenID}`}
            alignItems="center"
            justifyContent="center"
            sx={{
                position: 'absolute',
                pointerEvents: 'none',
                opacity: health <= 0 ? '0.2' : 'unset',
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left) * map.scale}px, ${
                    (position.y - map.top) * map.scale
                }px, 0)`,
                transition: 'transform 0.2s linear',
                zIndex: 5,
            }}
        >
            <Box
                sx={{
                    transform: `rotate3d(0, 0, 1, ${-rotation + 90}deg)`,
                    transition: 'transform 0.2s linear',
                }}
            >
                <SvgMapWarMachine fill={primaryColor} size="17px" />
            </Box>
            <Typography sx={{ mt: 0.4, color: primaryColor, opacity: health <= 0 ? '0.2' : 'unset' }}>
                {name}
            </Typography>
        </Stack>
    )
}
