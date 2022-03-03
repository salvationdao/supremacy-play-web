import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { BarExpandable } from "../.."
import HubKey from "../../../keys"
import { colors } from "../../../theme"
import { UserStat } from "../../../types"
import { GameBarBaseProps } from "../../../GameBar"
import { SvgAbility, SvgApplause, SvgDeath, SvgView, SvgWrapperProps } from "../../../assets"
import { useAuth, useWebsocket } from "../../../containers"
import { useEffect, useState } from "react"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { TooltipHelper } from "../../../.."

const BannerInfo = ({
    title,
    tooltip,
    content,
    PrefixSvg,
}: {
    title: string
    tooltip: string
    content: string
    PrefixSvg?: SvgWrapperProps
}) => {
    return (
        <Box>
            <TooltipHelper text={tooltip}>
                <Typography
                    variant="subtitle2"
                    sx={{ mb: 0.7, lineHeight: 1, whiteSpace: "nowrap", color: colors.grey }}
                >
                    {title}
                </Typography>
            </TooltipHelper>
            <Stack direction="row" alignItems="center" spacing={0.8}>
                {PrefixSvg}
                <Typography variant="subtitle2" sx={{ lineHeight: 1, whiteSpace: "nowrap", color: colors.white }}>
                    {content}
                </Typography>
            </Stack>
        </Box>
    )
}

export const EnlistBanner = (props: GameBarBaseProps) => {
    const { user, userID } = useAuth()
    const { state, subscribe } = useWebsocket()
    const [userStat, setUserStat] = useState<UserStat>({
        id: "",
        totalAbilityTriggered: 0,
        killCount: 0,
        totalVoteCount: 0,
        viewBattleCount: 0,
    })

    // start to subscribe user update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<UserStat>(HubKey.SubscribeUserStat, (us) => {
            if (!us) return
            setUserStat(us)
        })
    }, [userID, subscribe, state])

    if (!user || !user.faction || !userStat) {
        return (
            <Stack alignItems="center" sx={{ width: 130 }}>
                <CircularProgress size={20} />
            </Stack>
        )
    }

    const {
        theme: { primary },
        logoBlobID,
    } = user.faction

    const { totalAbilityTriggered, killCount, totalVoteCount, viewBattleCount } = userStat

    return (
        <BarExpandable
            noDivider
            barName={"enlist"}
            iconComponent={
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logoBlobID})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: primary,
                        borderRadius: 1,
                        border: `${primary} 2px solid`,
                    }}
                />
            }
        >
            <Box
                sx={{
                    mx: 1.5,
                    px: 2.8,
                    height: "100%",
                    background: `${primary}10`,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={3}
                    sx={{
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            height: 4,
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: colors.darkNeonBlue,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logoBlobID})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />
                    <BannerInfo
                        title={`BATTLE VOTES`}
                        tooltip="The number of times you have voted for a battle ability."
                        content={`${totalVoteCount}`}
                        PrefixSvg={<SvgApplause size="12px" />}
                    />

                    <BannerInfo
                        title={`Abilities`}
                        tooltip="The number of abilities you have triggered."
                        content={`${totalAbilityTriggered}`}
                        PrefixSvg={<SvgAbility size="11px" />}
                    />

                    <BannerInfo
                        title={`Kills`}
                        tooltip="The number of times you have killed a War Machine with an ability."
                        content={`${killCount}`}
                        PrefixSvg={<SvgDeath size="11px" />}
                    />

                    <BannerInfo
                        title={`Spectated`}
                        tooltip="The number of battles you have watched."
                        content={`${viewBattleCount}`}
                        PrefixSvg={<SvgView size="11px" />}
                    />
                </Stack>
            </Box>
        </BarExpandable>
    )
}
