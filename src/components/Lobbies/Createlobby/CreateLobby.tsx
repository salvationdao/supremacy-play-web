import { Stack } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { CreateLobbyFormTabs } from "./CreateLobbyFormTabs"
import { useMemo, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import moment from "moment"
import { RoomSettingForm } from "./RoomSettingForm"
import { LobbyFormOverview } from "./LobbyFormOverview"
import { FeeRewardForm } from "./FeeRewardForm"
import { WarMachineForm } from "./WarMachineForm"

export interface LobbyForm {
    name: string
    access_code: string
    entry_fee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    game_map_id: string
    scheduling_type: string
    wont_start_until_date: moment.Moment | null
    wont_start_until_time: moment.Moment | null
    accessibility: string
    max_deploy_number: number
    extra_reward: string
}

export enum Accessibility {
    Public = "PUBLIC",
    Private = "PRIVATE",
}

export enum Scheduling {
    SetTime = "SCHEDULED TIME & DATE",
    OnReady = "ON FULL LOBBY",
}

export const CreateLobby = () => {
    const { factionTheme } = useTheme()
    const [currentProcess, setCurrentProcess] = useState(1)
    const useFormMethods = useForm<LobbyForm>({
        defaultValues: {
            name: "",
            access_code: "",
            entry_fee: "0",
            first_faction_cut: "75",
            second_faction_cut: "25",
            third_faction_cut: "0",
            game_map_id: "",
            scheduling_type: Scheduling.OnReady,
            wont_start_until_date: moment(),
            wont_start_until_time: moment(),
            accessibility: Accessibility.Public,
            max_deploy_number: 3,
            extra_reward: "0",
        },
    })

    const content = useMemo(() => {
        switch (currentProcess) {
            case 1:
                return <RoomSettingForm nextPage={() => setCurrentProcess(2)} />
            case 2:
                return <FeeRewardForm prevPage={() => setCurrentProcess(1)} nextPage={() => setCurrentProcess(3)} />
            case 3:
                return <WarMachineForm prevPage={() => setCurrentProcess(2)} />
            default:
                return null
        }
    }, [currentProcess, setCurrentProcess])

    return (
        <FormProvider {...useFormMethods}>
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
                    direction="row"
                    flex={1}
                    sx={{
                        width: "100%",
                        borderBottom: `${factionTheme.primary} 2px solid`,
                        borderRight: `${factionTheme.primary} 2px solid`,
                        borderLeft: `${factionTheme.primary} 2px solid`,
                    }}
                >
                    {content}
                    <LobbyFormOverview />
                </Stack>
            </Stack>
        </FormProvider>
    )
}
