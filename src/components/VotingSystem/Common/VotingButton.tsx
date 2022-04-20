import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { FancyButton } from "../.."
import { useWallet } from "../../../containers"

interface VotingButtonProps {
    percentage: string
    cost: string
    color: string
    textColor?: string
    isVoting: boolean
    onClick: () => void
    Prefix?: JSX.Element
    Suffix?: JSX.Element
}

export const VotingButton = ({ percentage, cost, color, textColor, isVoting, onClick, Prefix, Suffix }: VotingButtonProps) => {
    const { onWorldSups } = useWallet()

    const isVotable = useMemo(
        () => isVoting && onWorldSups && onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(cost),
        [isVoting, onWorldSups, onWorldSups],
    )

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipSize="4px"
            sx={{ pt: ".32rem", pb: ".24rem", minWidth: "2rem" }}
            clipSx={{ flex: 1, position: "relative" }}
            backgroundColor={color || "#14182B"}
            borderColor={color || "#14182B"}
            onClick={onClick}
        >
            <Stack alignItems="center" justifyContent="center" direction="row" spacing=".16rem">
                {/*{Prefix}*/}
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        fontFamily: "Nostromo Regular Medium",
                        whiteSpace: "nowrap",
                        color: textColor || "#FFFFFF",
                    }}
                >
                    {percentage}%
                </Typography>
                {Suffix}
            </Stack>
        </FancyButton>
    )
}
