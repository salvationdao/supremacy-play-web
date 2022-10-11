import { DatePicker } from "@mui/x-date-pickers"
import { useTheme } from "../../containers/theme"
import moment from "moment"
import React from "react"
import { TextField } from "@mui/material"
import { fonts } from "../../theme/theme"

interface FactionBasedDatePickerProps {
    value: moment.Moment | null
    onChange: (v: moment.Moment | null) => void
    enableYear?: boolean
    disabled?: boolean
}

export const FactionBasedDatePicker = ({ value, onChange, enableYear, disabled }: FactionBasedDatePickerProps) => {
    const { factionTheme } = useTheme()

    return (
        <DatePicker
            inputFormat={"DD/MM/YYYY"}
            value={value || null}
            onChange={onChange}
            minDate={moment()}
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
                        border: `${factionTheme.primary}99 2px solid`,
                        backgroundColor: factionTheme.background,
                        ".MuiPickersCalendarHeader-root": {
                            mt: 0,
                            maxHeight: "unset",
                            py: "2rem",
                            borderBottom: `${factionTheme.primary}99 2px solid`,
                            ".MuiPickersCalendarHeader-labelContainer": {
                                ".MuiPickersFadeTransitionGroup-root": {
                                    ".MuiPickersCalendarHeader-label": {
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                        color: factionTheme.secondary,
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
                                color: factionTheme.secondary,
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: `${factionTheme.primary}20`,
                                borderColor: `${factionTheme.primary}20`,
                                ":hover, :focus, :active": {
                                    backgroundColor: factionTheme.primary,
                                    borderColor: factionTheme.primary,
                                },
                            },
                        },

                        ".MuiCalendarPicker-viewTransitionContainer": {
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: "1rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: factionTheme.primary,
                            },
                            ".MuiYearPicker-root": {
                                ".PrivatePickersYear-root": {
                                    ".PrivatePickersYear-yearButton": {
                                        fontSize: "1.75rem",
                                        fontWeight: "bold",
                                        ":hover, :focus, :active": {
                                            backgroundColor: `${factionTheme.primary}AA`,
                                            color: factionTheme.secondary,
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
                            border: `${factionTheme.primary}99 2px dashed`,
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
