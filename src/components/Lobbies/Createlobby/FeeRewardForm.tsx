import { InputAdornment, Stack, Typography } from "@mui/material"
import { NiceButton } from "../../Common/Nice/NiceButton"
import React from "react"
import { useTheme } from "../../../containers/theme"
import { Section } from "./RoomSettingForm"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { SvgSupToken } from "../../../assets"
import { colors } from "../../../theme/theme"

interface FeeRewardFormProps {
    nextPage: () => void
    prevPage: () => void
}

export const FeeRewardForm = ({ nextPage, prevPage }: FeeRewardFormProps) => {
    const { factionTheme } = useTheme()
    return (
        <Stack direction="column" flex={1} sx={{ px: "25rem", py: "4rem" }}>
            <Stack direction="column" flex={1} spacing="4rem">
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="A" title="ENTRY FEE" description="This will be charged per Mech." />
                    <NiceTextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position={"start"}>
                                    <SvgSupToken size="1.5rem" sx={{ opacity: 0.5 }} fill={colors.gold} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="B" title="WINNING FACTION CUT" description="Set a winning percentage." />
                    <NiceTextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position={"start"}>
                                    <Typography>%</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="C" title="SECOND PLACE FACTION CUT" description="Set a Second place percentage." />
                    <NiceTextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position={"start"}>
                                    <Typography>%</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Section orderLabel="D" title="EXTRA REWARD" description="Set extra rewards to be shared for all the players." />
                    <NiceTextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position={"start"}>
                                    <SvgSupToken size="1.5rem" sx={{ opacity: 0.5 }} fill={colors.gold} />
                                </InputAdornment>
                            ),
                        }}
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
