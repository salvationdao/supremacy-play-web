import { Drawer, Stack } from "@mui/material"
import { ReactNode } from "react"
import { DrawerButtons } from ".."
import { useDrawer } from "../../containers/drawer"
import { DRAWER_TRANSITION_DURATION, LIVE_CHAT_DRAWER_WIDTH } from "../../constants"
import { colors } from "../../theme"

export const MechQueue = ({ Content }: { Content: ReactNode }) => {
	const { isMechQueueOpen } = useDrawer()

	return (
		<Drawer
			transitionDuration={DRAWER_TRANSITION_DURATION}
			open={isMechQueueOpen}
			variant="persistent"
			anchor="right"
			sx={{
				width: LIVE_CHAT_DRAWER_WIDTH,
				flexShrink: 0,
				zIndex: 9999,
				"& .MuiDrawer-paper": {
					width: LIVE_CHAT_DRAWER_WIDTH,
					backgroundColor: colors.darkNavy,
				},
			}}
		>
			<Stack
				direction="row"
				sx={{
					width: "100%",
					height: "100%",
					backgroundColor: colors.darkNavy,
				}}
			>
				<DrawerButtons isFixed={false} />

				<Stack sx={{ flex: 1 }}>{Content}</Stack>
			</Stack>
		</Drawer>
	)
}
