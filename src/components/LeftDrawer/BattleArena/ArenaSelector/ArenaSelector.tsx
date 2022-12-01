import { Box, Typography } from "@mui/material"
import { useArena } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const ArenaSelector = () => {
    const { factionTheme } = useTheme()
    const { arenaList, currentArena, setCurrentArena } = useArena()

    return (
        <>
            {arenaList.map((a, index) => (
                <NiceButton
                    key={index}
                    fill={a.id === currentArena?.id}
                    flat
                    buttonColor={factionTheme.primary}
                    onClick={() => {
                        setCurrentArena((prev) => arenaList.find((a1) => a1.id === a.id) || prev)
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <TypographyTruncated sx={{ fontFamily: fonts.nostromoBlack }}>{a.name}</TypographyTruncated>

                    <Box flex={1} />

                    <Typography variant="subtitle1" sx={{ fontFamily: fonts.nostromoBold }}>
                        {a.state}
                    </Typography>
                </NiceButton>
            ))}
        </>
    )
}
