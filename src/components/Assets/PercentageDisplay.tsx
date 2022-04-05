import { keyframes } from "@emotion/react"
import { Box, Skeleton, styled, Typography } from "@mui/material"
import React from "react"
import { colors } from "../../theme/theme"

interface PercentageDisplayProps {
    displayValue: string
    percentage: number
    label: string
    size?: number
    color?: string
}

export const PercentageDisplay = ({ displayValue, percentage, label, size, color }: PercentageDisplayProps) => {
    const radius = size ? size / (2 * 1.11) : 20
    const circumference = Math.PI * 2 * radius
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 1.11 * radius * 2,
                    minHeight: 1.11 * radius * 2,
                    marginBottom: ".5rem",
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
                            fill: colors.darkerNavy,
                            stroke: color || colors.neonBlue,
                            strokeDasharray: `${(circumference * percentage) / 100} ${circumference}`,
                            strokeWidth: 0.22 * radius,
                            transition: "stroke-dasharray .2s ease-out",
                            animation: `${generateStrokeKeyframes(percentage, circumference)} 1.5s ease-out`,
                        }}
                    />
                </StyledSVG>
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {displayValue}
                </Typography>
            </Box>
            <Typography variant="caption" textAlign="center">
                {label}
            </Typography>
        </Box>
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
    size?: number
}

export const PercentageDisplaySkeleton = ({ size }: PercentageDisplaySkeletonProps) => {
    const radius = size ? size / (2 * 1.11) : 20

    return <Skeleton variant="circular" width={1.11 * radius * 2} height={1.11 * radius * 2} />
}
