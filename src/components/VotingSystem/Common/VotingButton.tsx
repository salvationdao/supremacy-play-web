import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { FancyButton } from "../.."
import { useWallet } from "../../../containers"

interface VotingButtonProps {
    percentage: string
    displayPercentage: string
    cost: string
    color: string
    textColor?: string
    isVoting: boolean
    onClick: () => void
    Prefix?: JSX.Element
    Suffix?: JSX.Element
}

export const VotingButton = ({ displayPercentage, cost, color, textColor, isVoting, onClick, Prefix }: VotingButtonProps) => {
    const { onWorldSups } = useWallet()

    const isVotable = useMemo(
        () => isVoting && onWorldSups && onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(cost),
        [cost, isVoting, onWorldSups],
    )

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: color || "#14182B",
                border: { isFancy: true, borderColor: color || "#14182B" },
                sx: { flex: 1, position: "relative" },
            }}
            sx={{ py: ".2rem", minWidth: "2rem" }}
            onClick={onClick}
        >
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, .9)",
                    opacity: 0,
                    transition: "opacity .2s ease-out",
                    ":hover": {
                        opacity: 1,
                    },
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        color: "#FFFFFF",
                    }}
                >
                    ({displayPercentage}%)
                </Typography>
            </Stack>

            <Stack alignItems="center" justifyContent="center" direction="row">
                {Prefix}
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        color: textColor || "#FFFFFF",
                    }}
                >
                    {cost}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
