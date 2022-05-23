import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../assets"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { getRarityDeets, supFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MechModal } from "../Common/MechModal"

export const DeployModal = () => {
    const { deployMechDetails } = useHangarWarMachine()

    if (!deployMechDetails) return null
    return <DeployModalInner mechDetails={deployMechDetails} />
}

const DeployModalInner = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const { queueFeed, actualQueueCost, onDeployQueue, deployQueueError, setDeployMechDetails, setDeployQueueError } = useHangarWarMachine()

    const { hash, tier, name, label } = mechDetails

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const queueLength = queueFeed?.queue_length || 0
    const contractReward = queueFeed?.contract_reward || ""

    const onClose = useCallback(() => {
        setDeployMechDetails(undefined)
        setDeployQueueError("")
    }, [setDeployQueueError, setDeployMechDetails])

    return (
        <MechModal mechDetails={mechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Box>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, letterSpacing: "1px" }}>{name || label}</Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            mt: ".4rem",
                            lineHeight: 1,
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoHeavy,
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                </Box>

                <Stack spacing=".2rem">
                    {queueLength >= 0 && (
                        <AmountItem
                            key={`${queueLength}-queue_length`}
                            title={"Position: "}
                            color="#FFFFFF"
                            value={`${queueLength + 1}`}
                            tooltip="The queue position of your war machine if you deploy now."
                            disableIcon
                        />
                    )}

                    <AmountItem
                        key={`${contractReward}-contract_reward`}
                        title={"Contract reward: "}
                        color={colors.yellow}
                        value={supFormatter(contractReward, 2)}
                        tooltip="Your reward if your mech survives the battle giving your syndicate a victory."
                    />

                    <AmountItem title={"Fee: "} color={"#FF4136"} value={actualQueueCost} tooltip="The cost to place your war machine into the battle queue." />
                </Stack>

                <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { isFancy: true, borderColor: colors.green },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".5rem", color: "#FFFFFF" }}
                        onClick={() => onDeployQueue({ hash })}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            DEPLOY
                        </Typography>
                    </FancyButton>
                </Stack>

                {deployQueueError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: "red",
                        }}
                    >
                        {deployQueueError}
                    </Typography>
                )}
            </Stack>
        </MechModal>
    )
}

const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color: string
    value: string | number
    tooltip: string
    disableIcon?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="caption" sx={{ mr: ".4rem", fontFamily: fonts.nostromoBlack }}>
                {title}
            </Typography>

            {!disableIcon && <SvgSupToken size="1.4rem" fill={color} sx={{ mr: ".1rem", pb: ".4rem" }} />}

            <Typography variant="caption" sx={{ mr: "3.2rem", color: color, fontFamily: fonts.nostromoBold }}>
                {value || "---"}
            </Typography>

            <TooltipHelper placement="right-start" text={tooltip}>
                <Box sx={{ ml: "auto" }}>
                    <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                </Box>
            </TooltipHelper>
        </Stack>
    )
}
