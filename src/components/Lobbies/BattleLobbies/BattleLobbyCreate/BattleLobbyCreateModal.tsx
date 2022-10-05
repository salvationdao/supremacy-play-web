import { ConfirmModal } from "../../../Common/ConfirmModal"
import React, { useMemo, useState } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../../theme/theme"
import { SvgSupToken } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { GameMap, MechBasicWithQueueStatus } from "../../../../types"
import { FactionBasedDatePicker } from "../../../Common/FactionBasedDatePicker"
import moment from "moment"
import { FactionBasedTimePicker } from "../../../Common/FactionBasedTimePicker"
import { MechSelector } from "./MechSelector"
import { FancyButton } from "../../../Common/FancyButton"
import { SelectedMechSlots } from "./SelectedMechSlots"
import { InputField } from "./InputField"
import { SelectField } from "./SelectField"
import { RadioGroupField } from "./RadioGroupField"
import { makeid } from "../../../../containers/ws/util"
import { shortCodeGenerator } from "../../../../helpers"

interface BattleLobbyCreateModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface LobbyForm {
    name: string
    access_code: string
    entryFee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    game_map_id: string
    wont_start_until_date: moment.Moment | null
    wont_start_until_time: moment.Moment | null
    accessibility: string
}

enum Accessibility {
    Public = "PUBLIC",
    Private = "PRIVATE",
}

export const BattleLobbyCreateModal = ({ setOpen }: BattleLobbyCreateModalProps) => {
    const [error, setError] = useState("")
    const { factionTheme } = useTheme()

    const [selectedMechs, setSelectedMechs] = useState<MechBasicWithQueueStatus[]>([])

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
        entryFee: "0",
        first_faction_cut: "75",
        second_faction_cut: "25",
        third_faction_cut: "0",
        game_map_id: "",
        wont_start_until_date: null,
        wont_start_until_time: null,
        accessibility: Accessibility.Public,
    })

    const accessCode = useMemo(() => {
        let code = ""
        if (lobbyForm.accessibility === Accessibility.Private) code = shortCodeGenerator(10, false, true, false)

        setLobbyForm((prev) => ({ ...prev, access_code: code }))
        return code
    }, [lobbyForm.accessibility])
    const [isCopied, setIsCopied] = useState(false)

    const disableTimePicker = useMemo(() => !lobbyForm.wont_start_until_date || !lobbyForm.wont_start_until_date.isValid(), [lobbyForm.wont_start_until_date])

    const disableFactionCutOptions: boolean = useMemo(() => {
        const entryFee = parseFloat(lobbyForm.entryFee)
        // return true, if
        // 1. entry is NaN OR
        // 2. entry is less than or equal to zero
        // otherwise, return false
        return isNaN(entryFee) || entryFee <= 0
    }, [lobbyForm.entryFee])

    return (
        <ConfirmModal
            title={`CREATE BATTLE LOBBY`}
            onConfirm={() => console.log(lobbyForm)}
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
                    onClick={() => console.log(true)}
                >
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        CREATE LOBBY
                    </Typography>
                </FancyButton>
            }
            onClose={() => {
                setOpen(false)
            }}
            isLoading={false}
            error={error}
            width="130rem"
            omitCancel
        >
            <Stack direction="column">
                <Stack direction="row" flex={1} spacing={3}>
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{
                            width: "45rem",
                        }}
                    >
                        <Typography variant="body1" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            ROOM SETTING:
                        </Typography>
                        <Stack direction="column" spacing={0.6} sx={{ px: "1rem" }}>
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
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, game_map_id: e.target.value as string }))}
                            />
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
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    flex={1}
                                                    sx={{
                                                        height: "100%",
                                                        pl: "1rem",
                                                        opacity: lobbyForm.accessibility === Accessibility.Private ? 1 : 0.5,
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        flex={1}
                                                        sx={{
                                                            height: "100%",
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
                                                            height: "100%",
                                                            backgroundColor: factionTheme.primary,
                                                            minWidth: "9.5rem",
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
                                        ),
                                    },
                                ]}
                                value={lobbyForm.accessibility}
                                onChange={(value) => {
                                    setLobbyForm((prev) => ({ ...prev, accessibility: value }))
                                }}
                            />
                        </Stack>

                        <Typography variant="body1" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            FEE & REWARD:
                        </Typography>
                        <Stack direction="column" spacing={0.6} sx={{ px: "1rem" }}>
                            <InputField
                                variant="outlined"
                                label="Entry Fee"
                                type="number"
                                startAdornmentLabel={<SvgSupToken fill={colors.yellow} size="1.9rem" />}
                                endAdornmentLabel={<Typography variant="body2">PER MECH</Typography>}
                                value={lobbyForm.entryFee}
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, entryFee: e.target.value }))}
                            />
                            <InputField
                                variant="outlined"
                                label="Winning Faction Cut"
                                type="number"
                                disabled={disableFactionCutOptions}
                                endAdornmentLabel={<Typography variant="body2">%</Typography>}
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
                                endAdornmentLabel={<Typography variant="body2">%</Typography>}
                                disabled={disableFactionCutOptions}
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
                                endAdornmentLabel={<Typography variant="body2">%</Typography>}
                                disabled={disableFactionCutOptions}
                                value={lobbyForm.third_faction_cut}
                                onChange={(e) =>
                                    setLobbyForm((prev) => ({
                                        ...prev,
                                        third_faction_cut: e.target.value,
                                    }))
                                }
                            />
                        </Stack>

                        <Typography variant="body1" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            SCHEDULE:
                        </Typography>
                        <Stack direction="column" spacing={0.6} sx={{ px: "1rem" }}>
                            <Stack spacing=".5rem">
                                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                                    DATE:
                                </Typography>
                                <FactionBasedDatePicker
                                    value={lobbyForm.wont_start_until_date}
                                    onChange={(v) => setLobbyForm((prev) => ({ ...prev, wont_start_until_date: v }))}
                                />
                            </Stack>
                            <Stack spacing=".5rem" sx={{ opacity: disableTimePicker ? 0.5 : 1 }}>
                                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                                    TIME:
                                </Typography>
                                <FactionBasedTimePicker
                                    value={lobbyForm.wont_start_until_time}
                                    onChange={(v) => setLobbyForm((prev) => ({ ...prev, wont_start_until_time: v }))}
                                    disabled={disableTimePicker}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="column" flex={1} spacing={1}>
                        <Typography variant="body1" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            WAR MACHINES:
                        </Typography>
                        <MechSelector setSelectedMechs={setSelectedMechs} selectedMechs={selectedMechs} />
                    </Stack>
                </Stack>
                <Typography variant="body1" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack, mt: "1rem", mb: "1rem" }}>
                    WAR MACHINE SLOTS:
                </Typography>

                <SelectedMechSlots selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} />
            </Stack>
        </ConfirmModal>
    )
}
