import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useOvenStream } from "../../containers/oven"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"
import { StreamService } from "../../types"

export const OvenStreamSelect = () => {
    const theme = useTheme()
    const { currentOvenStream, changeOvenStream, ovenStreamOptions } = useOvenStream()
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
                    ".MuiTypography-root": {
                        px: ".8rem",
                        pt: ".48rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                }}
                defaultValue={currentOvenStream?.name}
                value={currentOvenStream ? currentOvenStream.name : ""}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: secondaryColor,
                            },
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
                {ovenStreamOptions.map((x) => {
                    return (
                        <MenuItem
                            key={x.name}
                            value={x.name}
                            onClick={() => {
                                changeOvenStream(x)
                                console.log("changing streams")
                            }}
                            sx={{ "&:hover": { backgroundColor: `#FFFFFF30` } }}
                        >
                            <Typography
                                sx={{
                                    lineHeight: 1,
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
