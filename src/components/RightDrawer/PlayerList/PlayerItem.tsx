import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { UserBanForm } from "../.."
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"

interface PlayerItemProps {
    player: User
    isActive?: boolean
}

const propsAreEqual = (prevProps: PlayerItemProps, nextProps: PlayerItemProps) => {
    return prevProps.isActive === nextProps.isActive && prevProps.player.id === nextProps.player.id
}

export const PlayerItem = React.memo(function PlayerItem({ player, isActive }: PlayerItemProps) {
    const theme = useTheme()
    const { getFaction } = useSupremacy()

    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const { username, gid, faction_id } = player

    const faction = useMemo(() => getFaction(faction_id), [faction_id, getFaction])

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    px: "1.3rem",
                    py: ".5rem",
                    backgroundColor: (theme) => theme.factionTheme.s700,
                    opacity: isActive ? 1 : 0.6,
                }}
            >
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: isActive ? colors.green : colors.yellow }} />

                <Box sx={{ pt: ".3rem", ml: "1.1rem" }}>
                    <Stack direction="row" spacing=".5rem" alignItems="center">
                        <Box
                            sx={{
                                width: "3rem",
                                height: "3rem",
                                flexShrink: 0,
                                backgroundImage: `url(${faction.logo_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />
                        <Typography>
                            {`${username}`}
                            <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${gid}`}</span>
                        </Typography>
                    </Stack>
                </Box>

                <NiceButton sx={{ px: "1rem", py: ".1rem", ml: "auto" }} onClick={() => toggleBanModalOpen()}>
                    <Typography
                        variant="caption"
                        sx={{
                            lineHeight: 1,
                            color: "#FFFFFF80",
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        REPORT
                    </Typography>
                </NiceButton>
            </Stack>

            {banModalOpen && (
                <UserBanForm
                    open={banModalOpen}
                    onClose={() => toggleBanModalOpen(false)}
                    prefillUser={{
                        id: player.id,
                        username: player.username,
                        gid: player.gid,
                    }}
                />
            )}
        </>
    )
}, propsAreEqual)
