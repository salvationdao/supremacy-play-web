import { Box, Collapse, Stack, Typography } from "@mui/material"
import { ReactNode, useEffect } from "react"
import { SvgDropdownArrow } from "../../../assets"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { FancyButton } from "../FancyButton"

export const Section = ({
    label,
    primaryColor,
    secondaryColor,
    children,
    endComponent,
    initialExpanded,
}: {
    label: string
    primaryColor: string
    secondaryColor: string
    children: ReactNode
    endComponent?: ReactNode
    initialExpanded?: boolean
}) => {
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded || !!endComponent)

    useEffect(() => {
        if (endComponent) toggleIsExpanded(true)
    }, [endComponent, toggleIsExpanded])

    return (
        <Box>
            <FancyButton
                clipThingsProps={{
                    clipSize: "10px",
                    border: {
                        isFancy: isExpanded,
                        borderColor: primaryColor,
                        borderThickness: ".25rem",
                    },
                    corners: { topRight: isExpanded },
                    backgroundColor: primaryColor,
                    opacity: isExpanded ? 0.8 : 0.1,
                    sx: { position: "relative" },
                }}
                sx={{ p: 0, color: "#FFFFFF" }}
                onClick={() => toggleIsExpanded()}
            >
                <Stack direction="row" alignItems="center" sx={{ height: "100%", pl: "1.8rem", pr: "1.4rem", pt: ".5rem", pb: ".4rem" }}>
                    <SvgDropdownArrow
                        size="1.3rem"
                        fill={isExpanded ? secondaryColor : "#FFFFFF"}
                        sx={{ mr: ".6rem", transform: isExpanded ? "scaleY(-1) translateY(2px)" : "unset" }}
                    />
                    <Typography variant="caption" sx={{ color: isExpanded ? secondaryColor : "#FFFFFF", fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>

                    <Box onClick={(e) => e.stopPropagation()} sx={{ ml: "auto" }}>
                        {endComponent}
                    </Box>
                </Stack>
            </FancyButton>

            <Collapse in={isExpanded}>
                <Box sx={{ px: "2rem", pt: "1.4rem", pb: "1.8rem" }}>{children}</Box>
            </Collapse>
        </Box>
    )
}
