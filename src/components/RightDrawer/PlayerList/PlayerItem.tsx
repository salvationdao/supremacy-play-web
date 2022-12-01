import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { UserBanForm } from "../.."
import { useSupremacy } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../Common/TypographyTruncated"

interface PlayerItemProps {
    player: User
    isActive?: boolean
}

const propsAreEqual = (prevProps: PlayerItemProps, nextProps: PlayerItemProps) => {
    return prevProps.isActive === nextProps.isActive && prevProps.player.id === nextProps.player.id
}

export const PlayerItem = React.memo(function PlayerItem({ player, isActive }: PlayerItemProps) {
    const { getFaction } = useSupremacy()

    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const { username, gid, faction_id } = player

    const faction = useMemo(() => getFaction(faction_id), [faction_id, getFaction])

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{ p: ".5rem 1.3rem", opacity: isActive ? 1 : 0.6, backgroundColor: (theme) => theme.factionTheme.s800 }}
            >
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: isActive ? colors.green : colors.yellow }} />

                <Stack direction="row" spacing=".8rem" alignItems="center" sx={{ pt: ".3rem", ml: "1.1rem" }}>
                    <Box
                        sx={{
                            width: "2.8rem",
                            height: "2.8rem",
                            flexShrink: 0,
                            backgroundImage: `url(${faction.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />
                    <TypographyTruncated>
                        {username}#{gid}
                    </TypographyTruncated>
                </Stack>

                <NiceButton sx={{ px: "1rem", py: ".1rem", ml: "auto" }} onClick={() => toggleBanModalOpen()}>
                    <Typography variant="caption" sx={{ color: "#FFFFFF80", fontFamily: fonts.nostromoBold }}>
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
