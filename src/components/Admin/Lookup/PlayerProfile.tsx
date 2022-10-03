import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { GameServerKeys } from "../../../keys"
import { GetUserResp } from "../../../types/admin"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { PageHeader } from "../../Common/PageHeader"
import { SvgBack, WarMachineIconPNG } from "../../../assets"
import { FancyButton } from "../../Common/FancyButton"
import { colors, fonts } from "../../../theme/theme"
import { useTheme } from "../../../containers/theme"
import { useHistory } from "react-router-dom"
import { useSupremacy } from "../../../containers"


export const PlayerProfile = ({ gid, updateQuery }: { gid: number, updateQuery: (newQuery: {[p: string]: string | undefined}) => void }) => {
    const [userData, setUserData] = useState<GetUserResp>()
    const { send } = useGameServerCommandsUser("/user_commander")

    // When searching for player, update the dropdown list
    useEffect(() => {
        (async () => {
            try {
                const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                    gid: gid,
                })

                if (!resp) return
                setUserData(resp)

            } catch (e) {
                console.error(e)
            } finally {
                // toggleIsLoadingUsers(false)
            }
        })()
    }, [gid, send])

    if (!userData) return <Box></Box>

    return <PlayerProfileInner userData={userData} updateQuery={updateQuery} />
}

const PlayerProfileInner = ({ userData, updateQuery }: { userData: GetUserResp, updateQuery: (newQuery: {[p: string]: string | undefined}) => void }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const faction = useMemo(() => getFaction(userData.user.faction_id), [ getFaction])
    return <Stack sx={{ position: "relative", height: "100%" }}>
        <Stack sx={{ flex: 1 }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "9px",
                    corners: { topLeft: true },
                    opacity: 1,
                    sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                }}
                sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                onClick={() => updateQuery({
                    selectedGID: "",
                })}
            >
                <Stack spacing=".6rem" direction="row" alignItems="center">
                    <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#FFFFFF",
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        GO BACK
                    </Typography>
                </Stack>
            </FancyButton>
            <PageHeader title={userData.user.username} description={`#${userData.user.gid}`}
                        imageUrl={faction.logo_url} imageHeight={"7rem"} imageWidth={"7rem"} primaryColor={faction.primary_color}>
                <Stack spacing="1rem" direction="row" alignItems="center" sx={{ ml: "auto !important", pr: "2rem" }}>
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: colors.red,
                            opacity: 1,
                            border: { borderColor: colors.lightRed, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            Ban Player
                        </Typography>
                    </FancyButton>
                </Stack>
            </PageHeader>


            <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                <Box
                    sx={{
                        ml: "1.9rem",
                        pr: "1.9rem",
                        my: "1rem",
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",

                        "::-webkit-scrollbar": {
                            width: "1rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: theme.factionTheme.primary,
                        },
                    }}
                >

                </Box>
            </Stack>
        </Stack>
    </Stack>
}