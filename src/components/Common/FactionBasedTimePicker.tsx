import moment from "moment"
import { TextField } from "@mui/material"
import { TimePicker } from "@mui/x-date-pickers"
import React from "react"
import { useTheme } from "../../containers/theme"
import { fonts } from "../../theme/theme"

interface FactionBasedTimePickerProps {
    value: moment.Moment | null
    onChange: (t: moment.Moment | null) => void
    disabled?: boolean
}

export const FactionBasedTimePicker = ({ value, onChange, disabled }: FactionBasedTimePickerProps) => {
    const { factionTheme } = useTheme()
    return (
        <TimePicker
            inputFormat={"hh:mm A"}
            value={value || null}
            onChange={onChange}
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
                    ".MuiClockPicker-root": {
                        borderRadius: 0.8,
                        border: `${factionTheme.primary}99 2px solid`,
                        backgroundColor: factionTheme.background,

                        ".MuiPickersArrowSwitcher-root": {
                            ".MuiPickersArrowSwitcher-button": {
                                ".MuiSvgIcon-root": {
                                    fontSize: "2.5rem",
                                    fontWeight: "bold",
                                },
                            },
                        },

                        ".MuiClock-root": {
                            m: "4rem",
                            ".MuiClock-clock": {
                                backgroundColor: factionTheme.primary,

                                // pin in the center
                                ".MuiClock-pin": {
                                    backgroundColor: factionTheme.secondary,
                                },

                                // bar
                                ".MuiClockPointer-root": {
                                    backgroundColor: factionTheme.secondary,
                                    ".MuiClockPointer-thumb": {
                                        backgroundColor: factionTheme.secondary,
                                        borderColor: factionTheme.secondary,
                                    },
                                },

                                // clock number
                                ".MuiClock-wrapper": {
                                    ".MuiClockNumber-root": {
                                        fontSize: "1.3rem",
                                        fontFamily: fonts.nostromoBlack,
                                    },
                                },
                            },

                            ".MuiButtonBase-root": {
                                backgroundColor: `${factionTheme.primary}20`,
                                borderColor: `${factionTheme.primary}20`,
                                borderRadius: 0.8,
                                ":hover, :focus, :active": {
                                    backgroundColor: factionTheme.primary,
                                    borderColor: factionTheme.primary,
                                },

                                ".MuiTypography-root": {
                                    fontSize: "1rem",
                                    fontFamily: fonts.nostromoBlack,
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
                            border: `${factionTheme.primary}99 2px solid`,
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
