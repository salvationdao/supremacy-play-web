import { Stack, TextField, InputAdornment, Typography } from "@mui/material"
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { QuestionSection } from "./QuestionSection"

export const PricingInput = ({
    price,
    setPrice,
    question,
    description,
    placeholder,
    error,
    isOptional,
}: {
    price?: number
    setPrice: React.Dispatch<React.SetStateAction<number | undefined>>
    question: string
    description: string
    placeholder: string
    error?: string
    isOptional?: boolean
}) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection primaryColor={primaryColor} question={question} description={description} isOptional={isOptional}>
            <Stack sx={{ flex: 1 }}>
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="2px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: "1.5px",
                    }}
                    opacity={0.9}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <TextField
                            variant="outlined"
                            hiddenLabel
                            placeholder={placeholder}
                            onWheel={(event) => {
                                event.currentTarget.getElementsByTagName("input")[0]?.blur()
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgSupToken fill={colors.yellow} size="2.4rem" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#00000090",
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: "1.5rem",
                                    fontSize: "2rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                            type="number"
                            value={price || ""}
                            onChange={(e) => {
                                const newAmount = parseInt(e.target.value)
                                if (newAmount <= 0) return
                                setPrice(newAmount)
                            }}
                        />
                    </Stack>
                </ClipThing>
                {error && (
                    <Typography
                        sx={{
                            ml: ".3rem",
                            mt: ".5rem",
                            color: colors.red,
                            fontWeight: "bold",
                        }}
                    >
                        {error}
                    </Typography>
                )}
            </Stack>
        </QuestionSection>
    )
}
