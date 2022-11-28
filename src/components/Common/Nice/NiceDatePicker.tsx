import { TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"

interface NiceDatePickerProps {
    value: Date | null
    onChange: (v: Date | null) => void
    enableYear?: boolean
    disabled?: boolean
}

export const NiceDatePicker = ({ value, onChange, enableYear, disabled }: NiceDatePickerProps) => {
    const { factionTheme } = useTheme()

    return (
        <DatePicker
            inputFormat={"DD/MM/YYYY"}
            value={value || null}
            onChange={onChange}
            minDate={new Date()}
            disabled={disabled}
            OpenPickerButtonProps={{
                sx: {
                    color: factionTheme.primary,
                    p: 0,
                    mr: 0,
                    "& .MuiSvgIcon-root": {
                        mr: ".5rem",
                        fontSize: "2rem",
                    },
                },
            }}
            PaperProps={{
                sx: {
                    ".MuiCalendarPicker-root": {
                        borderRadius: 0.8,
                        border: `${factionTheme.s600} 2px solid`,
                        backgroundColor: factionTheme.background,
                        ".MuiPickersCalendarHeader-root": {
                            mt: 0,
                            maxHeight: "unset",
                            py: "2rem",
                            borderBottom: `${factionTheme.s600} 2px solid`,
                            ".MuiPickersCalendarHeader-labelContainer": {
                                ".MuiPickersFadeTransitionGroup-root": {
                                    ".MuiPickersCalendarHeader-label": {
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                        color: factionTheme.text,
                                        fontFamily: fonts.nostromoBlack,
                                    },
                                },
                                ".MuiPickersCalendarHeader-switchViewButton": {
                                    ".MuiPickersCalendarHeader-switchViewIcon": {
                                        fontSize: "2.5rem",
                                        display: !enableYear ? "none" : undefined,
                                    },
                                },
                            },
                            ".MuiPickersArrowSwitcher-root": {
                                ".MuiPickersArrowSwitcher-button": {
                                    ".MuiSvgIcon-root": {
                                        fontSize: "2.5rem",
                                        fontWeight: "bold",
                                    },
                                },
                            },
                        },
                        ".MuiDayPicker-header": {
                            span: {
                                color: factionTheme.primary,
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                fontFamily: fonts.nostromoBlack,
                            },
                        },
                        ".MuiDayPicker-weekContainer": {
                            "& .MuiPickersDay-root": {
                                color: factionTheme.text,
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: `${factionTheme.s800}`,
                                borderColor: `${factionTheme.s800}`,
                                ":hover, :focus, :active": {
                                    backgroundColor: factionTheme.primary,
                                    borderColor: factionTheme.primary,
                                },
                            },
                        },

                        ".MuiCalendarPicker-viewTransitionContainer": {
                            ".MuiYearPicker-root": {
                                ".PrivatePickersYear-root": {
                                    ".PrivatePickersYear-yearButton": {
                                        fontSize: "1.75rem",
                                        fontWeight: "bold",
                                        ":hover, :focus, :active": {
                                            backgroundColor: `${factionTheme.s600}`,
                                            color: factionTheme.text,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    hiddenLabel
                    fullWidth
                    sx={{
                        ".MuiOutlinedInput-root": {
                            pr: 0,
                            border: `${factionTheme.s600} 2px dashed`,
                        },
                        ".MuiOutlinedInput-input": {
                            pl: "1.5rem",
                            py: "0",
                            height: "3.6rem",
                            fontSize: "2rem",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        ...params.sx,
                    }}
                />
            )}
        />
    )
}
