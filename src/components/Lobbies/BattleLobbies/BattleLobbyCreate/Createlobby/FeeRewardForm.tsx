import { InputAdornment, Stack, Typography } from "@mui/material"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import React from "react"
import { useTheme } from "../../../../../containers/theme"
import { Section } from "./RoomSettingForm"
import { NiceTextField } from "../../../../Common/Nice/NiceTextField"
import { SvgSupToken } from "../../../../../assets"
import { colors, fonts } from "../../../../../theme/theme"
import { Controller, useFormContext } from "react-hook-form"
import { LobbyForm } from "./CreateLobby"

interface FeeRewardFormProps {
    nextPage: () => void
    prevPage: () => void
}

export const FeeRewardForm = ({ nextPage, prevPage }: FeeRewardFormProps) => {
    const { factionTheme } = useTheme()
    const { control, watch } = useFormContext()
    const firstFactionCut: string = watch("first_faction_cut")
    const secondFactionCut: string = watch("second_faction_cut")
    return (
        <Stack direction="column" flex={1} sx={{ px: "25rem", py: "4rem" }}>
            <Stack direction="column" flex={1} spacing="4rem">
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="A" title="ENTRY FEE" description="This will be charged per Mech." />
                    <Controller
                        name="entry_fee"
                        control={control}
                        render={({ field }) => (
                            <NiceTextField
                                {...field}
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <SvgSupToken size="1.8rem" fill={colors.gold} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    height: "4.5rem",
                                    ".MuiOutlinedInput-root": {
                                        py: 0,
                                        height: "4.5rem",
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="B" title="WINNING FACTION CUT" description="Set a winning percentage." />
                    <Controller
                        name="first_faction_cut"
                        control={control}
                        render={({ field }) => (
                            <NiceTextField
                                {...field}
                                value={field.value}
                                onChange={(e) => {
                                    const v = parseFloat(e)
                                    const sfc = parseFloat(secondFactionCut)
                                    if (isNaN(v) || isNaN(sfc) || v + sfc > 100) return

                                    field.onChange(e)
                                }}
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <Typography fontFamily={fonts.rajdhaniMedium}>%</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    height: "4.5rem",
                                    ".MuiOutlinedInput-root": {
                                        py: 0,
                                        height: "4.5rem",
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="C" title="SECOND PLACE FACTION CUT" description="Set a Second place percentage." />
                    <Controller
                        name="second_faction_cut"
                        control={control}
                        render={({ field }) => (
                            <NiceTextField
                                {...field}
                                value={field.value}
                                onChange={(e) => {
                                    const v = parseFloat(e)
                                    const ffc = parseFloat(firstFactionCut)
                                    if (isNaN(v) || isNaN(ffc) || v + ffc > 100) return

                                    field.onChange(e)
                                }}
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <Typography fontFamily={fonts.rajdhaniMedium}>%</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    height: "4.5rem",
                                    ".MuiOutlinedInput-root": {
                                        py: 0,
                                        height: "4.5rem",
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="D" title="EXTRA REWARD" description="Set extra rewards to be shared for all the players." />
                    <Controller
                        name="extra_reward"
                        control={control}
                        render={({ field }) => (
                            <NiceTextField
                                {...field}
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <SvgSupToken size="1.8rem" fill={colors.gold} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    height: "4.5rem",
                                    ".MuiOutlinedInput-root": {
                                        py: 0,
                                        height: "4.5rem",
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
            </Stack>
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
                    onClick={() => nextPage()}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    next
                </NiceButton>
            </Stack>
        </Stack>
    )
}
