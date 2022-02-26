import { Box, Stack, Button } from "@mui/material"
import { useRef } from "react"
import { EnlistDetailsPopover } from "../.."
import { SvgPlus } from "../../../assets"
import { useBar } from "../../../containers"
import { GameBarBaseProps } from "../../../GameBar"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme"
import { FactionGeneralData } from "../../../types"
import { PASSPORT_SERVER_HOST, PASSPORT_SERVER_HOST_IMAGES } from '../../../../../constants'

export const EnlistButton = ({ faction, gameBarBaseProps }: { faction: FactionGeneralData; gameBarBaseProps: GameBarBaseProps }) => {
	const popoverRef = useRef(null)
	const [popoverOpen, togglePopoverOpen] = useToggle()
	const { barPosition } = useBar()

	const {
		id,
		label,
		theme: { primary },
		logoBlobID,
	} = faction

	const refPos = barPosition === "top" ? { bottom: -21 } : { top: -21 }

	return (
		<>
			<Button
				sx={{
					position: "relative",
					display: "flex",
					alignItems: "center",
					px: 1.2,
					py: 0.5,
					backgroundColor: "transparent",
					borderRadius: 0.2,
					border: `1px solid ${primary}`,
					"& .MuiTouchRipple-child": {
						backgroundColor: `${primary || colors.white} !important`,
					},
				}}
				onClick={() => togglePopoverOpen()}
			>
				<Box sx={{ position: "absolute", left: "50%", ...refPos }} ref={popoverRef} />

				<Stack direction="row" spacing={1.2} alignItems="center">
					<Box
						sx={{
							width: 24,
							height: 24,
							backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logoBlobID})`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: "cover",
						}}
					/>
					<SvgPlus size="10px" fill={primary || colors.white} sx={{ pb: 0 }} />
				</Stack>
			</Button>

			{popoverOpen && (
				<EnlistDetailsPopover
					popoverRef={popoverRef}
					popoverOpen={popoverOpen}
					togglePopoverOpen={togglePopoverOpen}
					factionID={id}
					factionData={faction}
					gameBarBaseProps={gameBarBaseProps}
				/>
			)}
		</>
	)
}
