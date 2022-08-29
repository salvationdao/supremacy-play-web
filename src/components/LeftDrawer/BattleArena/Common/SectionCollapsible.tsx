import { Box, Collapse, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SvgDropdownArrow, SvgInfoCircular } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { FancyButton } from "../../../Common/FancyButton"
import { TooltipHelper } from "../../../Common/TooltipHelper"

export const SectionCollapsible = ({
    label,
    tooltip,
    children,
    initialExpanded,
}: {
    label: string | ReactNode
    tooltip?: string
    children: ReactNode
    initialExpanded?: boolean
}) => {
    const theme = useTheme()
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded)

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Box sx={{ my: isExpanded ? "1rem" : ".5rem" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "0px",
                    clipSlantSize: "0px",
                    border: {
                        borderColor: primaryColor,
                        borderThickness: ".25rem",
                    },
                    corners: {},
                    backgroundColor: primaryColor,
                    opacity: isExpanded ? 0.8 : 0.2,
                    sx: { position: "relative" },
                }}
                sx={{ p: 0, color: "#FFFFFF" }}
                onClick={() => toggleIsExpanded()}
            >
                <Stack direction="row" alignItems="center" sx={{ height: "100%", pl: "1.8rem", pr: "1.4rem", pt: ".5rem", pb: ".4rem" }}>
                    <SvgDropdownArrow
                        size="1.3rem"
                        fill={isExpanded ? secondaryColor : "#FFFFFF"}
                        sx={{ mr: ".9rem", transform: isExpanded ? "scaleY(-1) translateY(1px)" : "unset" }}
                    />

                    <Typography variant="body2" sx={{ color: isExpanded ? secondaryColor : "#FFFFFF", fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>

                    {tooltip && (
                        <TooltipHelper text={tooltip} placement="right">
                            <Box
                                sx={{
                                    ml: "auto",
                                    opacity: 0.4,
                                    ":hover": { opacity: 1 },
                                }}
                            >
                                <SvgInfoCircular fill={theme.factionTheme.secondary} size="1.5rem" />
                            </Box>
                        </TooltipHelper>
                    )}
                </Stack>
            </FancyButton>

            <Collapse in={isExpanded}>
                <Box
                    sx={{
                        p: "1.5rem 1.1rem",
                        backgroundColor: "#FFFFFF12",
                        boxShadow: 2,
                        border: "#FFFFFF20 1px solid",
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    )
}
