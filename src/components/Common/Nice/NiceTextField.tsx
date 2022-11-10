import { BaseTextFieldProps, Box, OutlinedInputProps, Stack, SxProps, TextField } from "@mui/material"
import { SvgArrow } from "../../../assets"
import { fonts } from "../../../theme/theme"

interface NiceTextFieldProps extends BaseTextFieldProps {
    primaryColor?: string
    value: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any, e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined
    errorMessage?: string
    sx?: SxProps
    InputProps?: Partial<OutlinedInputProps> | undefined
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
    ...props
}: NiceTextFieldProps) => {
    return (
        <Box
            position="relative"
            tabIndex={0}
            sx={{
                height: multiline ? "unset" : "3.3rem",
                boxShadow: 0.5,

                ".MuiOutlinedInput-root": {
                    py: 0,
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
                        border: `${primaryColor} 2px solid !important`,
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
                        fontFamily: fonts.shareTech,
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                        appearance: "textfield",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: `${"#FFFFFF"}50 1px solid`,
                        borderRadius: 0,
                    },
                }}
                value={value}
                onChange={(e) => {
                    if (props.type === "number") {
                        const num = parseInt(e.target.value)
                        if (num <= 0) return
                        onChange(num, e)
                    } else {
                        onChange(e.target.value, e)
                    }
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    onKeyDown && onKeyDown(e)
                    e.stopPropagation()
                }}
                InputProps={InputProps}
                {...props}
            />

            {props.type === "number" && typeof value === "number" && (
                <Stack
                    spacing="-.3rem"
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: ".8rem",
                        "& svg:active": {
                            transform: "scale(1.1)",
                            transition: "all .1s",
                        },
                    }}
                >
                    <Box
                        sx={{
                            transform: "rotate(-90deg)",
                            cursor: "pointer",
                            zIndex: 1,
                            fill: primaryColor,
                            svg: {
                                fill: "#FFFFFF",
                                width: ".5rem",
                                height: ".5rem",
                            },
                        }}
                        onClick={() => {
                            onChange(value + 1)
                        }}
                    >
                        <SvgArrow />
                    </Box>
                    <Box
                        sx={{
                            transform: "rotate(-90deg) scaleX(-1)",
                            cursor: "pointer",
                            fill: primaryColor,
                            svg: {
                                fill: "#FFFFFF",
                                width: ".5rem",
                                height: ".5rem",
                            },
                        }}
                        onClick={() => {
                            if (value > 1) onChange(value - 1)
                        }}
                    >
                        <SvgArrow />
                    </Box>
                </Stack>
            )}
        </Box>
    )
}
