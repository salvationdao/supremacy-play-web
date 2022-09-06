import { StreamPlayerApi } from "@cloudflare/stream-react"
import { Box, Button, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { useSupremacy } from "../../../containers"
import { timeSinceInWords } from "../../../helpers"
import { useInterval } from "../../../hooks"
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

export const ReplayEvents = ({
    battleReplay,
    seekToSeconds,
    streamRef,
}: {
    battleReplay?: BattleReplay
    seekToSeconds: (seconds: number) => void
    streamRef: React.MutableRefObject<StreamPlayerApi | undefined>
}) => {
    const [videoTime, setVideoTime] = useState(0)

    useInterval(() => {
        setVideoTime(streamRef.current?.currentTime || 0)
    }, 1000)

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
                            .map((replayEvent, i) => {
                                const timeSeconds = battleReplay.started_at ? (replayEvent.timestamp.getTime() - battleReplay.started_at.getTime()) / 1000 : 0
                                const isPassed = videoTime > timeSeconds

                                return (
                                    <EventItem key={i} seekToSeconds={seekToSeconds} replayEvent={replayEvent} timeSeconds={timeSeconds} isPassed={isPassed} />
                                )
                            })}
                    </Stack>
                </Box>
            </Box>
        </Stack>
    )
}

interface EventItemProps {
    seekToSeconds: (seconds: number) => void
    replayEvent: ReplayEvent
    timeSeconds: number
    isPassed: boolean
}

const propsAreEqual = (prevProps: EventItemProps, nextProps: EventItemProps) => {
    return (
        prevProps.replayEvent.timestamp === nextProps.replayEvent.timestamp &&
        prevProps.replayEvent.notification.type === nextProps.replayEvent.notification.type &&
        prevProps.timeSeconds === nextProps.timeSeconds &&
        prevProps.isPassed === nextProps.isPassed
    )
}

const EventItem = React.memo(function EventItem({ seekToSeconds, replayEvent, timeSeconds, isPassed }: EventItemProps) {
    const { getFaction } = useSupremacy()

    const { notification } = replayEvent
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
        <Stack alignItems="flex-start" sx={{ opacity: isPassed ? 0.25 : 1 }}>
            <Typography variant="caption" sx={{ px: ".6rem", borderRadius: 0.3, backgroundColor: `${colors.darkNavy}AA` }}>
                {tooltipText}
            </Typography>
            <Button sx={{ p: 0, width: "100%", display: "block", textAlign: "start" }} onClick={() => seekToSeconds(Math.max(timeSeconds - 5, 0))}>
                {content}
            </Button>
        </Stack>
    )
}, propsAreEqual)
