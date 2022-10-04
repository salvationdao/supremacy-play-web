import { ConfirmModal } from "../Common/ConfirmModal"
import React, { ReactNode, useMemo, useState } from "react"
import { Box, InputAdornment, MenuItem, Select, SelectProps, Stack, TextField, Typography } from "@mui/material"
import { colors, fonts } from "../../theme/theme"
import { SvgSupToken } from "../../assets"
import { TextFieldProps } from "@mui/material/TextField"
import { useTheme } from "../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { GameMap } from "../../types"

interface BattleLobbyCreateModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface LobbyForm {
    name: string
    entryFee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    game_map_id: string
}

export const BattleLobbyCreateModal = ({ setOpen }: BattleLobbyCreateModalProps) => {
    const [error, setError] = useState("")

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
        entryFee: "0",
        first_faction_cut: "75",
        second_faction_cut: "25",
        third_faction_cut: "0",
        game_map_id: "",
    })

    return (
        <ConfirmModal
            title={`CREATE BATTLE LOBBY`}
            onConfirm={() => console.log(lobbyForm)}
            onClose={() => {
                setOpen(false)
            }}
            isLoading={false}
            error={error}
        >
            <Stack direction="row">
                <Stack direction="column" flex={1}>
                    <Stack direction="column" spacing={1}>
                        <InputField
                            variant="outlined"
                            label="Lobby Name"
                            value={lobbyForm.name}
                            onChange={(e) => setLobbyForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
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
                            endAdornmentLabel={<Typography variant="body2">%</Typography>}
                            value={lobbyForm.first_faction_cut}
                            onChange={(e) => setLobbyForm((prev) => ({ ...prev, first_faction_cut: e.target.value }))}
                        />
                        <InputField
                            variant="outlined"
                            label="Second Faction Cut"
                            type="number"
                            endAdornmentLabel={<Typography variant="body2">%</Typography>}
                            value={lobbyForm.second_faction_cut}
                            onChange={(e) => setLobbyForm((prev) => ({ ...prev, second_faction_cut: e.target.value }))}
                        />
                        <InputField
                            variant="outlined"
                            label="Loosing Faction Cut"
                            type="number"
                            endAdornmentLabel={<Typography variant="body2">%</Typography>}
                            value={lobbyForm.third_faction_cut}
                            onChange={(e) => setLobbyForm((prev) => ({ ...prev, third_faction_cut: e.target.value }))}
                        />
                        <SelectField
                            label="Game Map"
                            options={[{ id: "", label: "RANDOM" }].concat(gameMaps.map((gm) => ({ id: gm.id, label: gm.name })))}
                            value={lobbyForm.game_map_id}
                            onChange={(e) => setLobbyForm((prev) => ({ ...prev, game_map_id: e.target.value as string }))}
                        />
                    </Stack>
                    <Stack direction="column"></Stack>
                </Stack>
                <Stack></Stack>
            </Stack>
        </ConfirmModal>
    )
}

interface InputFieldProps {
    startAdornmentLabel?: ReactNode
    endAdornmentLabel?: ReactNode
}

const InputField = ({ label, startAdornmentLabel, endAdornmentLabel, placeholder, ...props }: InputFieldProps & TextFieldProps) => {
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
        <Stack spacing=".5rem">
            {title}
            <TextField
                {...props}
                hiddenLabel
                fullWidth
                placeholder={placeholder || "ANY"}
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
