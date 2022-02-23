import { Stack, Typography } from "@mui/material"
import { useWallet } from "@ninjasoftware/passport-gamebar"
import { FancyButton } from "../.."
import { SvgSupToken } from "../../../assets"

interface VotingButtonProps {
    amount: number
    cost: number
    color: string
    isVoting: boolean
    onClick: () => void
    Prefix?: JSX.Element
    Suffix?: JSX.Element
    disableHover?: boolean
}

export const VotingButton = ({
    amount,
    cost,
    color,
    isVoting,
    onClick,
    Prefix,
    Suffix,
    disableHover,
}: VotingButtonProps) => {
    const { onWorldSups } = useWallet()

    const isVotable = isVoting && onWorldSups && onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(cost)

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipSize="4px"
            sx={{ pt: 0.4, pb: 0.3, minWidth: 20 }}
            clipSx={{ flex: 1, position: "relative" }}
            backgroundColor={color || "#14182B"}
            borderColor={color || "#14182B"}
            onClick={onClick}
        >
            {!disableHover && (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, .9)",
                        color: "white",
                        opacity: 0,
                        transition: "opacity .2s ease-out",
                        ":hover": {
                            opacity: 1,
                        },
                    }}
                >
                    <SvgSupToken size="14px" />
                    <Typography
                        sx={{
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                            color: "#FFFFFF",
                        }}
                    >
                        {cost.toFixed(6)}
                    </Typography>
                </Stack>
            )}

            <Stack alignItems="center" justifyContent="center" direction="row" spacing={0.2}>
                {Prefix}
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        fontFamily: "Nostromo Regular Medium",
                        whiteSpace: "nowrap",
                        color: "#FFFFFF",
                    }}
                >
                    {amount}
                </Typography>
                {Suffix}
            </Stack>
        </FancyButton>
    )
}
