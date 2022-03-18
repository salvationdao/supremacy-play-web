import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BarExpandable, TooltipHelper } from "../.."
import { SvgAbility, SvgDeath, SvgView, SvgWrapperProps } from "../../../assets"
import { colors } from "../../../theme/theme"
import { useGame, useGameServerWebsocket, usePassportServerAuth, WebSocketProperties } from "../../../containers"
import { UserData, UserStat } from "../../../types/passport"
import { GameServerKeys } from "../../../keys"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"

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
                        mb: ".56rem",
                        fontFamily: "Nostromo Regular Bold",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        color: colors.grey,
                    }}
                >
                    {title}
                </Typography>
            </TooltipHelper>
            <Stack direction="row" alignItems="center" spacing=".64rem">
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
    const { battleIdentifier } = useGame()

    return (
        <EnlistBannerInner
            state={state}
            subscribe={subscribe}
            user={user}
            userID={userID}
            battleIdentifier={battleIdentifier}
        />
    )
}

interface PropsInner extends Partial<WebSocketProperties> {
    user?: UserData
    userID?: string
    battleIdentifier?: number
}

const EnlistBannerInner = ({ state, subscribe, user, userID, battleIdentifier }: PropsInner) => {
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
            <Stack alignItems="center" sx={{ width: "13rem" }}>
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
                        width: "2.8rem",
                        height: "2.8rem",
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
                    mx: "1.2rem",
                    px: "2.24rem",
                    height: "100%",
                    background: `${primary}10`,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="2.4rem"
                    sx={{
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            height: ".4rem",
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
                            width: "3.8rem",
                            height: "3.8rem",
                            flexShrink: 0,
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />

                    {battleIdentifier != undefined && (
                        <BannerInfo
                            title={`BATTLE ID`}
                            tooltip="The current battle."
                            content={`#${battleIdentifier}`}
                        />
                    )}

                    <BannerInfo
                        title={`ABILITIES`}
                        tooltip="The number of abilities you have triggered."
                        content={`${total_ability_triggered}`}
                        PrefixSvg={<SvgAbility size="1.1rem" />}
                    />

                    <BannerInfo
                        title={`KILLS`}
                        tooltip="The number of times your triggered ability or your deployed war machine has destroyed another war machine."
                        content={`${kill_count}`}
                        PrefixSvg={<SvgDeath size="1.1rem" />}
                    />

                    <BannerInfo
                        title={`SPECTATED`}
                        tooltip="The number of battles you have watched."
                        content={`${view_battle_count}`}
                        PrefixSvg={<SvgView size="1.1rem" />}
                    />
                </Stack>
            </Box>
        </BarExpandable>
    )
}
