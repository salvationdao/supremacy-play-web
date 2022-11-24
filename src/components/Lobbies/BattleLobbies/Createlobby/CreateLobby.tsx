import { Stack } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { CreateLobbyFormTabs } from "./CreateLobbyFormTabs"
import { useCallback, useMemo, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import moment from "moment"
import { RoomSettingForm } from "./RoomSettingForm"
import { LobbyFormOverview } from "./LobbyFormOverview"
import { FeeRewardForm } from "./FeeRewardForm"
import { WarMachineForm } from "./WarMachineForm"
import { NewMechStruct } from "../../../types"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { PlayerQueueStatus } from "../../../types/battle_queue"

export interface LobbyForm {
    name: string
    access_code: string
    entry_fee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    game_map_id: string
    scheduling_type: string
    wont_start_until_date: moment.Moment
    wont_start_until_time: moment.Moment
    accessibility: string
    max_deploy_number: number
    extra_reward: string
    selected_mechs: NewMechStruct[]
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
            selected_mechs: [],
        },
    })

    // return true, if a mech has equipped a power core and more than one weapon
    const queueable = useCallback((lb: NewMechStruct): boolean => {
        // check power core
        if (!lb.power_core) return false

        // check weapon count
        let hasWeapon = false
        lb.weapon_slots?.forEach((ws) => {
            // skip, if already has weapon
            if (hasWeapon) return

            // check whether the mech has weapon equipped
            hasWeapon = !!ws.weapon
        })

        return hasWeapon
    }, [])

    const [stakedMechs, setStakedMechs] = useState<NewMechStruct[]>([])
    useGameServerSubscriptionFaction<NewMechStruct[]>(
        {
            URI: "/staked_mechs",
            key: GameServerKeys.SubFactionStakedMechs,
        },
        (payload) => {
            if (!payload) return

            setStakedMechs((prev) => {
                if (prev.length === 0) {
                    return payload.filter((p) => p.can_deploy)
                }

                // Replace current list
                const list = prev.map((sm) => payload.find((p) => p.id === sm.id) || sm)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((mech) => mech.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => p.can_deploy)
            })
        },
    )

    const [ownedMechs, setOwnedMechs] = useState<NewMechStruct[]>([])
    useGameServerSubscriptionSecuredUser<NewMechStruct[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerQueueableMechs,
        },
        (payload) => {
            if (!payload) return

            setOwnedMechs((mqs) => {
                if (mqs.length === 0) {
                    return payload.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
                }

                // replace current list
                const list = mqs.map((mq) => payload.find((p) => p.id === mq.id) || mq)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((mq) => mq.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
            })
        },
    )
    const [playerQueueLimit, setPlayerQueueLimit] = useState<number>(10)
    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueLimit(payload.queue_limit)
        },
    )

    const content = useMemo(() => {
        switch (currentProcess) {
            case 1:
                return <RoomSettingForm nextPage={() => setCurrentProcess(2)} />
            case 2:
                return <FeeRewardForm prevPage={() => setCurrentProcess(1)} nextPage={() => setCurrentProcess(3)} />
            case 3:
                return (
                    <WarMachineForm
                        prevPage={() => setCurrentProcess(2)}
                        ownedMechs={ownedMechs}
                        stakedMechs={stakedMechs}
                        playerQueueLimit={playerQueueLimit}
                    />
                )
            default:
                return null
        }
    }, [currentProcess, ownedMechs, playerQueueLimit, stakedMechs])

    return (
        <FormProvider {...useFormMethods}>
            <Stack
                flex={1}
                direction="column"
                sx={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "1920px",
                    minHeight: 0,
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
                        minHeight: 0,
                        width: "100%",
                        height: "100%",
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
