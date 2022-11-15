import { Box, Stack, Typography } from "@mui/material"
import moment from "moment"
import React, { useCallback, useMemo, useState } from "react"
import { SvgSupToken } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { combineDateTime, shortCodeGenerator } from "../../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { GameMap, LobbyMech } from "../../../../types"
import { ConfirmModal } from "../../../Common/Deprecated/ConfirmModal"
import { FancyButton } from "../../../Common/Deprecated/FancyButton"
import { FactionBasedDatePicker } from "../../../Common/FactionBasedDatePicker"
import { FactionBasedTimePicker } from "../../../Common/FactionBasedTimePicker"
import { InputField } from "../../Common/InputField"
import { MechSelector } from "../../Common/MechSelector"
import { RadioGroupField } from "../../Common/RadioGroupField"
import { SelectedMechSlots } from "../../Common/SelectedMechSlots"
import { SelectField } from "../../Common/SelectField"
import { SliderField } from "../../Common/SliderField"

interface BattleLobbyCreateModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface LobbyForm {
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

enum Accessibility {
    Public = "PUBLIC",
    Private = "PRIVATE",
}

enum Scheduling {
    OnReady = "ON LOBBY FULL",
    SetTime = "WON'T START UNTIL",
}

export const BattleLobbyCreateModal = ({ setOpen }: BattleLobbyCreateModalProps) => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { factionTheme } = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [selectedMechs, setSelectedMechs] = useState<LobbyMech[]>([])
    const [mapURL, setMapURL] = useState("")

    const [gameMaps, setGameMaps] = useState<GameMap[]>([])
    useGameServerSubscriptionSecured<GameMap[]>(
        {
            URI: "/game_map_list",
            key: GameServerKeys.SubGameMapList,
        },
        (payload) => {
            if (!payload) return
            setGameMaps(payload)
        },
    )

    const [lobbyForm, setLobbyForm] = useState<LobbyForm>({
        name: "",
        access_code: "",
        entry_fee: "0",
        first_faction_cut: "75",
        second_faction_cut: "25",
        third_faction_cut: "0",
        game_map_id: "",
        scheduling_type: Scheduling.OnReady,
        wont_start_until_date: null,
        wont_start_until_time: null,
        accessibility: Accessibility.Public,
        max_deploy_number: 3,
        extra_reward: "0",
    })

    const accessCode = useMemo(() => {
        let code = ""
        if (lobbyForm.accessibility === Accessibility.Private) code = shortCodeGenerator(10, false, true, false)

        setLobbyForm((prev) => ({ ...prev, access_code: code }))
        return code
    }, [lobbyForm.accessibility])
    const [isCopied, setIsCopied] = useState(false)

    const disableScheduling = useMemo(() => lobbyForm.scheduling_type === Scheduling.OnReady, [lobbyForm.scheduling_type])
    const disableTimePicker = useMemo(() => !lobbyForm.wont_start_until_date || !lobbyForm.wont_start_until_date.isValid(), [lobbyForm.wont_start_until_date])

    const onCreate = useCallback(async () => {
        let wontStartUntil: Date | undefined = undefined

        if (lobbyForm.scheduling_type === Scheduling.SetTime) {
            if (
                !lobbyForm.wont_start_until_date ||
                !lobbyForm.wont_start_until_date.isValid() ||
                !lobbyForm.wont_start_until_time ||
                !lobbyForm.wont_start_until_time.isValid()
            ) {
                return
            }

            wontStartUntil = combineDateTime(lobbyForm.wont_start_until_date, lobbyForm.wont_start_until_time).toDate()
        }

        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.CreateBattleLobby, {
                ...lobbyForm,
                will_not_start_until: wontStartUntil,
                game_map_id: lobbyForm.game_map_id !== "" ? lobbyForm.game_map_id : undefined,
                mech_ids: selectedMechs.map((sm) => sm.id),
            })

            setOpen(false)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert into repair bay."
            setError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [lobbyForm, send, selectedMechs, setOpen])

    return (
        <ConfirmModal
            title={`CREATE BATTLE LOBBY`}
            confirmButton={
                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        clipSlantSize: "0px",
                        corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                        backgroundColor: colors.green,
                        border: { isFancy: true, borderColor: colors.green, borderThickness: "1.5px" },
                        sx: { position: "relative", minWidth: "10rem" },
                    }}
                    sx={{ px: ".6rem", py: ".5rem", color: "#FFFFFF" }}
                    onClick={onCreate}
                >
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        CREATE LOBBY
                    </Typography>
                </FancyButton>
            }
            onClose={() => setOpen(false)}
            isLoading={isLoading}
            error={error}
            width="150rem"
            omitCancel
        >
            <Stack direction="column" spacing={1} sx={{ width: "100%", position: "relative" }}>
                {/*Background image*/}
                <Box
                    sx={{
                        position: "absolute",
                        zIndex: -1,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: mapURL ? `linear-gradient(to right, ${factionTheme.background}dd 0%, transparent 100%), url(${mapURL})` : undefined,
                        opacity: 0.3,
                    }}
                />

                {/* form */}
                <Stack direction="row" flex={1} spacing={3}>
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{
                            width: "37rem",
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                color: factionTheme.secondary,
                                pl: "1rem",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: factionTheme.primary,
                                borderRadius: 0.8,
                            }}
                        >
                            ROOM SETTING
                        </Typography>
                        <Stack direction="column" spacing={1} sx={{ px: "1rem", pb: "2rem" }}>
                            <InputField
                                variant="outlined"
                                label="Name"
                                value={lobbyForm.name}
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <SelectField
                                label="Game Map"
                                options={[{ id: "", label: "RANDOM" }].concat(gameMaps.map((gm) => ({ id: gm.id, label: gm.name })))}
                                value={lobbyForm.game_map_id}
                                onChange={(e) => {
                                    const mapID = e.target.value as string
                                    setMapURL(gameMaps.find((gm) => gm.id === mapID)?.background_url || "")
                                    setLobbyForm((prev) => ({ ...prev, game_map_id: mapID }))
                                }}
                            />
                            <Stack sx={{ pb: ".7rem" }}>
                                <RadioGroupField
                                    label="Accessibility"
                                    options={[
                                        { id: Accessibility.Public, label: Accessibility.Public },
                                        {
                                            id: Accessibility.Private,
                                            label: (
                                                <Stack direction="row" alignItems="center" flex={1} sx={{ height: "100%" }}>
                                                    <Typography variant="subtitle1" fontFamily={fonts.nostromoBlack}>
                                                        {Accessibility.Private}
                                                    </Typography>
                                                </Stack>
                                            ),
                                        },
                                    ]}
                                    value={lobbyForm.accessibility}
                                    onChange={(value) => {
                                        setLobbyForm((prev) => ({ ...prev, accessibility: value }))
                                    }}
                                />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    flex={1}
                                    sx={{
                                        pt: "0,4rem",
                                        pl: "3.5rem",
                                        opacity: lobbyForm.accessibility === Accessibility.Private ? 1 : 0.5,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        flex={1}
                                        sx={{
                                            height: "4rem",
                                            pl: "1.5rem",
                                            borderTop: `${factionTheme.primary} 2px dashed`,
                                            borderLeft: `${factionTheme.primary} 2px dashed`,
                                            borderBottom: `${factionTheme.primary} 2px dashed`,
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (isCopied || !accessCode) return
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontFamily={fonts.nostromoHeavy}>
                                            {accessCode}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            px: "1rem",
                                            height: "4rem",
                                            backgroundColor: factionTheme.primary,
                                            minWidth: "9.5rem",
                                            cursor: "pointer",
                                        }}
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (isCopied || !accessCode) return
                                            await navigator.clipboard.writeText(accessCode)
                                            setIsCopied(true)
                                            setTimeout(() => setIsCopied(false), 1000)
                                        }}
                                    >
                                        <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                                            {isCopied ? "COPIED" : "COPY"}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <SliderField
                                label="MAX DEPLOY PER PLAYER"
                                min={1}
                                max={3}
                                value={lobbyForm.max_deploy_number}
                                onChange={(e, v) => setLobbyForm((prev) => ({ ...prev, max_deploy_number: typeof v === "number" ? v : 3 }))}
                                marks={[
                                    { value: 1, label: "1" },
                                    { value: 2, label: "2" },
                                    { value: 3, label: "3" },
                                ]}
                            />

                            <Stack>
                                <RadioGroupField
                                    label="Scheduling"
                                    value={lobbyForm.scheduling_type}
                                    onChange={(value) => {
                                        setLobbyForm((prev) => ({ ...prev, scheduling_type: value }))
                                    }}
                                    options={[
                                        { id: Scheduling.OnReady, label: Scheduling.OnReady },
                                        { id: Scheduling.SetTime, label: Scheduling.SetTime },
                                    ]}
                                />
                                <Stack direction="column" spacing={0.6} sx={{ pl: "3.5rem" }}>
                                    <Stack spacing=".5rem" sx={{ opacity: disableScheduling ? 0.5 : 1 }}>
                                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                                            DATE:
                                        </Typography>
                                        <FactionBasedDatePicker
                                            value={lobbyForm.wont_start_until_date}
                                            onChange={(v) => setLobbyForm((prev) => ({ ...prev, wont_start_until_date: v }))}
                                            disabled={disableScheduling}
                                        />
                                    </Stack>
                                    <Stack spacing=".5rem" sx={{ opacity: disableTimePicker ? 0.5 : 1 }}>
                                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                                            TIME:
                                        </Typography>
                                        <FactionBasedTimePicker
                                            value={lobbyForm.wont_start_until_time}
                                            onChange={(v) => setLobbyForm((prev) => ({ ...prev, wont_start_until_time: v }))}
                                            disabled={disableScheduling || disableTimePicker}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* FEE & REWARD */}
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{
                            width: "37rem",
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                color: factionTheme.secondary,
                                pl: "1rem",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: factionTheme.primary,
                                borderRadius: 0.8,
                            }}
                        >
                            FEE & REWARD
                        </Typography>
                        <Stack direction="column" spacing={1} sx={{ px: "1rem" }}>
                            <InputField
                                variant="outlined"
                                label="Entry Fee"
                                type="number"
                                startAdornmentLabel={<SvgSupToken fill={colors.yellow} size="1.9rem" />}
                                endAdornmentLabel={
                                    <Typography variant="body2" fontWeight="bold" fontFamily={fonts.rajdhaniMedium}>
                                        PER MECH
                                    </Typography>
                                }
                                value={lobbyForm.entry_fee}
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, entry_fee: e.target.value }))}
                            />
                            <InputField
                                variant="outlined"
                                label="Winning Faction Cut"
                                type="number"
                                endAdornmentLabel={
                                    <Typography variant="body2" fontWeight="bold" fontFamily={fonts.rajdhaniMedium}>
                                        %
                                    </Typography>
                                }
                                value={lobbyForm.first_faction_cut}
                                onChange={(e) =>
                                    setLobbyForm((prev) => ({
                                        ...prev,
                                        first_faction_cut: e.target.value,
                                    }))
                                }
                            />
                            <InputField
                                variant="outlined"
                                label="Second Faction Cut"
                                type="number"
                                endAdornmentLabel={
                                    <Typography variant="body2" fontWeight="bold" fontFamily={fonts.rajdhaniMedium}>
                                        %
                                    </Typography>
                                }
                                value={lobbyForm.second_faction_cut}
                                onChange={(e) =>
                                    setLobbyForm((prev) => ({
                                        ...prev,
                                        second_faction_cut: e.target.value,
                                    }))
                                }
                            />
                            <InputField
                                variant="outlined"
                                label="Loosing Faction Cut"
                                type="number"
                                endAdornmentLabel={
                                    <Typography variant="body2" fontWeight="bold" fontFamily={fonts.rajdhaniMedium}>
                                        %
                                    </Typography>
                                }
                                value={lobbyForm.third_faction_cut}
                                onChange={(e) =>
                                    setLobbyForm((prev) => ({
                                        ...prev,
                                        third_faction_cut: e.target.value,
                                    }))
                                }
                            />
                            <InputField
                                variant="outlined"
                                label="EXTRA REWARD"
                                type="number"
                                startAdornmentLabel={<SvgSupToken fill={colors.yellow} size="1.9rem" />}
                                value={lobbyForm.extra_reward}
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, extra_reward: e.target.value }))}
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="column" flex={1} spacing={1}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: factionTheme.secondary,
                                pl: "1rem",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: factionTheme.primary,
                                borderRadius: 0.8,
                            }}
                        >
                            WAR MACHINES
                        </Typography>
                        <MechSelector setSelectedMechs={setSelectedMechs} selectedMechs={selectedMechs} />
                    </Stack>
                </Stack>
                <Typography
                    variant="body1"
                    sx={{
                        color: factionTheme.secondary,
                        pl: "1rem",
                        fontFamily: fonts.nostromoBlack,
                        backgroundColor: factionTheme.primary,
                        borderRadius: 0.8,
                        mt: "1rem",
                        mb: "1rem",
                    }}
                >
                    WAR MACHINE SLOTS
                </Typography>

                <SelectedMechSlots selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} />
            </Stack>
        </ConfirmModal>
    )
}
