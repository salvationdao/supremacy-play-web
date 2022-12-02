import { Box, Collapse, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SvgDropdownArrow } from "../../../assets"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { NiceButton } from "../Nice/NiceButton"

export const Section = ({ label, children, initialExpanded }: { label: string; children: ReactNode; initialExpanded?: boolean }) => {
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded)

    return (
        <Box>
            {/* Heading, clickable to expand or collapse section */}
            <NiceButton
                onClick={() => toggleIsExpanded()}
                sx={{
                    width: "100%",
                    p: "1rem 2rem",
                    opacity: isExpanded ? 1 : 0.4,
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flex: 1 }}>
                    <Typography fontFamily={fonts.nostromoBlack}>{label}</Typography>
                    <SvgDropdownArrow size="1.8rem" sx={{ transform: isExpanded ? "scaleY(-1) translateY(2px)" : "unset" }} />
                </Stack>
            </NiceButton>

            {/* Content */}
            <Collapse in={isExpanded}>
                <Box>{children}</Box>
            </Collapse>
        </Box>
    )
}
