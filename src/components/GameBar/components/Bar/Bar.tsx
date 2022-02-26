import { Box, Stack, Typography } from "@mui/material"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_WIDTH } from "../../constants"
import { useAuth, useWebsocket, useBar, useDrawer } from "../../containers"
import { GameBarBaseProps } from "../../GameBar"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme"

export const Bar = (props: GameBarBaseProps) => {
	const { state } = useWebsocket()
	const { user } = useAuth()
	const { barPosition, gameBarRef, activeBars } = useBar()
	const { isAnyPanelOpen } = useDrawer()

	const styles: any = barPosition == "top" ? { top: 0 } : { bottom: 0 }

	const renderBarContent = () => {
		if (state !== WebSocket.OPEN) {
			return (
				<>
					<Logo supremacyPage={props.supremacyPage} />
					<Box sx={{ flexGrow: 1 }} />
					<Typography sx={{ mr: 2 }} variant="caption">
						Connecting to server...
					</Typography>
				</>
			)
		}

		return (
			<>
				{(activeBars.logo || !user) && <Logo supremacyPage={props.supremacyPage} />}
				<Box sx={{ flexGrow: 1 }} />
				{user && (
					<>
						<Enlist {...props} />
						<WalletDetails tokenSalePage={props.tokenSalePage} />
					</>
				)}
				<ProfileCard {...props} />
			</>
		)
	}

	return (
		<Stack
			ref={gameBarRef}
			sx={{
				...styles,
				position: "fixed",
				left: 0,
				zIndex: 9999,
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				sx={{
					position: "relative",
					pl: activeBars.logo ? 1 : 0,
					pr: 2,
					height: GAME_BAR_HEIGHT,
					color: colors.white,
					backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
					overflowX: "auto",
					overflowY: "hidden",
					scrollbarWidth: "none",
					zIndex: (theme) => theme.zIndex.drawer + 1,
					"::-webkit-scrollbar": {
						height: 4,
					},
					"::-webkit-scrollbar-track": {
						boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
						borderRadius: 3,
					},
					"::-webkit-scrollbar-thumb": {
						background: colors.darkNeonBlue,
						borderRadius: 3,
					},
					width: isAnyPanelOpen ? `calc(100vw - ${LIVE_CHAT_DRAWER_WIDTH - 1}px)` : "100vw",
					transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
				}}
			>
				{renderBarContent()}
			</Stack>
		</Stack>
	)
}
