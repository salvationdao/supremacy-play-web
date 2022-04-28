import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { BarExpandable, TooltipHelper } from "../.."
import { SvgAbility, SvgBostonKillIcon, SvgDeath, SvgRedMoutainKillIcon, SvgView, SvgWrapperProps, SvgZaibatsuKillIcon } from "../../../assets"
import { colors, fonts } from "../../../theme/theme"
import { useSupremacy, useGameServerAuth, FactionsAll } from "../../../containers"
import { FactionIDs, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { User, UserRank, UserStat } from "../../../types"
import { getUserRankDeets } from "../../../helpers"

export const EnlistBanner = () => {
    const { user, userStat, userRank } = useGameServerAuth()
    const { battleIdentifier, factionsAll } = useSupremacy()

    return <EnlistBannerInner user={user} userRank={userRank} battleIdentifier={battleIdentifier} factionsAll={factionsAll} userStat={userStat} />
}

interface PropsInner {
    user?: User
    battleIdentifier?: number
    factionsAll?: FactionsAll
    userStat: UserStat
    userRank?: UserRank
}

const EnlistBannerInner = ({ user, battleIdentifier, factionsAll, userStat, userRank }: PropsInner) => {
    const { total_ability_triggered, ability_kill_count, last_seven_days_kills, view_battle_count, mech_kill_count } = userStat
    const rankDeets = useMemo(() => (userRank ? getUserRankDeets(userRank, ".9rem", "1.1rem") : undefined), [userRank])

    const killIcon = useMemo(() => {
        if (!user) return <SvgDeath size="1.1rem" />

        switch (user.faction_id) {
            case FactionIDs.ZHI:
                return <SvgZaibatsuKillIcon size="1.1rem" />
            case FactionIDs.BC:
                return <SvgBostonKillIcon size="1.1rem" />
            case FactionIDs.RM:
                return <SvgRedMoutainKillIcon size="1.1rem" />
            default:
                return <SvgDeath size="1.1rem" />
        }
    }, [user?.faction_id])

    if (!user || !user.faction || !factionsAll || !userStat) {
        return (
            <Stack alignItems="center" sx={{ width: "13rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
            </Stack>
        )
    }

    const {
        theme: { primary },
    } = user.faction

    return (
        <BarExpandable
            noDivider
            barName={"enlist"}
            iconComponent={
                <Box
                    sx={{
                        width: "2.8rem",
                        height: "2.8rem",
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[user.faction_id]?.logo_blob_id})`,
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
                id="tutorial-enlisted"
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
                            height: ".3rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#FFFFFF50",
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: "3.8rem",
                            height: "3.8rem",
                            flexShrink: 0,
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[user.faction_id]?.logo_blob_id})`,
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
                        title={`MECH KILLS`}
                        tooltip="The number of times your queued mech gets a kill."
                        content={`${mech_kill_count || 0}`}
                        PrefixSvg={killIcon}
                    />
                    <BannerInfo
                        title={`ABILITY KILLS`}
                        tooltip="The number of times your triggered ability destroyed another war machine. Destroying your own syndicate's war machine will bring down your kill count. The count shows the lifetime total and the total from the past 7 days."
                        content={`${ability_kill_count || 0} | ${last_seven_days_kills || 0}`}
                        PrefixSvg={<SvgDeath size="1.1rem" />}
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

const BannerInfo = ({ title, tooltip, content, PrefixSvg }: { title: string; tooltip: ReactNode; content: string; PrefixSvg?: SvgWrapperProps }) => {
    return (
        <TooltipHelper text={tooltip}>
            <Box>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: ".56rem",
                        fontFamily: fonts.nostromoBold,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        color: colors.grey,
                    }}
                >
                    {title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing=".64rem">
                    {PrefixSvg}
                    <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                        {content}
                    </Typography>
                </Stack>
            </Box>
        </TooltipHelper>
    )
}
