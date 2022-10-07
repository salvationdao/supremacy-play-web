import { Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { ClipThing } from "../../Common/ClipThing"
import { fonts } from "../../../theme/theme"

export const InvolvedBattleLobbies = () => {
    const { factionTheme } = useTheme()
    return (
        <>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    topLeft: true,
                    bottomRight: true,
                    bottomLeft: true,
                }}
                opacity={0.9}
                backgroundColor={factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack direction="column" sx={{ position: "relative", height: "100%", width: "35rem" }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: "5rem",
                            backgroundColor: factionTheme.primary,
                            borderBottom: `${factionTheme.primary} 2px solid`,
                        }}
                    >
                        <Typography color={factionTheme.secondary} fontFamily={fonts.nostromoBlack}>
                            Your Lobbies
                        </Typography>
                    </Stack>
                    <InvolvedLobbyCard />
                </Stack>
            </ClipThing>
        </>
    )
}

export const InvolvedLobbyCard = () => {
    const { factionTheme } = useTheme()
    return (
        <Stack
            sx={{
                backgroundColor: factionTheme.background,
                border: `${factionTheme.primary}99 2px solid`,
                width: "100%",
                height: "10rem",
                borderRadius: 0.8,
            }}
        ></Stack>
    )
}
