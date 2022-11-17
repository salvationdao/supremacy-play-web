import { Box } from "@mui/material"
import { useArena } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"

export const ArenaSelector = () => {
    const { factionTheme } = useTheme()
    const { arenaList, currentArena, setCurrentArena } = useArena()

    return (
        <>
            {arenaList.map((a, index) => (
                <NiceButton
                    key={index}
                    fill={a.id === currentArena?.id}
                    buttonColor={factionTheme.primary}
                    onClick={() => {
                        setCurrentArena((prev) => arenaList.find((a1) => a1.id === a.id) || prev)
                    }}
                    sx={{
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "space-between",
                        fontFamily: fonts.nostromoBlack,
                        fontSize: a.id === currentArena?.id ? "3rem" : "1.6rem",
                    }}
                >
                    <Box component="span">{a.name}</Box>
                    <Box
                        component="span"
                        sx={{
                            fontFamily: fonts.nostromoMedium,
                            fontSize: "1rem",
                            color: colors.lightGrey,
                        }}
                    >
                        {a.state}
                    </Box>
                </NiceButton>
            ))}
        </>
    )
}
