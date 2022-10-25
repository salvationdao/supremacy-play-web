import { ArrowRight } from "@mui/icons-material"
import { Box, styled, Typography } from "@mui/material"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary"
import { useCallback, useState } from "react"

export interface NiceAccordionProps {
    items: {
        id: string | number
        header: string
        content: React.ReactNode
    }[]
    expandID?: string | number
}

export const NiceAccordion = ({ items, expandID }: NiceAccordionProps) => {
    const [expanded, setExpanded] = useState(expandID)

    const handleChange = useCallback((id: string | number) => {
        setExpanded(id)
    }, [])

    return (
        <Box>
            {items.map((item) => (
                <Accordion key={item.id} expanded={item.id === expanded} onChange={() => handleChange(item.id)}>
                    <AccordionSummary aria-controls={`${item.id}-content`} id={`${item.id}-header`}>
                        <Typography>{item.header}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>{item.content}</AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&:before": {
        display: "none",
    },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<ArrowRight sx={{ fontSize: "2rem" }} />} {...props} />)(
    ({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
        flexDirection: "row-reverse",
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
        },
        "& .MuiAccordionSummary-content": {
            marginLeft: theme.spacing(1),
        },
    }),
)

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
}))
