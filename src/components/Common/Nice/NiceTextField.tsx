import { Box, Stack, TextField } from "@mui/material"
import { SvgArrow } from "../../../assets"
import { colors, fonts } from "../../../theme/theme"

export const NiceTextField = ({
    primaryColor,
    value,
    onChange,
    fieldType = "text",
    errorMessage,
    placeholder,
}: {
    primaryColor?: string
    value: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void
    fieldType?: React.InputHTMLAttributes<unknown>["type"]
    errorMessage?: string
    placeholder?: string
}) => {
    return (
        <Box
            position="relative"
            tabIndex={0}
            sx={{
                ".MuiInputBase-root": {
                    backgroundColor: "#00000090",
                },
                ":hover, :active, :focus, :focus-within": {
                    ".MuiInputBase-root": {
                        color: `${colors.gold}`,
                        backgroundColor: `${colors.gold}08`,
                    },
                    "*": {
                        fill: `${colors.gold}90`,
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        borderColor: `${colors.gold}90 !important`,
                    },
                },
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
                        p: ".3rem 1rem",
                        fontSize: "1.65rem",
                        fontFamily: fonts.shareTech,
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                        appearance: "textfield",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: `${primaryColor || "#FFFFFF"}40 1px solid`,
                        borderRightWidth: ".4rem",
                        borderRadius: 0.3,
                    },
                }}
                type={fieldType}
                value={value}
                onChange={(e) => {
                    if (fieldType === "number") {
                        const num = parseInt(e.target.value)
                        if (num <= 0) return
                        onChange(num)
                    } else {
                        onChange(e.target.value)
                    }
                }}
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
