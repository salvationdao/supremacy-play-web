import { IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useState, useRef, useEffect, useMemo } from "react"
import { EmojiPopover } from "../.."
import { SvgEmoji, SvgSend } from "../../../assets"
import { useAuth, useWebsocket } from "../../../containers"
import { useToggle } from "../../../hooks"
import HubKey from "../../../keys"
import { colors } from "../../../theme"
import { ChatData } from "../../../types"

interface ChatSendProps {
	primaryColor: string
	factionID: string | null
	onNewMessage: (message: ChatData, factionID: string | null) => void
	onSentMessage: (date: Date) => void
	onFailedMessage: (date: Date) => void
}

export const ChatSend = ({ primaryColor, factionID, onNewMessage, onSentMessage, onFailedMessage }: ChatSendProps) => {
	const { user } = useAuth()
	const { state, send } = useWebsocket()
	// Message field
	const [message, setMessage] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)
	// Emoji
	const popoverRef = useRef(null)
	const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()

	const messageColor = useMemo(() => getRandomChatColor(), [])

	const sendMessage = async () => {
		if (!message.trim() || !user || state !== WebSocket.OPEN) return

		const sentAt = new Date()

		onNewMessage(
			{
				fromUserID: user.id,
				fromUsername: user.username,
				messageColor,
				factionColour: user && user.faction ? user.faction.theme.primary : messageColor,
				factionLogoBlobID: user && user.faction ? user.faction.logoBlobID : "",
				avatarID: user.avatarID,
				message,
				sentAt,
			},
			factionID,
		)

		try {
			setMessage("")
			const resp = await send<boolean>(HubKey.SendChatMessage, { factionID, message, messageColor })
			if (resp) onSentMessage(sentAt)
		} catch (err) {
			onFailedMessage(sentAt)
		}
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				sendMessage()
			}}
		>
			<Stack
				justifyContent="flex-end"
				sx={{
					px: 1.6,
					pt: 0.4,
					pb: 2,
				}}
			>
				<TextField
					value={message}
					placeholder="Send a message..."
					onChange={(e) => setMessage(e.currentTarget.value)}
					inputRef={inputRef}
					type="text"
					multiline
					maxRows={4}
					hiddenLabel
					size="small"
					onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
						e.stopPropagation()
						if (e.key == "Enter" && !e.shiftKey && !e.ctrlKey) {
							e.preventDefault()
							sendMessage()
						}
					}}
					sx={{
						borderRadius: 1,
						"& .MuiInputBase-root": {
							backgroundColor: `${colors.darkGrey}70`,
							fontFamily: "Share Tech",
							fontSize: (theme) => theme.typography.pxToRem(17),
						},
						".Mui-disabled": {
							WebkitTextFillColor: "unset",
							color: "#FFFFFF70",
						},
						".Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: `${primaryColor} !important`,
						},
						textarea: {
							overflow: "hidden",
						},
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									ref={popoverRef}
									onClick={toggleIsEmojiOpen}
									edge="end"
									size="small"
									sx={{ mr: 0, opacity: isEmojiOpen ? 1 : 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
								>
									<SvgEmoji size="14px" fill="#FFFFFF" sx={{ pb: 0 }} />
								</IconButton>
								<IconButton onClick={sendMessage} edge="end" size="small" sx={{ opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}>
									<SvgSend size="14px" fill="#FFFFFF" sx={{ pb: 0 }} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			<EmojiPopover
				primaryColor={primaryColor}
				setMessage={setMessage}
				popoverRef={popoverRef}
				isEmojiOpen={isEmojiOpen}
				toggleIsEmojiOpen={toggleIsEmojiOpen}
			/>
		</form>
	)
}

// Returns a random chat color for non faction users
const getRandomChatColor = () => {
	let color = "#"
	for (let i = 0; i < 3; i++) color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2)
	return color
}