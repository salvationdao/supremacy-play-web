import { Box, Button, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { timeSinceInWords } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import {
    BattleFactionAbilityAlertProps,
    BattleReplay,
    BattleZoneStruct,
    KillAlertProps,
    LocationSelectAlertProps,
    NotificationType,
    ReplayEvent,
    WarMachineAbilityAlertProps,
} from "../../../types"
import { BattleAbilityAlert } from "../../Notifications/Alerts/BattleAbilityAlert"
import { BattleZoneAlert } from "../../Notifications/Alerts/BattleZoneAlert"
import { FactionAbilityAlert } from "../../Notifications/Alerts/FactionAbilityAlert"
import { KillAlert } from "../../Notifications/Alerts/KillAlert"
import { LocationSelectAlert } from "../../Notifications/Alerts/LocationSelectAlert"
import { TextAlert } from "../../Notifications/Alerts/TextAlert"
import { WarMachineAbilityAlert } from "../../Notifications/Alerts/WarMachineAbilityAlert"

export const ReplayEvents = ({ battleReplay, seekToSeconds }: { battleReplay?: BattleReplay; seekToSeconds: (seconds: number) => void }) => {
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
                    <Stack spacing="1rem">
                        {battleReplay.events
                            .filter((replayEvent) => !!replayEvent)
                            .map((replayEvent, i) => (
                                <EventItem key={i} battleReplay={battleReplay} seekToSeconds={seekToSeconds} replayEvent={replayEvent} />
                            ))}
                    </Stack>
                </Box>
            </Box>
        </Stack>
    )
}

interface EventItemProps {
    battleReplay: BattleReplay
    seekToSeconds: (seconds: number) => void
    replayEvent: ReplayEvent
}

const propsAreEqual = (prevProps: EventItemProps, nextProps: EventItemProps) => {
    return (
        prevProps.battleReplay.id === nextProps.battleReplay.id &&
        prevProps.replayEvent.timestamp === nextProps.replayEvent.timestamp &&
        prevProps.replayEvent.notification.type === nextProps.replayEvent.notification.type
    )
}

const EventItem = React.memo(function EventItem({ battleReplay, seekToSeconds, replayEvent }: EventItemProps) {
    const { getFaction } = useSupremacy()

    const { timestamp, notification } = replayEvent
    const timeSeconds = battleReplay.started_at ? (timestamp.getTime() - battleReplay.started_at.getTime()) / 1000 : 0
    const tooltipText = timeSinceInWords(new Date(), new Date(new Date().getTime() + timeSeconds * 1000))

    const content = useMemo(() => {
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

        return notiRender
    }, [getFaction, notification.data, notification.type])

    return (
        <Stack alignItems="flex-start">
            <Typography variant="caption" sx={{ px: ".6rem", borderRadius: 0.3, backgroundColor: `${colors.darkNavy}AA` }}>
                {tooltipText}
            </Typography>
            <Button sx={{ p: 0, width: "100%", display: "block", textAlign: "start" }} onClick={() => seekToSeconds(timeSeconds)}>
                {content}
            </Button>
        </Stack>
    )
}, propsAreEqual)
