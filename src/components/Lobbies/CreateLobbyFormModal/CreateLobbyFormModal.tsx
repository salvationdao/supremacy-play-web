import { Box, Divider, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { colors, fonts } from "../../../theme/theme"
import { GameMap, NewMechStruct, User } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { NiceStepper } from "../../Common/Nice/NiceStepper"
import { DeployMechs } from "./DeployMechs"
import { FeesRewards } from "./FeesRewards"
import { InviteFriends } from "./InviteFriends"
import { Overview } from "./Overview"
import { RoomSettings } from "./RoomSettings"

const steps = [
    { label: "Room Settings" },
    { label: "Fees & Rewards" },
    { label: "Deploy Mechs", isOptional: true },
    { label: "Invite friends", isOptional: true },
    { label: "Overview" },
]

export enum Accessibility {
    Public = "PUBLIC",
    Private = "PRIVATE",
}

export enum Scheduling {
    SetTime = "SCHEDULED TIME & DATE",
    OnReady = "ON FULL LOBBY",
}

export interface CreateLobbyFormFields {
    // Step 1
    name: string
    accessibility: Accessibility
    access_code: string
    max_deploy_number: number
    game_map?: GameMap
    scheduling_type: Scheduling
    wont_start_until_date: Date
    wont_start_until_time: Date

    // Step 2
    entry_fee: number
    first_faction_cut: number // Percentage (e.g. 75)
    second_faction_cut: number // Percentage (e.g. 75)
    third_faction_cut: number // Percentage (e.g. 75)
    extra_reward: number

    // Step 3
    selected_mechs: NewMechStruct[]

    // Step 4
    invited_user: User[]
}

export const CreateLobbyFormModal = React.memo(function CreateLobbyFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    //  Form
    const formMethods = useForm<CreateLobbyFormFields>({
        defaultValues: {
            // Step 1
            name: "",
            access_code: "",
            accessibility: Accessibility.Public,
            max_deploy_number: 3,
            game_map: undefined,
            scheduling_type: Scheduling.OnReady,
            wont_start_until_date: new Date(),
            wont_start_until_time: new Date(),

            // Step 2
            entry_fee: 0,
            first_faction_cut: 75,
            second_faction_cut: 25,
            third_faction_cut: 0,
            extra_reward: 0,

            // Step 3
            selected_mechs: [],

            // Step 4
            invited_user: [],
        },
    })

    // Stepper
    const [activeStep, setActiveStep] = useState(0)

    const handleStep = useCallback((step: number) => {
        setActiveStep(step)
    }, [])

    const handleBack = useCallback(() => {
        setActiveStep((prev) => Math.max(prev - 1, 0))
    }, [])

    const handleNext = useCallback(() => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, [])

    const isLastStep = activeStep >= steps.length - 1

    const stepForm = useMemo(() => {
        if (activeStep === 0) {
            return <RoomSettings formMethods={formMethods} />
        }

        if (activeStep === 1) {
            return <FeesRewards formMethods={formMethods} />
        }

        if (activeStep === 2) {
            return <DeployMechs formMethods={formMethods} />
        }

        if (activeStep === 3) {
            return <InviteFriends formMethods={formMethods} />
        }

        if (activeStep === 4) {
            return <Overview formMethods={formMethods} />
        }

        return null
    }, [activeStep, formMethods])

    // const onCreate = useCallback(async () => {
    //     const data = getValues() as LobbyForm

    //     // build payload
    //     const payload = {
    //         name: data.name,
    //         accessibility: data.accessibility,
    //         access_code: data.accessibility === Accessibility.Private ? accessCode : undefined,
    //         entry_fee: data.entry_fee,
    //         first_faction_cut: data.first_faction_cut,
    //         second_faction_cut: data.second_faction_cut,
    //         game_map_id: data.game_map_id || undefined,
    //         scheduling_type: data.scheduling_type,
    //         wont_start_until:
    //             data.scheduling_type === Scheduling.SetTime ? combineDateTime(data.wont_start_until_date, data.wont_start_until_time).toDate() : undefined,
    //         max_deploy_number: data.max_deploy_number,
    //         extra_reward: data.extra_reward,
    //         mech_ids: data.selected_mechs.map((sm) => sm.id),
    //         invited_user_ids: selectedUsers.map((su) => su.id),
    //     }

    //     try {
    //         setIsLoading(true)
    //         await send<boolean>(GameServerKeys.CreateBattleLobby, payload)
    //     } catch (err) {
    //         const message = typeof err === "string" ? err : "Failed to insert into repair bay."
    //         setError(message)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }, [accessCode, getValues, selectedUsers, send])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", height: "95rem", maxHeight: "calc(100vh - 20rem)", minWidth: "70rem" }}>
            <Stack height="100%">
                <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb="3rem">
                    Create Lobby
                </Typography>

                <Stack direction="row" alignItems="flex-start" spacing="3rem" flex={1} height={0}>
                    {/* Stepper */}
                    <NiceStepper steps={steps} activeStep={activeStep} handleStep={handleStep} orientation="vertical" />

                    <Divider flexItem orientation="vertical" />

                    <Stack spacing="2.5rem" flex={1} alignSelf="stretch" overflow="hidden">
                        {/* The form questions */}
                        <Box flex={1} sx={{ overflowX: "hidden", overflowY: "auto", pr: ".8rem" }}>
                            {stepForm}
                        </Box>

                        {/* Bottom buttons */}
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing="1rem">
                            <NiceButton buttonColor={theme.factionTheme.primary} disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </NiceButton>

                            {isLastStep ? (
                                <NiceButton buttonColor={colors.green} onClick={handleNext}>
                                    Create Lobby
                                </NiceButton>
                            ) : (
                                <NiceButton buttonColor={theme.factionTheme.primary} onClick={handleNext}>
                                    Next
                                </NiceButton>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </NiceModal>
    )
})
