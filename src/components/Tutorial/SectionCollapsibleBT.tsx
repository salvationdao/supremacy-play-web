import { Box, Collapse, Stack, Typography, useTheme } from "@mui/material"
import { ReactNode } from "react"
import { SvgDropdownArrow, SvgInfoCircular } from "../../assets"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"
import { FancyButton } from "../Common/Deprecated/FancyButton"
import { NiceTooltip } from "../Common/Nice/NiceTooltip"

export const SectionCollapsibleBT = ({
    label,
    tooltip,
    children,
}: {
    label: string | ReactNode
    tooltip?: string
    children: ReactNode
    initialExpanded?: boolean
    localStoragePrefix: string
}) => {
    const theme = useTheme()
    const [isExpanded, toggleIsExpanded] = useToggle(true)

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
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ height: "100%", pl: "1.8rem", pr: "1.4rem", pt: ".5rem", pb: ".4rem", svg: { fill: isExpanded ? secondaryColor : "#FFFFFF" } }}
                >
                    <SvgDropdownArrow
                        size="1.3rem"
                        fill={isExpanded ? secondaryColor : "#FFFFFF"}
                        sx={{ mr: ".9rem", transform: isExpanded ? "scaleY(-1) translateY(1px)" : "unset" }}
                    />

                    <Typography variant="body2" sx={{ color: isExpanded ? secondaryColor : "#FFFFFF", fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>

                    {tooltip && (
                        <NiceTooltip text={tooltip} placement="right">
                            <Box
                                sx={{
                                    ml: "auto",
                                    opacity: 0.4,
                                    ":hover": { opacity: 1 },
                                }}
                            >
                                <SvgInfoCircular fill={isExpanded ? secondaryColor : "#FFFFFF"} size="1.5rem" />
                            </Box>
                        </NiceTooltip>
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
