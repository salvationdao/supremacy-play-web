import { Box, Button, Stack, Typography } from "@mui/material"
import { useSupremacy } from "../../../containers"
import { timeSinceInWords } from "../../../helpers"
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
import { TooltipHelper } from "../../Common/TooltipHelper"
import { BattleAbilityAlert } from "../../Notifications/Alerts/BattleAbilityAlert"
import { BattleZoneAlert } from "../../Notifications/Alerts/BattleZoneAlert"
import { FactionAbilityAlert } from "../../Notifications/Alerts/FactionAbilityAlert"
import { KillAlert } from "../../Notifications/Alerts/KillAlert"
import { LocationSelectAlert } from "../../Notifications/Alerts/LocationSelectAlert"
import { TextAlert } from "../../Notifications/Alerts/TextAlert"
import { WarMachineAbilityAlert } from "../../Notifications/Alerts/WarMachineAbilityAlert"

export const ReplayEvents = ({ battleReplay, seekToSeconds }: { battleReplay?: BattleReplay; seekToSeconds: (seconds: number) => void }) => {
    const { getFaction } = useSupremacy()

    if (!battleReplay?.events || battleReplay.events.length <= 0) {
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
                    <Stack>
                        {battleReplay.events
                            .filter((event) => !!event)
                            .map((event, i) => {
                                const { timestamp, notification } = event
                                const timeSeconds = battleReplay.started_at ? (timestamp.getTime() - battleReplay.started_at.getTime()) / 1000 : 0
                                const tooltipText = timeSinceInWords(new Date(), new Date(new Date().getTime() + timeSeconds * 1000))
                                let notiRender = <></>

                                switch (notification.type) {
                                    case NotificationType.Text:
                                        notiRender = <TextAlert data={notification.data as string} />
                                        break
                                    case NotificationType.LocationSelect:
                                        notiRender = <LocationSelectAlert data={notification.data as LocationSelectAlertProps} getFaction={getFaction} />
                                        break
                                    case NotificationType.BattleAbility:
                                        notiRender = <BattleAbilityAlert data={notification.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                        break
                                    case NotificationType.FactionAbility:
                                        notiRender = <FactionAbilityAlert data={notification.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                        break
                                    case NotificationType.WarMachineAbility:
                                        notiRender = <WarMachineAbilityAlert data={notification.data as WarMachineAbilityAlertProps} getFaction={getFaction} />
                                        break
                                    case NotificationType.WarMachineDestroyed:
                                        notiRender = <KillAlert data={notification.data as KillAlertProps} getFaction={getFaction} />
                                        break
                                    case NotificationType.BattleZoneChange:
                                        notiRender = <BattleZoneAlert data={notification.data as BattleZoneStruct} />
                                        break
                                }

                                return (
                                    <TooltipHelper key={i} text={tooltipText} placement="left">
                                        <Box>
                                            <Button sx={{ width: "100%", display: "block", textAlign: "start" }} onClick={() => seekToSeconds(timeSeconds)}>
                                                {notiRender}
                                            </Button>
                                        </Box>
                                    </TooltipHelper>
                                )
                            })}
                    </Stack>
                </Box>
            </Box>
        </Stack>
    )
}
