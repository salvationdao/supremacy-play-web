import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { zoomEffect } from "../../../theme/keyframes"

interface SupsStackBarProps {
    currentSups: BigNumber
    colour: string
    supsCost: BigNumber
}

export const SupsBar = ({ currentSups, colour, supsCost }: SupsStackBarProps) => (
    <Stack direction="row" alignItems="center" justifyContent="center">
        <Typography
            key={`currentSups-${currentSups.toFixed()}`}
            variant="body2"
            style={{
                lineHeight: 1,
                color: `${colour} !important`,
                animation: `${zoomEffect(1.2)} 300ms ease-out`,
            }}
        >
            {currentSups.toFixed(2)}
        </Typography>
        <Typography variant="body2" style={{ lineHeight: 1, color: `${colour} !important` }}>
            &nbsp;/&nbsp;
        </Typography>
        <Typography
            key={`supsCost-${supsCost.toFixed()}`}
            variant="body2"
            style={{
                lineHeight: 1,
                color: `${colour} !important`,
                animation: `${zoomEffect(1.2)} 300ms ease-out`,
            }}
        >
            {supsCost.toFixed(2)}
        </Typography>
        <Typography variant="body2" style={{ lineHeight: 1, color: `${colour} !important` }}>
            &nbsp;SUP{supsCost.eq(1) ? "" : "S"}
        </Typography>
    </Stack>
)
