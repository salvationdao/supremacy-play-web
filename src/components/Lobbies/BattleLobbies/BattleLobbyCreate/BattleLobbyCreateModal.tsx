import { ConfirmModal } from "../../../Common/ConfirmModal"
import React, { ReactNode, useMemo, useState } from "react"
import { InputAdornment, MenuItem, Select, SelectProps, Stack, TextField, Typography } from "@mui/material"
import { colors, fonts } from "../../../../theme/theme"
import { SvgSupToken } from "../../../../assets"
import { TextFieldProps } from "@mui/material/TextField"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { GameMap } from "../../../../types"
import { FactionBasedDatePicker } from "../../../Common/FactionBasedDatePicker"
import moment from "moment"
import { FactionBasedTimePicker } from "../../../Common/FactionBasedTimePicker"
import { MechSlot } from "./MechSlot"
import { MechSelector } from "./MechSelector"
import { FancyButton } from "../../../Common/FancyButton"

interface BattleLobbyCreateModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface LobbyForm {
    name: string
    password: string
    entryFee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    game_map_id: string
    wont_start_until_date: moment.Moment | null
    wont_start_until_time: moment.Moment | null
}

export const BattleLobbyCreateModal = ({ setOpen }: BattleLobbyCreateModalProps) => {
    const [error, setError] = useState("")
    const { factionTheme } = useTheme()

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
        password: "",
        entryFee: "0",
        first_faction_cut: "75",
        second_faction_cut: "25",
        third_faction_cut: "0",
        game_map_id: "",
        wont_start_until_date: null,
        wont_start_until_time: null,
    })

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
                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
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
                            <InputField
                                variant="outlined"
                                label="Password (optional)"
                                placeholder="password"
                                value={lobbyForm.password}
                                onChange={(e) => setLobbyForm((prev) => ({ ...prev, password: e.target.value }))}
                            />
                        </Stack>

                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
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

                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
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
                        <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            WAR MACHINES:
                        </Typography>
                        <MechSelector SetSelectedMechID={console.log} />
                    </Stack>
                </Stack>
                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack, mt: "1rem", mb: "1rem" }}>
                    WAR MACHINE SLOTS:
                </Typography>

                <Stack
                    direction="row"
                    spacing="1rem"
                    sx={{
                        height: "25rem",
                        width: "100%",
                    }}
                >
                    <MechSlot />
                    <MechSlot />
                    <MechSlot />
                </Stack>
            </Stack>
        </ConfirmModal>
    )
}

interface InputFieldProps {
    startAdornmentLabel?: ReactNode
    endAdornmentLabel?: ReactNode
}

const InputField = ({ label, startAdornmentLabel, endAdornmentLabel, placeholder, disabled, ...props }: InputFieldProps & TextFieldProps) => {
    const { factionTheme } = useTheme()
    const title = useMemo(() => {
        if (typeof label === "string") {
            return (
                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            )
        }
        return label
    }, [factionTheme.primary, label])

    const startAdornment = useMemo(() => {
        if (!startAdornmentLabel) return null
        return <InputAdornment position="start">{startAdornmentLabel}</InputAdornment>
    }, [startAdornmentLabel])

    const endAdornment = useMemo(() => {
        if (!endAdornmentLabel) return null
        return <InputAdornment position="start">{endAdornmentLabel}</InputAdornment>
    }, [endAdornmentLabel])

    return (
        <Stack
            spacing=".5rem"
            sx={{
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {title}
            <TextField
                {...props}
                hiddenLabel
                fullWidth
                placeholder={placeholder || "ANY"}
                disabled={disabled}
                InputProps={{
                    startAdornment,
                    endAdornment,
                }}
                sx={{
                    backgroundColor: "#00000090",
                    ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${factionTheme.primary}99 2px dashed` },
                    ".MuiOutlinedInput-input": {
                        px: "1.5rem",
                        py: ".6rem",
                        fontSize: "1.7rem",
                        height: "unset",
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                    },
                    ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                }}
            />
        </Stack>
    )
}

interface SelectFieldProps {
    options: SelectOption[]
}

interface SelectOption {
    id: string
    label: string
}

const SelectField = ({ options, label, ...props }: SelectFieldProps & SelectProps) => {
    const { factionTheme } = useTheme()
    const title = useMemo(() => {
        if (typeof label === "string") {
            return (
                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            )
        }
        return label
    }, [factionTheme.primary, label])
    return (
        <Stack spacing=".5rem">
            {title}
            <Select
                {...props}
                sx={{
                    width: "100%",
                    borderRadius: 0.5,
                    border: `${factionTheme.primary}99 2px dashed`,
                    backgroundColor: "#00000090",
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    ".MuiTypography-root": {
                        px: "2.4rem",
                        py: ".6rem",
                        fontSize: "1.7rem",
                        height: "unset",
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                    },

                    "& .MuiSelect-outlined": {
                        p: 0,
                        height: "4rem",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },
                }}
                displayEmpty
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: "#FFFFFF",
                            },
                            backgroundColor: factionTheme.primary,
                        },
                    },
                    PaperProps: {
                        sx: {
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.5,
                        },
                    },
                }}
            >
                {options.map((x, i) => {
                    return (
                        <MenuItem key={`${x.id} ${i}`} value={x.id} sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}>
                            <Typography textTransform="uppercase">{x.label}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
