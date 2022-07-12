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
    const [isCollapsed, toggleIsCollapsed] = useToggle(initialExpanded || !!endComponent)

    useEffect(() => {
        if (endComponent) toggleIsCollapsed(true)
    }, [endComponent, toggleIsCollapsed])

    return (
        <Box>
            <FancyButton
                clipThingsProps={{
                    clipSize: "10px",
                    border: {
                        isFancy: isCollapsed,
                        borderColor: primaryColor,
                        borderThickness: ".25rem",
                    },
                    corners: { topRight: isCollapsed },
                    backgroundColor: primaryColor,
                    opacity: 0.8,
                    sx: { position: "relative" },
                }}
                sx={{ p: 0, color: "#FFFFFF" }}
                onClick={() => toggleIsCollapsed()}
            >
                <Stack direction="row" alignItems="center" sx={{ height: "100%", pl: "1.8rem", pr: "1.4rem", pt: ".7rem", pb: ".6rem" }}>
                    <SvgDropdownArrow size="1.3rem" sx={{ mr: ".5rem", transform: isCollapsed ? "scaleY(-1) translateY(2px)" : "unset" }} />
                    <Typography variant="caption" sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>

                    <Box sx={{ ml: "auto" }}>{endComponent}</Box>
                </Stack>
            </FancyButton>

            <Collapse in={isCollapsed}>
                <Box sx={{ px: "2rem", pt: "1.4rem", pb: "1.8rem" }}>{children}</Box>
            </Collapse>
        </Box>
    )
}
