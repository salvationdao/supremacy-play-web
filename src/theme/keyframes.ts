import { keyframes } from '@emotion/react'

export const zoomEffect = keyframes`
	0% { transform: scale(1); }
	30% { transform: scale(1.5); }
	100% { transform: scale(1); }
`

export const pulseEffect = keyframes`
	50% { opacity: 1; }
	70% { opacity: 0; }
	90% { opacity: 1; }
`
