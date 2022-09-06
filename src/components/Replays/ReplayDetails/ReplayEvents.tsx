import { Box, Stack, Typography } from "@mui/material"
import { useSupremacy } from "../../../containers"
import { fonts } from "../../../theme/theme"
import {
    BattleFactionAbilityAlertProps,
    BattleReplay,
    BattleZoneStruct,
    KillAlertProps,
    LocationSelectAlertProps,
    NotificationType,
    WarMachineAbilityAlertProps,
} from "../../../types"
import { BattleAbilityAlert } from "../../Notifications/Alerts/BattleAbilityAlert"
import { BattleZoneAlert } from "../../Notifications/Alerts/BattleZoneAlert"
import { FactionAbilityAlert } from "../../Notifications/Alerts/FactionAbilityAlert"
import { KillAlert } from "../../Notifications/Alerts/KillAlert"
import { LocationSelectAlert } from "../../Notifications/Alerts/LocationSelectAlert"
import { TextAlert } from "../../Notifications/Alerts/TextAlert"
import { WarMachineAbilityAlert } from "../../Notifications/Alerts/WarMachineAbilityAlert"

export const ReplayEvents = ({ battleReplay }: { battleReplay?: BattleReplay }) => {
    const { getFaction } = useSupremacy()

    if (!battleReplay || battleReplay.events.length <= 0) {
        return null
    }

    return (
        <Stack
            spacing="1rem"
            sx={{
                height: "65rem",
                p: "1.8rem 2rem",
                backgroundColor: "#00000070",
            }}
        >
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE EVENTS</Typography>

            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: ".8rem",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: "1rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                    },
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack spacing=".8rem">
                        {battleReplay.events
                            .filter((event) => !!event)
                            .map((event, i) => {
                                const { notification } = event

                                switch (notification.type) {
                                    case NotificationType.Text:
                                        return <TextAlert key={i} data={notification.data as string} />
                                    case NotificationType.LocationSelect:
                                        return <LocationSelectAlert key={i} data={notification.data as LocationSelectAlertProps} getFaction={getFaction} />
                                    case NotificationType.BattleAbility:
                                        return <BattleAbilityAlert key={i} data={notification.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                    case NotificationType.FactionAbility:
                                        return (
                                            <FactionAbilityAlert key={i} data={notification.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                        )
                                    case NotificationType.WarMachineAbility:
                                        return (
                                            <WarMachineAbilityAlert key={i} data={notification.data as WarMachineAbilityAlertProps} getFaction={getFaction} />
                                        )
                                    case NotificationType.WarMachineDestroyed:
                                        return <KillAlert key={i} data={notification.data as KillAlertProps} getFaction={getFaction} />
                                    case NotificationType.BattleZoneChange:
                                        return <BattleZoneAlert key={i} data={notification.data as BattleZoneStruct} />
                                }
                            })}
                    </Stack>
                </Box>
            </Box>
        </Stack>
    )
}
