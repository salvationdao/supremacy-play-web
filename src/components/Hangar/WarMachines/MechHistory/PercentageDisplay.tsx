import { keyframes } from "@emotion/react"
import { Box, Skeleton, Stack, styled, Typography } from "@mui/material"
import { colors, fonts } from "../../../../theme/theme"

interface PercentageDisplayProps {
    displayValue: string
    percentage: number
    label: string
    circleSize?: number
    size?: number
    color?: string
}

export const PercentageDisplay = ({ displayValue, percentage, label, circleSize, size, color }: PercentageDisplayProps) => {
    const radius = circleSize ? circleSize / (2 * 1.11) : 20
    const circumference = Math.PI * 2 * radius
    return (
        <Stack alignItems="center" spacing=".2rem" sx={{ width: size }}>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 1.11 * radius * 2,
                    minHeight: 1.11 * radius * 2,
                    mb: ".5rem",
                }}
            >
                <StyledSVG
                    width={1.11 * radius * 2}
                    height={1.11 * radius * 2}
                    sx={{
                        transform: "rotate(-90deg)",
                    }}
                >
                    <StyledCircle
                        r={1.11 * radius}
                        cx={1.11 * radius}
                        cy={1.11 * radius}
                        sx={{
                            fill: color ? `${color}65` : `${colors.neonBlue}65`,
                        }}
                    />
                    <StyledCircle
                        r={radius}
                        cx={1.11 * radius}
                        cy={1.11 * radius}
                        sx={{
                            fill: colors.darkNavy,
                            stroke: color || colors.neonBlue,
                            strokeDasharray: `${(circumference * percentage) / 100} ${circumference}`,
                            strokeWidth: 0.22 * radius,
                            transition: "stroke-dasharray .2s ease-out",
                            animation: `${generateStrokeKeyframes(percentage, circumference)} 1.5s ease-out`,
                        }}
                    />
                </StyledSVG>
                <Typography
                    variant="body2"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        fontFamily: fonts.nostromoBold,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {displayValue}
                </Typography>
            </Box>
            <Typography
                variant="caption"
                textAlign="center"
                sx={{
                    lineHeight: 1.2,
                    fontSize: "1.1rem",
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>
        </Stack>
    )
}

const StyledSVG = styled("svg")({})

const StyledCircle = styled("circle")({})

const generateStrokeKeyframes = (percentage: number, circumference: number) => {
    return keyframes`
	0% {
	  stroke-dasharray: 0;
	}
	100% {
		stroke-dasharray: ${(circumference * percentage) / 100} ${circumference};
	}
  `
}

export interface PercentageDisplaySkeletonProps {
    circleSize?: number
}

export const PercentageDisplaySkeleton = ({ circleSize }: PercentageDisplaySkeletonProps) => {
    const radius = circleSize ? circleSize / (2 * 1.11) : 20
    return <Skeleton variant="circular" width={1.11 * radius * 2} height={1.11 * radius * 2} />
}
