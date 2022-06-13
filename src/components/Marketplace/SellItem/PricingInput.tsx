import { Stack, TextField, InputAdornment } from "@mui/material"
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"

export const PricingInput = ({
    price,
    setPrice,
    question,
    description,
    placeholder,
}: {
    price: string
    setPrice: React.Dispatch<React.SetStateAction<string>>
    question: string
    description: string
    placeholder: string
}) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection primaryColor={primaryColor} question={question} description={description}>
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
                                    "-webkit-appearance": "none",
                                },
                            },
                            ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                        }}
                        type="number"
                        value={price}
                        onChange={(e) => {
                            setPrice(e.target.value)
                        }}
                    />
                </Stack>
            </ClipThing>
        </QuestionSection>
    )
}
