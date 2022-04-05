import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { BarExpandable, TooltipHelper } from "../.."
import { SvgAbility, SvgBostonKillIcon, SvgDeath, SvgRedMoutainKillIcon, SvgView, SvgWrapperProps, SvgZaibatsuKillIcon } from "../../../assets"
import { colors } from "../../../theme/theme"
import { useGame, useGameServerAuth, usePassportServerAuth } from "../../../containers"
import { UserData } from "../../../types/passport"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { UserRank, UserStat } from "../../../types"
import { getUserRankDeets } from "../../../helpers"

const BannerInfo = ({ title, tooltip, content, PrefixSvg }: { title: string; tooltip: ReactNode; content: string; PrefixSvg?: SvgWrapperProps }) => {
    return (
        <TooltipHelper text={tooltip}>
            <Box>
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

                <Stack direction="row" alignItems="center" spacing=".64rem">
                    {PrefixSvg}
                    <Typography variant="subtitle2" sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1, whiteSpace: "nowrap" }}>
                        {content}
                    </Typography>
                </Stack>
            </Box>
        </TooltipHelper>
    )
}

export const EnlistBanner = () => {
    const { user, userID } = usePassportServerAuth()
    const { userStat, userRank } = useGameServerAuth()
    const { battleIdentifier } = useGame()

    return <EnlistBannerInner user={user} userID={userID} userRank={userRank} battleIdentifier={battleIdentifier} userStat={userStat} />
}

interface PropsInner {
    user?: UserData
    userID?: string
    battleIdentifier?: number
    userStat: UserStat
    userRank?: UserRank
}

const EnlistBannerInner = ({ user, battleIdentifier, userStat, userRank }: PropsInner) => {
    const killIcon = useMemo(() => {
        if (!user) return <SvgDeath size="1.1rem" />

        switch (user.faction_id) {
            case "880db344-e405-428d-84e5-6ebebab1fe6d":
                return <SvgZaibatsuKillIcon size="1.1rem" />
            case "7c6dde21-b067-46cf-9e56-155c88a520e2":
                return <SvgBostonKillIcon size="1.1rem" />
            case "98bf7bb3-1a7c-4f21-8843-458d62884060":
                return <SvgRedMoutainKillIcon size="1.1rem" />
            default:
                return <SvgDeath size="1.1rem" />
        }
    }, [user?.faction_id])

    if (!user || !user.faction || !userStat) {
        return (
            <Stack alignItems="center" sx={{ width: "13rem" }}>
                <CircularProgress size="2rem" />
            </Stack>
        )
    }

    const {
        theme: { primary },
        logo_blob_id,
    } = user.faction

    const { total_ability_triggered, kill_count, view_battle_count, mech_kill_count } = userStat
    const rankDeets = useMemo(() => (userRank ? getUserRankDeets(userRank, ".9rem", "1.1rem") : undefined), [userRank])

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

                    {battleIdentifier != undefined && <BannerInfo title={`BATTLE ID`} tooltip="The current battle." content={`#${battleIdentifier}`} />}

                    <BannerInfo
                        title={`ABILITIES`}
                        tooltip="The number of abilities you have triggered."
                        content={`${total_ability_triggered || 0}`}
                        PrefixSvg={<SvgAbility size="1.1rem" />}
                    />

                    <BannerInfo
                        title={`ABILITY KILLS`}
                        tooltip="The number of times your triggered ability destroyed another war machine. Destroying your own syndicate's war machine will bring your kill count down"
                        content={`${kill_count || 0}`}
                        PrefixSvg={<SvgDeath size="1.1rem" />}
                    />
                    <BannerInfo
                        title={`MECH KILLS`}
                        tooltip="The number of times your queued mech gets a kill."
                        content={`${mech_kill_count || 0}`}
                        PrefixSvg={killIcon}
                    />
                    <BannerInfo
                        title={`SPECTATED`}
                        tooltip="The number of battles you have watched."
                        content={`${view_battle_count || 0}`}
                        PrefixSvg={<SvgView size="1.1rem" />}
                    />
                    {userRank && rankDeets && <BannerInfo title={`RANK`} tooltip={rankDeets.desc} content={rankDeets.title} PrefixSvg={rankDeets.icon} />}
                </Stack>
            </Box>
        </BarExpandable>
    )
}
