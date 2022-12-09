import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { NiceTooltip, PlayerItem } from "../.."
import { SvgUserDiamond2 } from "../../../assets"
import { useChat } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { VirtualizedGrid } from "../../Common/VirtualizedGrid"

export const PlayerList = () => {
    const { activePlayers } = useChat()

    const renderIndex = useCallback(
        (index) => {
            const player = activePlayers[index]
            if (!player) {
                return null
            }
            return <PlayerItem key={`active-player-${player.id}`} player={player} isActive />
        },
        [activePlayers],
    )

    const content = useMemo(() => {
        if (activePlayers.length === 0) {
            return (
                <Stack justifyContent="center" height="100%">
                    <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                        No lobby is ready
                    </Typography>
                </Stack>
            )
        }

        return (
            <VirtualizedGrid
                uniqueID="active-players"
                itemWidthConfig={{ columnCount: 1 }}
                itemHeight={4.7}
                totalItems={activePlayers.length}
                renderIndex={renderIndex}
            />
        )
    }, [activePlayers.length, renderIndex])

    return <Box sx={{ width: "100%", height: "100%", p: "1rem" }}>{content}</Box>
}

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const { activePlayers } = useChat()

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s500}70 26%, ${theme.factionTheme.s600})` : theme.factionTheme.u700,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="Active Players" placement="left">
                <NiceButton
                    onClick={onClose}
                    buttonColor={theme.factionTheme.primary}
                    corners
                    sx={{
                        p: ".8rem",
                        pb: ".6rem",
                    }}
                >
                    <SvgUserDiamond2 size="2.6rem" />
                </NiceButton>
            </NiceTooltip>

            <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.6rem" }}>Active Players</Typography>

            <Box flex={1} />

            <Box sx={{ minWidth: ".8rem", minHeight: ".8rem", borderRadius: "50%", backgroundColor: activePlayers.length > 0 ? colors.green : colors.grey }} />
            <Typography>{activePlayers.length} active</Typography>
        </Stack>
    )
}
PlayerList.Header = Header
