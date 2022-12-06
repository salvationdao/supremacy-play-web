import { Typography } from "@mui/material"
import { StyledImageText } from "../../.."
import { colors } from "../../../../theme/theme"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <NiceBoxThing border={{ color: `#FFFFFF80` }} background={{ colors: [colors.darkNavy], opacity: 0.6 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                <StyledImageText>{data}</StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
