import React, { ReactNode, useMemo } from "react"
import { TextFieldProps } from "@mui/material/TextField"
import { useTheme } from "../../../containers/theme"
import { InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

interface InputFieldProps {
    startAdornmentLabel?: ReactNode
    endAdornmentLabel?: ReactNode
    border?: string
    borderRadius?: number
}

export const InputField = ({
    border,
    borderRadius,
    label,
    startAdornmentLabel,
    endAdornmentLabel,
    placeholder,
    disabled,
    ...props
}: InputFieldProps & TextFieldProps) => {
    const { factionTheme } = useTheme()
    const title = useMemo(() => {
        if (typeof label === "string") {
            return (
                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            )
        }
        return label
    }, [factionTheme.primary, label])

    const startAdornment = useMemo(() => {
        if (!startAdornmentLabel) return null
        return <InputAdornment position="start">{startAdornmentLabel}</InputAdornment>
    }, [startAdornmentLabel])

    const endAdornment = useMemo(() => {
        if (!endAdornmentLabel) return null
        return <InputAdornment position="start">{endAdornmentLabel}</InputAdornment>
    }, [endAdornmentLabel])

    return (
        <Stack
            spacing=".5rem"
            flex={1}
            sx={{
                opacity: disabled ? 0.5 : 1,
                height: "100%",
            }}
        >
            {title}
            <TextField
                {...props}
                hiddenLabel
                fullWidth
                placeholder={placeholder || "ANY"}
                disabled={disabled}
                InputProps={{
                    startAdornment,
                    endAdornment,
                }}
                sx={{
                    backgroundColor: "#00000090",
                    height: "100%",
                    ".MuiFormControl-root": {
                        height: "100%",
                    },

                    ".MuiOutlinedInput-root": {
                        height: "100%",
                        borderRadius: borderRadius !== undefined ? borderRadius : 0.5,
                        border: border || `${factionTheme.primary}99 2px dashed`,
                        pr: 0,
                    },

                    ".MuiOutlinedInput-input": {
                        px: "1.5rem",
                        py: ".6rem",
                        fontSize: "1.7rem",
                        height: "unset",
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                    },

                    ".MuiInputAdornment-root": {
                        height: "100%",
                        mr: 0,
                        maxHeight: "unset",
                    },

                    ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                }}
            />
        </Stack>
    )
}
