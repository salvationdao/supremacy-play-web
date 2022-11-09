import { Box, OutlinedInputProps, Stack, SxProps, TextField } from "@mui/material"
import { SvgArrow } from "../../../assets"
import { fonts } from "../../../theme/theme"

export const NiceTextField = ({
    primaryColor,
    value,
    onChange,
    fieldType = "text",
    errorMessage,
    placeholder,
    sx,
    InputProps,
}: {
    primaryColor?: string
    value: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void
    fieldType?: React.InputHTMLAttributes<unknown>["type"]
    errorMessage?: string
    placeholder?: string
    sx?: SxProps
    InputProps?: Partial<OutlinedInputProps> | undefined
}) => {
    return (
        <Box
            position="relative"
            tabIndex={0}
            sx={{
                height: "3.3rem",

                ".MuiInputBase-root": {
                    backgroundColor: "#00000010",
                },
                ":hover, :active, :focus, :focus-within": {
                    ".MuiInputBase-root": {
                        backgroundColor: `${primaryColor}10`,
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        borderColor: `${primaryColor} !important`,
                        borderWidth: "2px",
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
                sx={{
                    width: "100%",
                    ".MuiOutlinedInput-input": {
                        p: ".46rem 1.6rem",
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
                type={fieldType}
                value={value}
                onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (fieldType === "number") {
                        const num = parseInt(e.target.value)
                        if (num <= 0) return
                        onChange(num)
                    } else {
                        onChange(e.target.value)
                    }
                }}
                InputProps={InputProps}
            />

            {fieldType === "number" && typeof value === "number" && (
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
