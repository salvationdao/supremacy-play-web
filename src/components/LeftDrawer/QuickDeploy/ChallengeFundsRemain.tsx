import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useRef, useState } from "react"
import { SvgSupToken } from "../../../assets"
import { DEV_ONLY, PROD_ONLY } from "../../../constants"
import { supFormatterNoFixed } from "../../../helpers"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { ProgressBar } from "../../Common/ProgressBar"

const MAX_FUNDS = 1000000 // 1 million

export const ChallengeFundsRemain = () => {
    if (!PROD_ONLY && !DEV_ONLY) return null
    return <ChallengeFundsRemainInner />
}

const ChallengeFundsRemainInner = () => {
    const [challengeSupsRemain, setChallengeSupsRemain] = useState<string>()
    const progressPercent = useRef(0) // Out of 100

    useGameServerSubscription<string>(
        {
            URI: "/public/challenge_fund",
            key: GameServerKeys.SubChallengeFunds,
        },
        (payload) => {
            if (!payload) return
            setChallengeSupsRemain(supFormatterNoFixed(payload))
            progressPercent.current = new BigNumber(payload).shiftedBy(-18).dividedBy(MAX_FUNDS).toNumber()
        },
    )

    return (
        <Box>
            <Stack spacing="1.3rem" alignItems="center" justifyContent="center" sx={{ p: "1.4rem 1.6rem", backgroundColor: "#171717" }}>
                <span style={{ textAlign: "center" }}>
                    <SvgSupToken
                        size="1.8rem"
                        fill={colors.yellow}
                        sx={{
                            display: "inline",
                            p: 0,
                            svg: { transform: "translateY(0.2rem)" },
                        }}
                    />
                    <Typography
                        sx={{
                            display: "inline",
                            lineHeight: 1,
                            color: colors.yellow,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        {challengeSupsRemain} SUPS REMAIN IN BONUS POOL
                    </Typography>
                </span>

                <ProgressBar percent={progressPercent.current} color={colors.yellow} backgroundColor="#000000" orientation="horizontal" thickness="1.8rem" />
            </Stack>
        </Box>
    )
}
