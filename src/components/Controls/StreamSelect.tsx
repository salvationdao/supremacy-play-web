import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const StreamSelect = () => {
    const { currentStream, changeStream, streamOptions } = useStream()

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                STREAM SERVER:{" "}
            </Typography>

            <Select
                sx={{
                    width: 150,
                    borderRadius: 0.5,
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    "& .MuiSelect-outlined": { px: 1, pt: 0.6, pb: 0 },
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
                                "&:hover": {
                                    backgroundColor: colors.darkNavyBlue,
                                },
                            }}
                        >
                            <Typography variant="body2">{x.name}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
