import { Stack, TextField, InputAdornment } from "@mui/material"
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"

export const BuyoutPricingInput = ({ buyoutPrice, setBuyoutPrice }: { buyoutPrice: string; setBuyoutPrice: React.Dispatch<React.SetStateAction<string>> }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection primaryColor={primaryColor} question="Buyout Price" description="A buyer can pay this amount to immediately purchase your item.">
            <ClipThing
                clipSize="5px"
                clipSlantSize="2px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: "1.5px",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <TextField
                        variant="outlined"
                        hiddenLabel
                        placeholder={buyoutPrice || "Enter buyout price..."}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgSupToken fill={colors.yellow} size="2.4rem" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: "#00000090",
                            // ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${primaryColor}CC .2rem solid` },
                            ".MuiOutlinedInput-input": {
                                px: "1.5rem",
                                py: "1.5rem",
                                fontSize: "2.2rem",
                                width: "32rem",
                                height: "unset",
                                "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                },
                            },
                            ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                        }}
                        type="number"
                        value={buyoutPrice}
                        onChange={(e) => {
                            setBuyoutPrice(e.target.value)
                        }}
                    />
                </Stack>
            </ClipThing>
        </QuestionSection>
    )
}
