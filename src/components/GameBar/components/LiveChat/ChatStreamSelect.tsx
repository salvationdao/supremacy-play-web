import { MenuItem, Select, Typography } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { SvgDropdownArrow } from "../../assets"
import { useAuth } from "../../containers"
import { colors } from "../../theme"
import { ChatStreamType } from "../../types"

export const ChatStreamSelect = ({
	selectedChatStream,
	setSelectedChatStream,
}: {
	selectedChatStream: ChatStreamType
	setSelectedChatStream: Dispatch<SetStateAction<ChatStreamType>>
}) => {
	const { user } = useAuth()

	let options: ChatStreamType[] = ["GLOBAL"]
	if (user?.factionID) options = ["GLOBAL", "FACTION"]

	return (
		<Select
			IconComponent={(props) => <SvgDropdownArrow {...props} size="15px" />}
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100% !important",
				height: "100% !important",
				m: "0 !important",
				"*": { border: "none !important" },
				"& .MuiSelect-select": {
					width: "100% !important",
					height: "100% !important",
				},
				"& .MuiSelect-outlined": { p: "0px !important" },
				"& .MuiTypography-root": { display: "none !important" },
				"& .MuiSelect-icon": { right: 16, top: "calc(50% - 2px)", transform: "translateY(-50%)" },
			}}
			defaultValue={"GLOBAL"}
			value={selectedChatStream}
			MenuProps={{
				variant: "menu",
				sx: {
					"&& .Mui-selected": {
						backgroundColor: colors.darkerNeonBlue,
					},
				},
				PaperProps: {
					sx: {
						ml: 2,
						backgroundColor: colors.darkNavy,
						borderRadius: 0.5,
					},
				},
			}}
		>
			{options.map((x) => {
				return (
					<MenuItem
						key={x}
						value={x}
						onClick={() => {
							setSelectedChatStream(x)
						}}
						sx={{
							minWidth: 120,
							"&:hover": {
								backgroundColor: colors.darkNavyBlue,
							},
						}}
					>
						<Typography variant="body2" sx={{ lineHeight: 1, fontFamily: "Share Tech" }}>
							{x}
						</Typography>
					</MenuItem>
				)
			})}
		</Select>
	)
}
