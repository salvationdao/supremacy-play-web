import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useStream } from "../../containers"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"

export const StreamSelect = () => {
    const theme = useTheme()
    const { currentStream, changeStream, streamOptions } = useStream()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack direction="row" spacing=".24rem" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                STREAM SERVER:{" "}
            </Typography>

            <Select
                sx={{
                    width: "15rem",
                    borderRadius: 0.5,
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".48rem", pb: 0 },
                }}
                defaultValue={currentStream?.host}
                value={currentStream ? currentStream.host : ""}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            color: secondaryColor,
                            backgroundColor: primaryColor,
                        },
                    },
                    PaperProps: {
                        sx: {
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.5,
                        },
                    },
                }}
            >
                {streamOptions.map((x) => {
                    return (
                        <MenuItem
                            key={x.host}
                            value={x.host}
                            onClick={() => {
                                changeStream(x)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography variant="body2">{x.name}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
