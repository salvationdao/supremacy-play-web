import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { OVENPLAYER_STREAM } from "../../constants"
import { useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const StreamSelect = () => {
    const { currentStream, changeStream, streamOptions } = useStream()

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
                            backgroundColor: colors.darkerNeonBlue,
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
                            sx={{
                                color: x.name === OVENPLAYER_STREAM ? "#E4E455" : "",
                                "&:hover": {
                                    backgroundColor: colors.darkNavyBlue,
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: x.name === OVENPLAYER_STREAM ? "#E4E455" : "",
                                    fontWeight: x.name === OVENPLAYER_STREAM ? "bold" : "",
                                }}
                                variant="body2"
                            >
                                {x.name}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
