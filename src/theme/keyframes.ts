import { keyframes } from '@emotion/react'

export const zoomEffect = (scale = 1.5) => keyframes`
	0% { transform: scale(1); }
	30% { transform: scale(${scale}); }
	100% { transform: scale(1); }
`

export const pulseEffect = keyframes`
	50% { opacity: 1; }
	70% { opacity: 0; }
	90% { opacity: 1; }
`

export const opacityEffect = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`
