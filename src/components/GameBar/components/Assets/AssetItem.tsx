import { Box, Button, Link, Radio, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { TooltipHelper } from ".."
import { SvgExternalLink, SvgFastRepair } from "../../assets"
import { NilUUID } from "../../constants"
import { useAuth, useWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { Asset, AssetDurability, QueuedWarMachine } from "../../types/assets"

const ActionButton = ({ text, isOutlined, color, onClick }: { text: string; color: string; isOutlined?: boolean; onClick: () => void }) => {
	return (
		<Button
			variant="contained"
			size="small"
			onClick={onClick}
			sx={{
				minWidth: 0,
				px: 1,
				py: 0.4,
				boxShadow: 0,
				backgroundColor: isOutlined ? "transparent" : color,
				border: isOutlined ? `${color} 1px solid` : "unset",
				borderRadius: 0.3,
				":hover": { backgroundColor: `${color}90` },
			}}
		>
			<Typography sx={{ fontSize: ".75rem", fontFamily: "Share Tech", lineHeight: 1, color: isOutlined ? color : colors.text }}>{text}</Typography>
		</Button>
	)
}

export const AssetItem = ({ hash, index, queueDetail, passportWeb }: { hash: string; index: number; queueDetail?: QueuedWarMachine; passportWeb: string }) => {
	const { user } = useAuth()
	const { state, send, subscribe } = useWebsocket()
	const [assetItem, setAssetItem] = useState<Asset>()
	const [durability, setDurability] = useState<AssetDurability>()
	const [checkedInsure, toggleCheckedInsure] = useToggle()

	// Subscribe on asset data
	useEffect(() => {
		if (state !== WebSocket.OPEN || !subscribe || !hash) return
		return subscribe<Asset>(
			HubKey.AssetUpdated,
			(payload) => {
				if (!payload) return
				setAssetItem(payload)
			},
			{ assetHash: hash },
		)
	}, [state, subscribe, hash])

	// Subscribe on asset durability
	useEffect(() => {
		if (state !== WebSocket.OPEN || !subscribe || !hash) return
		return subscribe<AssetDurability>(
			HubKey.AssetGetDurability,
			(payload) => {
				if (!payload) return
				setDurability(payload)
			},
			{ assetHash: hash },
		)
	}, [state, subscribe, hash])

	const onDeploy = useCallback(async () => {
		if (state !== WebSocket.OPEN) return
		try {
			const resp = await send(HubKey.AssetJoinQueue, { assetHash: hash })
			if (resp) {
				if (checkedInsure) {
					onInsurance()
					toggleCheckedInsure(false)
				}
			}
		} catch (e) {
			console.log(e)
			return
		}
	}, [state, send, hash])

	const onInsurance = useCallback(async () => {
		if (state !== WebSocket.OPEN) return
		try {
			const resp = await send(HubKey.AssetInsurancePay, { assetHash: hash })
			if (resp) {
				return
			}
		} catch (e) {
			console.log(e)
			return
		}
	}, [state, send, hash])

	if (!assetItem || !user) return null

	const { name, externalURL, image, frozenAt, lockedByID } = assetItem

	const isRepairing = !!durability?.repairType
	const isInGameOrLocked = lockedByID || queueDetail?.position === -1
	const isDeployed = frozenAt || queueDetail
	const contractReward = queueDetail?.warMachineMetadata.contractReward

	const StatusArea = () => {
		if (isRepairing) {
			return (
				<TooltipHelper text={durability?.repairType == "FAST" ? "Rapid repair in progress." : "Repair in progress."}>
					<Typography
						sx={{
							px: 1,
							py: 0.34,
							color: colors.neonBlue,
							lineHeight: 1,
							border: `${colors.neonBlue} 1px solid`,
							borderRadius: 0.3,
							fontSize: ".75rem",
							fontFamily: "Share Tech",
						}}
					>
						{durability?.repairType == "FAST" ? <SvgFastRepair fill={colors.neonBlue} size="9.5px" sx={{ display: "inline", mr: 0.5 }} /> : null}
						REPAIRING
						{durability?.repairType == "FAST" ? <SvgFastRepair fill={colors.neonBlue} size="9.5px" sx={{ display: "inline", ml: 0.5 }} /> : null}
					</Typography>
				</TooltipHelper>
			)
		}

		if (isInGameOrLocked) {
			return (
				<Typography
					sx={{
						px: 1,
						py: 0.34,
						color: colors.orange,
						lineHeight: 1,
						border: `${colors.orange} 1px solid`,
						borderRadius: 0.3,
						fontSize: ".75rem",
						fontFamily: "Share Tech",
					}}
				>
					IN BATTLE
				</Typography>
			)
		}

		if (isDeployed) {
			return (
				<Typography
					sx={{
						px: 1,
						py: 0.34,
						color: colors.yellow,
						lineHeight: 1,
						border: `${colors.yellow} 1px solid`,
						borderRadius: 0.3,
						fontSize: ".75rem",
						fontFamily: "Share Tech",
					}}
				>
					IN QUEUE{queueDetail ? `: ${queueDetail.position + 1}` : ""}
				</Typography>
			)
		}

		if (!isDeployed) {
			return (
				<>
					<ActionButton text="DEPLOY" onClick={onDeploy} color={colors.green} />
					<Radio checked={checkedInsure} onClick={toggleCheckedInsure} size="small" sx={{ p: 0 }} />
					<TooltipHelper
						text={`Insured war machines will repair in rapid mode. Insurance costs 10% of the contract reward${
							contractReward ? ` (${contractReward}) SUPS` : ""
						}.`}
					>
						<Stack direction="row" alignItems="center" spacing={0.6}>
							<Typography sx={{ pt: 0.1, fontSize: ".70rem", fontFamily: "Share Tech", lineHeight: 1, color: checkedInsure ? colors.neonBlue : "" }}>
								INSURANCE
							</Typography>
						</Stack>
					</TooltipHelper>
				</>
			)
		}

		return null
	}

	return (
		<Stack
			direction="row"
			spacing={1.5}
			sx={{
				position: "relative",
				px: 2,
				py: 1.8,
				backgroundColor: index % 2 === 0 ? colors.navy : undefined,
			}}
		>
			<Box
				sx={{
					position: "relative",
					width: 55,
					height: 55,
					flexShrink: 0,
					overflow: "hidden",
					backgroundImage: `url(${image})`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "contain",
				}}
			/>

			<Stack spacing={0.5}>
				<Typography variant="caption" sx={{ color: "#FFFFFF", fontWeight: "fontWeightBold", wordBreak: "break-word" }}>
					{name}
				</Typography>

				<Stack direction="row" spacing={0.8}>
					<StatusArea />
				</Stack>
			</Stack>

			<Link href={`${passportWeb}/profile/${user.username}/asset/${hash}`} target="_blank" sx={{ position: "absolute", top: 6, right: 4 }}>
				<SvgExternalLink fill="#FFFFFF" size="10px" sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }} />
			</Link>
		</Stack>
	)
}
