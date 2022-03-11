import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BarExpandable, TooltipHelper } from "../.."
import { SvgAbility, SvgDeath, SvgView, SvgWrapperProps } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useGameServerWebsocket, usePassportServerAuth } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { UserStat } from "../../../types/passport"

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
                    sx={{
                        mb: 0.7,
                        fontFamily: "Nostromo Regular Bold",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        color: colors.grey,
                    }}
                >
                    {title}
                </Typography>
            </TooltipHelper>
            <Stack direction="row" alignItems="center" spacing={0.8}>
                {PrefixSvg}
                <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1, whiteSpace: "nowrap" }}
                >
                    {content}
                </Typography>
            </Stack>
        </Box>
    )
}

export const EnlistBanner = () => {
    const { user, userID } = usePassportServerAuth()
    const { state, subscribe } = useGameServerWebsocket()

    const [userStat, setUserStat] = useState<UserStat>({
        id: "",
        total_ability_triggered: 0,
        kill_count: 0,
        view_battle_count: 0,
    })

    // start to subscribe user update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<UserStat>(GameServerKeys.SubscribeUserStat, (us) => {
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
        logo_blob_id,
    } = user.faction

    const { total_ability_triggered, kill_count, view_battle_count } = userStat

    return (
        <BarExpandable
            noDivider
            barName={"enlist"}
            iconComponent={
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
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
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />

                    <BannerInfo
                        title={`ABILITIES`}
                        tooltip="The number of abilities you have triggered."
                        content={`${total_ability_triggered}`}
                        PrefixSvg={<SvgAbility size="11px" />}
                    />

                    <BannerInfo
                        title={`KILLS`}
                        tooltip="The number of times you have killed a War Machine with an ability."
                        content={`${kill_count}`}
                        PrefixSvg={<SvgDeath size="11px" />}
                    />

                    <BannerInfo
                        title={`SPECTATED`}
                        tooltip="The number of battles you have watched."
                        content={`${view_battle_count}`}
                        PrefixSvg={<SvgView size="11px" />}
                    />
                </Stack>
            </Box>
        </BarExpandable>
    )
}
