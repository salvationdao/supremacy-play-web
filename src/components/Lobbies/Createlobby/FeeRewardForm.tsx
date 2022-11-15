import { InputAdornment, Stack, Typography } from "@mui/material"
import { NiceButton } from "../../Common/Nice/NiceButton"
import React from "react"
import { useTheme } from "../../../containers/theme"
import { Section } from "./RoomSettingForm"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { SvgSupToken } from "../../../assets"
import { colors, fonts } from "../../../theme/theme"
import { Controller, useFormContext } from "react-hook-form"

interface FeeRewardFormProps {
    nextPage: () => void
    prevPage: () => void
}

export const FeeRewardForm = ({ nextPage, prevPage }: FeeRewardFormProps) => {
    const { factionTheme } = useTheme()
    const { control } = useFormContext()
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
                                    sx: { minHeight: "4.5rem" },
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <SvgSupToken size="1.8rem" fill={colors.gold} />
                                        </InputAdornment>
                                    ),
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
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    sx: { minHeight: "4.5rem" },
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <Typography fontFamily={fonts.shareTech}>%</Typography>
                                        </InputAdornment>
                                    ),
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
                                type="number"
                                primaryColor={factionTheme.primary}
                                InputProps={{
                                    sx: { minHeight: "4.5rem" },
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <Typography fontFamily={fonts.shareTech}>%</Typography>
                                        </InputAdornment>
                                    ),
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
                                    sx: { minHeight: "4.5rem" },
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <SvgSupToken size="1.8rem" fill={colors.gold} />
                                        </InputAdornment>
                                    ),
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
