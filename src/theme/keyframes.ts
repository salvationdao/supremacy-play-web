import { keyframes } from "@emotion/react"
import { colors } from "./theme"

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

export const rippleEffect = (color: string) => keyframes`
	0% {
		background-color: #00000010;
		transform: scale(1);
		box-shadow: inset 0 0 26px 130px ${color}80;
	}

	80% {
		transform: scale(1.1);
	}

	100% {
		background-color: #00000010;
		transform: scale(1);
		box-shadow: inset 0 0 26px 0 ${color}65;
	}
`

export const explosionEffect = (color: string) => keyframes`
	0% {
		background-color: #00000010;
		transform: scale(0);
		box-shadow: inset 0 0 26px 130px ${color}80;
		opacity: 0.5;
		border-color: ${color}80;
	}

	20% {
		transform: scale(1);
		opacity: 0.65;
	}
	
	30% {
		opacity: 0.5;
	}
	
	80% {
	    box-shadow: inset 0 0 26px 0 ${color}65;
	    opacity: 0.5;
	    border-color: ${color}80;
	}

	100% {
		transform: scale(1);
		box-shadow: inset 0 0 26px 0 ${color}00;
		opacity: 0;
		border-color: ${color}00;
	}
`

export const fadeEffect = () => keyframes`
	0% { opacity: 1; }
	100% { opacity: 0; }
`

export const dropEffect = (scale = 1.5) => keyframes`
	0% { transform: scale(${scale}); }
	100% { transform: scale(1); }
`

export const landmineEffect = (defaultImage: string, backgroundImageUrl: string) => keyframes`
	0% { background-image: url(${defaultImage}); }
	99% { background-image: url(${defaultImage}); }
	100% { background-image: url(${backgroundImageUrl}); }
`

export const shake = (intensity = 1) => keyframes`
10%, 90% {
	transform: translate3d(calc(-1px * ${intensity}), 0, 0);
}

20%, 80% {
	transform: translate3d(calc(2px * ${intensity}), 0, 0);
}

30%, 50%, 70% {
	transform: translate3d(calc(-3px * ${intensity}), 0, 0);
}

40%, 60% {
	transform: translate3d(calc(3px * ${intensity}), 0, 0);
}
`

export const glowEffect = (color: string, all?: boolean) => keyframes`
	0% {
		box-shadow: inset 0 0 ${all ? "20px" : "5px"} ${all ? "20px" : "5px"} ${color};
	}

	50% {
		box-shadow: inset 0 0 0px 0px ${color};
	}

	100% {
		box-shadow: inset 0 0 ${all ? "20px" : "5px"} ${all ? "20px" : "5px"}  ${color};
	}
`

export const dropShadowEffect = keyframes`
	0% {
			filter: drop-shadow(0 0 0 ${colors.neonBlue});
	}

	25% {
		filter: drop-shadow(0 0 20px ${colors.neonBlue});
	}

	100% {
				filter: drop-shadow(0 0 0 ${colors.neonBlue});
	}
`
