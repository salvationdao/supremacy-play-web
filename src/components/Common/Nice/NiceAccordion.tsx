import { ArrowRight } from "@mui/icons-material"
import { Box, styled, Typography, useTheme } from "@mui/material"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails"
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary"
import { useCallback, useState } from "react"
import { fonts } from "../../../theme/theme"

export interface NiceAccordionProps {
    items: {
        id: string | number
        header: string | React.ReactNode
        content: React.ReactNode
    }[]
    expandID?: string | number
}

export const NiceAccordion = ({ items, expandID }: NiceAccordionProps) => {
    const [expanded, setExpanded] = useState(expandID)
    const theme = useTheme()

    const handleChange = useCallback((id: string | number) => {
        setExpanded(id)
    }, [])

    return (
        <Box>
            {items.map((item) => (
                <Accordion key={item.id} expanded={item.id === expanded} onChange={() => handleChange(item.id)} borderColor={theme.factionTheme.primary}>
                    <AccordionSummary aria-controls={`${item.id}-content`} id={`${item.id}-header`} backgroundColor={theme.factionTheme.primary}>
                        {typeof item.header === "string" ? (
                            <Typography
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                {item.header}
                            </Typography>
                        ) : (
                            item.header
                        )}
                    </AccordionSummary>
                    <AccordionDetails backgroundColor={theme.factionTheme.background}>{item.content}</AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )
}

interface MyAccordionProps extends AccordionProps {
    borderColor: string
}

const Accordion = styled(({ borderColor, sx, ...props }: MyAccordionProps) => (
    <MuiAccordion
        disableGutters
        elevation={0}
        square
        sx={{
            border: `2px solid ${borderColor}`,
            "&:not(:last-child)": {
                borderBottom: 0,
            },
            "&:before": {
                display: "none",
            },
            ...sx,
        }}
        {...props}
    />
))({})

interface MyAccordionSummaryProps extends AccordionSummaryProps {
    backgroundColor: string
}
const AccordionSummary = styled(({ backgroundColor, sx, ...props }: MyAccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowRight sx={{ fontSize: "4rem" }} />}
        sx={{
            backgroundColor,
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(90deg)",
            },
            "& .MuiAccordionSummary-content": {
                marginLeft: "1rem",
            },
            ...sx,
        }}
        {...props}
    />
))({})

interface MyAccordionDetailsProps extends AccordionDetailsProps {
    backgroundColor: string
}
const AccordionDetails = styled(({ backgroundColor, sx, ...props }: MyAccordionDetailsProps) => (
    <MuiAccordionDetails
        sx={{
            padding: "2rem",
            backgroundColor,
            borderTop: "1px solid rgba(0, 0, 0, .125)",
            ...sx,
        }}
        {...props}
    />
))({})
