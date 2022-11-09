import { ArrowRight } from "@mui/icons-material"
import { styled, Typography, useTheme } from "@mui/material"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails"
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary"
import { useState } from "react"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

export interface NiceAccordionProps extends Omit<NiceBoxThingProps, "children"> {
    items: {
        id: string | number
        header: string | React.ReactNode
        content: React.ReactNode
    }[]
    expandID?: string | number
}

export const NiceAccordion = ({ items, expandID, ...props }: NiceAccordionProps) => {
    const [expanded, setExpanded] = useState(expandID)
    const theme = useTheme()

    return (
        <NiceBoxThing
            border={{
                color: theme.factionTheme.primary,
                thickness: "thicc",
            }}
            background={{
                color: [theme.factionTheme.background],
            }}
            {...props}
        >
            {items.map((item) => (
                <Accordion key={item.id} expanded={item.id === expanded} onChange={() => setExpanded(item.id)}>
                    <AccordionSummary
                        aria-controls={`${item.id}-content`}
                        id={`${item.id}-header`}
                        backgroundColor={item.id === expanded ? theme.factionTheme.primary : theme.factionTheme.background}
                    >
                        {item.header}
                    </AccordionSummary>
                    <AccordionDetails>{item.content}</AccordionDetails>
                </Accordion>
            ))}
        </NiceBoxThing>
    )
}

interface MyAccordionProps extends AccordionProps {
    borderColor?: string
}

const Accordion = styled(({ borderColor, sx, ...props }: MyAccordionProps) => {
    const theme = useTheme()

    return (
        <MuiAccordion
            disableGutters
            elevation={0}
            square
            sx={{
                "&:not(:last-child)": {
                    borderBottom: borderColor ? `2px solid ${borderColor}` : `2px solid ${theme.factionTheme.primary}`,
                },
                "&:before": {
                    display: "none",
                },
                ...sx,
            }}
            {...props}
        />
    )
})({})
NiceAccordion.Base = Accordion

interface MyAccordionSummaryProps extends AccordionSummaryProps {
    backgroundColor?: string
}
const AccordionSummary = styled(({ backgroundColor, sx, children, ...props }: MyAccordionSummaryProps) => {
    const theme = useTheme()

    return (
        <MuiAccordionSummary
            expandIcon={<ArrowRight sx={{ fontSize: "4rem" }} />}
            sx={{
                px: "0",
                backgroundColor: backgroundColor || theme.factionTheme.primary,
                transition: "background-color .2s ease-out",
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                },
                "& .MuiAccordionSummary-content": {
                    marginLeft: "1rem",
                },
                ...sx,
            }}
            {...props}
        >
            {typeof children === "string" ? (
                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {children}
                </Typography>
            ) : (
                children
            )}
        </MuiAccordionSummary>
    )
})({})
NiceAccordion.Summary = AccordionSummary

interface MyAccordionDetailsProps extends AccordionDetailsProps {
    backgroundColor?: string
}
const AccordionDetails = styled(({ backgroundColor, sx, ...props }: MyAccordionDetailsProps) => {
    const theme = useTheme()

    return (
        <MuiAccordionDetails
            sx={{
                padding: "2rem",
                backgroundColor: backgroundColor || theme.factionTheme.background,
                borderTop: "1px solid rgba(0, 0, 0, .125)",
                ...sx,
            }}
            {...props}
        />
    )
})({})
NiceAccordion.Details = AccordionDetails
