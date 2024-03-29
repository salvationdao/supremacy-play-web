import { BaseTextFieldProps, Box, OutlinedInputProps, Stack, SxProps, TextField } from "@mui/material"
import { useMemo } from "react"
import { SvgArrow } from "../../../assets"
import { fonts } from "../../../theme/theme"

interface NiceTextFieldProps extends BaseTextFieldProps {
    primaryColor?: string
    value?: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (value: any, e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined
    errorMessage?: string
    sx?: SxProps
    InputProps?: Partial<OutlinedInputProps> | undefined
    height?: string
}

// Please use the MUI classnames to style the textfield itself in the sx prop
export const NiceTextField = ({
    primaryColor,
    value,
    onChange,
    onKeyDown,
    errorMessage,
    placeholder,
    InputProps,
    sx,
    multiline,
    height = "4.3rem",
    ...props
}: NiceTextFieldProps) => {
    const numberArrowsEndAdornment = useMemo(() => {
        if (props.type !== "number") {
            return null
        }

        return (
            <Stack
                spacing="-.1rem"
                alignItems="center"
                sx={{
                    zIndex: 1,
                    "& svg:active": {
                        transform: "scale(1.1)",
                        transition: "all .1s",
                    },
                }}
            >
                <Box
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        if (!onChange || typeof value !== "number") return
                        onChange((value || 0) + 1)
                    }}
                >
                    <SvgArrow size=".8rem" />
                </Box>
                <Box
                    sx={{
                        transform: "scaleY(-1)",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        if (!onChange || typeof value !== "number") return
                        if (value > 1) onChange((value || 0) - 1)
                    }}
                >
                    <SvgArrow size=".8rem" />
                </Box>
            </Stack>
        )
    }, [onChange, props.type, value])

    return (
        <Box
            position="relative"
            tabIndex={0}
            sx={{
                height: multiline ? "unset" : height,
                boxShadow: 0.5,

                ".MuiOutlinedInput-root": {
                    py: 0,
                },

                ".MuiInputBase-multiline": {
                    pl: 0,
                },

                ".MuiInputBase-root": {
                    backgroundColor: "#FFFFFF15",
                },
                ":hover, :active, :focus, :focus-within": {
                    ".MuiInputBase-root": {
                        backgroundColor: `${primaryColor}15`,
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: `${primaryColor} 1px inset !important`,
                    },
                },
                ...sx,
            }}
        >
            <TextField
                spellCheck={false}
                variant="outlined"
                hiddenLabel
                placeholder={placeholder}
                error={!!errorMessage}
                helperText={errorMessage}
                onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()} // Prevents scroll number change
                multiline={multiline}
                sx={{
                    width: "100%",
                    ".MuiOutlinedInput-input": {
                        p: ".37rem 1.6rem",
                        pt: ".55rem",
                        fontSize: "1.7rem",
                        height: `calc(${height} - 1rem)`,
                        fontFamily: fonts.rajdhaniMedium,
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                        appearance: "textfield",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: `${"#FFFFFF"}50 1px inset`,
                        borderRadius: 0,
                    },
                }}
                value={value}
                onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (!onChange) return
                    if (props.type === "number") {
                        const num = parseFloat(e.target.value)
                        if (num < 0) return
                        onChange(num, e)
                    } else {
                        onChange(e.target.value, e)
                    }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    onKeyDown && onKeyDown(e)
                    e.stopPropagation()
                }}
                InputProps={{
                    ...InputProps,
                    endAdornment: (
                        <Stack direction="row" spacing="1rem" alignItems="center">
                            {InputProps?.endAdornment}
                            {numberArrowsEndAdornment}
                        </Stack>
                    ),
                }}
                {...props}
            />
        </Box>
    )
}
