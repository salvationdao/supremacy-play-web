import { keyframes } from "@emotion/react"

export const zoomEffect = (scale = 1.5) => keyframes`
	0% { transform: scale(1); }
	25% { transform: scale(${scale}); }
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

export const overlayPulseEffect = keyframes`
   	0% { filter: grayscale(0); }
	25% { filter: grayscale(1); }
	75% { filter: grayscale(1); }
	100% { filter: grayscale(0); }
`

export const spinEffect = keyframes`
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
`

export const scaleUpKeyframes = keyframes({
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
})

export const heightEffect = (to = 100) => keyframes`
	0% { height: 0; }
	100% { height: ${to}%; }
`

export const shake = keyframes`
	10%, 90% {
		transform: translate3d(-1px, 0, 0);
	}

	20%, 80% {
		transform: translate3d(2px, 0, 0);
	}

	30%, 50%, 70% {
		transform: translate3d(-3px, 0, 0);
	}

	40%, 60% {
		transform: translate3d(3px, 0, 0);
	}
`

export const rippleEffect = (color: string) => keyframes`
	0% {
		box-shadow: inset 0 0 26px 130px ${color}80;
	}

	100% {
		box-shadow: inset 0 0 26px 0 ${color}10;
	}
`
