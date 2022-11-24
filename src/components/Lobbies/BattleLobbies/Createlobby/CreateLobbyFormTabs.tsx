import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"
import React, { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"

interface CreateLobbyFormTabsProps {
    currentProcess: number
    tabs: string[]
    setCurrentProcess: React.Dispatch<React.SetStateAction<number>>
}

export const CreateLobbyFormTabs = ({ tabs, currentProcess, setCurrentProcess }: CreateLobbyFormTabsProps) => {
    return (
        <Stack
            direction="row"
            sx={{
                height: "4rem",
            }}
        >
            {tabs.map((t, i) => (
                <FormTab key={i} currentProcess={currentProcess} formNumber={i + 1} label={t} onClick={() => setCurrentProcess(i + 1)} />
            ))}
        </Stack>
    )
}

interface FormTabProps {
    currentProcess: number
    formNumber: number
    label: string
    onClick: () => void
}
const FormTab = ({ currentProcess, formNumber, label, onClick }: FormTabProps) => {
    const { factionTheme } = useTheme()
    const shouldHighlight = useMemo(() => currentProcess === formNumber, [currentProcess, formNumber])
    return (
        <Stack
            direction="row"
            onClick={onClick}
            sx={{
                alignItems: "center",
                px: ".5rem",
                flex: 1,
                cursor: "pointer",
                background: `${factionTheme.primary}${shouldHighlight ? "90" : "20"}`,
                borderTop: shouldHighlight ? `${factionTheme.primary} 2px solid` : "none",
                borderRight: shouldHighlight ? `${factionTheme.primary} 2px solid` : "none",
                borderLeft: shouldHighlight ? `${factionTheme.primary} 2px solid` : "none",
                borderBottom: shouldHighlight ? "none" : `${factionTheme.primary} 2px solid`,
            }}
        >
            <Stack direction="row" flex={1} alignItems="center">
                <NiceBoxThing
                    caret={{
                        position: "top-left",
                        color: `${factionTheme.primary}${shouldHighlight ? "AA" : "50"}`,
                        size: "small",
                    }}
                >
                    <Typography fontFamily={fonts.nostromoBold} sx={{ ml: "1.5rem" }}>
                        {formNumber}
                    </Typography>
                </NiceBoxThing>
                <Stack direction="row" justifyContent="center" alignItems="center" flex={1}>
                    <Typography fontFamily={fonts.nostromoBold}>{label}</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}
