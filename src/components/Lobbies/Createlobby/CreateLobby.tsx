import { Stack } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { CreateLobbyFormTabs } from "./CreateLobbyFormTabs"
import { useState } from "react"

export const CreateLobby = () => {
    const { factionTheme } = useTheme()
    const [currentProcess, setCurrentProcess] = useState(1)
    return (
        <Stack
            flex={1}
            sx={{
                width: "100%",
                maxWidth: "1920px",
            }}
        >
            <CreateLobbyFormTabs
                currentProcess={currentProcess}
                tabs={["ROOM SETTING", "FEES & REWARD", "WAR MACHINES"]}
                setCurrentProcess={setCurrentProcess}
            />
            <Stack
                flex={1}
                sx={{
                    width: "100%",
                    borderBottom: `${factionTheme.primary} 2px solid`,
                    borderRight: `${factionTheme.primary} 2px solid`,
                    borderLeft: `${factionTheme.primary} 2px solid`,
                }}
            ></Stack>
        </Stack>
    )
}
