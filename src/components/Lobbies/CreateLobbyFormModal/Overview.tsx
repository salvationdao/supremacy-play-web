import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { UseFormReturn } from "react-hook-form"
import { SvgContentCopyIcon, SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { camelToTitle } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { CreateLobbyFormFields, Scheduling } from "./CreateLobbyFormModal"
import { FormField } from "./FormField"
import { InviteUserItem } from "./InviteFriends"

export const Overview = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()

    const {
        // Step 1
        accessibility,
        access_code,
        name,
        max_deploy_number,
        game_map,
        scheduling_type,
        wont_start_until_date,
        wont_start_until_time,

        // Step 2
        entry_fee,
        first_faction_cut,
        second_faction_cut,
        extra_reward,

        // Step 3
        selected_mechs,

        // Step 4
        invited_user,
    } = formMethods.watch()

    return (
        <Fade in>
            <Stack spacing="2rem">
                <Typography variant="h4">Overview</Typography>

                <FormField label="Accessibility">
                    <Stack direction="row" alignItems="center" spacing="1rem">
                        <NiceTextField primaryColor={theme.factionTheme.primary} value={accessibility} disabled sx={{ flex: 1 }} />

                        {access_code && (
                            <NiceTextField
                                primaryColor={theme.factionTheme.primary}
                                value={access_code}
                                disabled
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            size="small"
                                            sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${location.origin}/lobbies?code=${access_code}`)
                                            }}
                                        >
                                            <SvgContentCopyIcon inline size="1.3rem" />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ flex: 1 }}
                            />
                        )}
                    </Stack>
                </FormField>

                <FormField label="Lobby Name">
                    <NiceTextField primaryColor={theme.factionTheme.primary} value={name} disabled placeholder="Will use default name" />
                </FormField>

                <FormField label="Max mech deploys per player">
                    <NiceTextField primaryColor={theme.factionTheme.primary} value={max_deploy_number} disabled />
                </FormField>

                <FormField label="Map">
                    <NiceTextField primaryColor={theme.factionTheme.primary} value={camelToTitle(game_map?.name || "Random")} disabled />
                </FormField>

                <FormField label="Scheduled time">
                    <Stack>
                        <NiceTextField
                            primaryColor={theme.factionTheme.primary}
                            value={scheduling_type === Scheduling.OnReady ? "When room is full" : "Custom date & time"}
                            disabled
                        />

                        {scheduling_type === Scheduling.SetTime && (
                            <Stack direction="row" alignItems="center" spacing="1.3rem" pt="1.6rem" sx={{ "& > *": { flex: 1 } }}>
                                <NiceTextField primaryColor={theme.factionTheme.primary} type="date" value={wont_start_until_date.toString()} disabled />
                                <NiceTextField primaryColor={theme.factionTheme.primary} type="time" value={wont_start_until_time.toString()} disabled />
                            </Stack>
                        )}
                    </Stack>
                </FormField>

                <FormField label="Entry fee">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={entry_fee}
                        disabled
                        InputProps={{
                            startAdornment: <SvgSupToken fill={colors.gold} size="1.5rem" />,
                        }}
                    />
                </FormField>

                <FormField label="Champion winning payout %">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={first_faction_cut}
                        disabled
                        InputProps={{
                            startAdornment: <Typography>%</Typography>,
                        }}
                    />
                </FormField>

                <FormField label="Runner up winning payout %">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={second_faction_cut}
                        disabled
                        InputProps={{
                            startAdornment: <Typography>%</Typography>,
                        }}
                    />
                </FormField>

                <FormField label="Extra payout for all players">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={extra_reward}
                        disabled
                        InputProps={{
                            startAdornment: <SvgSupToken fill={colors.gold} size="1.5rem" />,
                        }}
                    />
                </FormField>

                {selected_mechs.length > 0 && (
                    <FormField label={`Deploying ${selected_mechs.length} ${selected_mechs.length === 1 ? "mech" : "mechs"}`}>
                        <Stack gap="1.4rem" direction="row" flexWrap="wrap" pt=".2rem">
                            {selected_mechs.map((mech) => (
                                <Box
                                    key={`mech-${mech.id}`}
                                    sx={{
                                        width: "6rem",
                                        height: "6rem",
                                        background: `url(${mech.avatar_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        border: "#FFFFFF15 1px solid",
                                    }}
                                />
                            ))}
                        </Stack>
                    </FormField>
                )}

                {invited_user.length > 0 && (
                    <FormField label={`Inviting ${invited_user.length} ${invited_user.length === 1 ? "friend" : "friends"}`}>
                        <Stack gap="1.4rem" direction="row" flexWrap="wrap" pt=".2rem">
                            {invited_user.map((user) => (
                                <NiceBoxThing key={`user-${user.id}`}>
                                    <InviteUserItem user={user} />
                                </NiceBoxThing>
                            ))}
                        </Stack>
                    </FormField>
                )}
            </Stack>
        </Fade>
    )
}
