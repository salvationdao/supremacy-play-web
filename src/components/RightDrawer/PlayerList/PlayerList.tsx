import { Box, Stack, Typography } from "@mui/material"
import { PlayerListContent } from "../.."
import { SvgUserDiamond2 } from "../../../assets"
import { useChat } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const PlayerList = () => {
    const { activePlayers } = useChat()

    return (
        <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
            <Content activePlayers={activePlayers} />
        </Stack>
    )
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
                backgroundColor: isOpen ? `#1B0313` : `#1c1424`,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceButton
                onClick={onClose}
                buttonColor={theme.factionTheme.primary}
                corners
                sx={{
                    p: ".8rem",
                    pb: ".6rem",
                }}
            >
                <SvgUserDiamond2 size="3rem" />
            </NiceButton>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
                }}
            >
                Active Players
            </Typography>
            <Box flex={1} />
            <Box sx={{ minWidth: ".8rem", minHeight: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
            <Typography>{activePlayers.length} active</Typography>
        </Stack>
    )
}
PlayerList.Header = Header

const Content = ({ activePlayers }: { activePlayers: User[] }) => {
    return (
        <Stack sx={{ flex: 1 }}>
            <Box
                sx={{
                    flex: 1,
                    ml: ".8rem",
                    mr: ".3rem",
                    pr: ".5rem",
                    my: "1rem",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                }}
            >
                <PlayerListContent activePlayers={activePlayers} />
            </Box>
        </Stack>
    )
}
