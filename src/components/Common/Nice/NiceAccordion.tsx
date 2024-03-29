import { ArrowRight } from "@mui/icons-material"
import { styled, Typography, useTheme } from "@mui/material"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails"
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary"
import { useState } from "react"
import { SvgWrapperProps } from "../../../assets"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

export interface NiceAccordionProps extends Omit<NiceBoxThingProps, "children" | "onExpand"> {
    items: {
        id: string | number
        header: string | React.ReactNode
        icon?: React.VoidFunctionComponent<SvgWrapperProps>
        content: React.ReactNode
    }[]
    expandID?: string | number
    onExpand?: (expandID: string | number) => void
}

export const NiceAccordion = ({ items, expandID, onExpand, ...props }: NiceAccordionProps) => {
    const [expanded, setExpanded] = useState(expandID)
    const theme = useTheme()

    return (
        <NiceBoxThing
            border={{
                color: theme.factionTheme.s700,
                thickness: "very-lean",
            }}
            background={{
                colors: [theme.factionTheme.u800],
            }}
            {...props}
        >
            {items.map((item) => (
                <Accordion
                    key={item.id}
                    expanded={item.id === expanded}
                    onChange={() => {
                        setExpanded(item.id)
                        if (onExpand) {
                            onExpand(item.id)
                        }
                    }}
                >
                    <AccordionSummary
                        aria-controls={`${item.id}-content`}
                        id={`${item.id}-header`}
                        sx={{
                            background:
                                item.id === expanded ? `linear-gradient(${theme.factionTheme.s600}, ${theme.factionTheme.s700})` : theme.factionTheme.u800,
                            color: theme.factionTheme.text,
                            "& .MuiAccordionSummary-expandIconWrapper": {
                                svg: {
                                    fill: theme.factionTheme.text,
                                },
                            },
                        }}
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
                    borderBottom: borderColor ? `1px solid ${borderColor}` : `1px solid ${theme.factionTheme.s700}`,
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

const AccordionSummary = styled(({ sx, children, ...props }: AccordionSummaryProps) => {
    const theme = useTheme()

    return (
        <MuiAccordionSummary
            expandIcon={<ArrowRight sx={{ fontSize: "4rem" }} />}
            sx={{
                px: "0",
                background: `linear-gradient(${theme.factionTheme.s600}, ${theme.factionTheme.s700})`,
                color: theme.factionTheme.text,
                transition: "background-color .2s ease-out",
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                    svg: {
                        fill: theme.factionTheme.text,
                    },
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
                        color: "inherit",
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
                backgroundColor: backgroundColor || theme.factionTheme.u800,
                borderTop: "1px solid rgba(0, 0, 0, .125)",
                ...sx,
            }}
            {...props}
        />
    )
})({})
NiceAccordion.Details = AccordionDetails
