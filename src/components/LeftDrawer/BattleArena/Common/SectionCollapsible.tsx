import { Box, Collapse, Stack, Typography } from "@mui/material"
import { ReactNode, useEffect } from "react"
import { SvgDropdownArrow, SvgInfoCircular } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"

export const SectionCollapsible = ({
    label,
    tooltip,
    children,
    initialExpanded,
    localStoragePrefix,
}: {
    label: string | ReactNode
    tooltip?: string
    children: ReactNode
    initialExpanded?: boolean
    localStoragePrefix: string
}) => {
    const theme = useTheme()
    const [isExpanded, toggleIsExpanded] = useToggle(
        (localStorage.getItem(`${localStoragePrefix}-section-collapsible`) || initialExpanded?.toString()) === "true",
    )

    const primaryColor = theme.factionTheme.s500
    const secondaryColor = theme.factionTheme.text

    useEffect(() => {
        localStorage.setItem(`${localStoragePrefix}-section-collapsible`, isExpanded.toString())
    }, [isExpanded, localStoragePrefix])

    return (
        <Box sx={{ my: isExpanded ? "1rem" : ".5rem" }}>
            <NiceButton
                fill={isExpanded}
                buttonColor={primaryColor}
                sx={{
                    position: "relative",
                    p: 0,
                    width: "100%",
                    m: 0,
                }}
                onClick={() => toggleIsExpanded()}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        p: ".9rem 1.4rem",
                        width: "100%",
                    }}
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
                                <SvgInfoCircular fill={theme.factionTheme.text} size="1.5rem" />
                            </Box>
                        </NiceTooltip>
                    )}
                </Stack>
            </NiceButton>

            <Collapse in={isExpanded}>
                <Box
                    sx={{
                        position: "relative",
                        p: "1.5rem 1.1rem",
                        backgroundColor: "#FFFFFF08",
                        boxShadow: 2,
                        border: "#FFFFFF20 1px solid",
                        borderTop: "none",
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    )
}
