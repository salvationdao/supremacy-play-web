import { Stack } from "@mui/material"
import { NiceButton } from "../../Common/Nice/NiceButton"
import React from "react"
import { useTheme } from "../../../containers/theme"

interface WarMachineFormProps {
    prevPage: () => void
}

export const WarMachineForm = ({ prevPage }: WarMachineFormProps) => {
    const { factionTheme } = useTheme()
    return (
        <Stack direction="column" flex={1} sx={{ px: "25rem", py: "4rem" }}>
            <Stack direction="column" flex={1}></Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <NiceButton
                    buttonColor={factionTheme.primary}
                    onClick={() => prevPage()}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    BACK
                </NiceButton>
                <NiceButton
                    buttonColor={factionTheme.primary}
                    disabled={true}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    Next
                </NiceButton>
            </Stack>
        </Stack>
    )
}
