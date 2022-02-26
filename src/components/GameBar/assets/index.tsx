import { Box, BoxProps } from "@mui/system"
import { colors } from "../theme"
import AppsIcon from "@mui/icons-material/Apps"
import HorizontalRuleSharpIcon from "@mui/icons-material/HorizontalRuleSharp"
import ArrowRightAltSharpIcon from "@mui/icons-material/ArrowRightAltSharp"
import NinjaSyndicateLogo from "!@svgr/webpack!./svg/NinjaSyndicateLogo.svg"
import SupremacyLogo from "!@svgr/webpack!./svg/SupremacyLogo.svg"
import Send from "!@svgr/webpack!./svg/Send.svg"
import SupToken from "!@svgr/webpack!./svg/SupToken.svg"
import Wallet from "!@svgr/webpack!./svg/Wallet.svg"
import Plus from "!@svgr/webpack!./svg/Plus.svg"
import Rank from "!@svgr/webpack!./svg/Rank.svg"
import Assets from "!@svgr/webpack!./svg/Assets.svg"
import InfoCircular from "!@svgr/webpack!./svg/InfoCircular.svg"
import Shop from "!@svgr/webpack!./svg/Shop.svg"
import Profile from "!@svgr/webpack!./svg/Profile.svg"
import Emoji from "!@svgr/webpack!./svg/Emoji.svg"
import ExternalLink from "!@svgr/webpack!./svg/ExternalLink.svg"
import FastRepair from "!@svgr/webpack!./svg/FastRepair.svg"
import Logout from "!@svgr/webpack!./svg/Logout.svg"
import Chat from "!@svgr/webpack!./svg/Chat.svg"
import Refresh from "!@svgr/webpack!./svg/Refresh.svg"
import DropdownArrow from "!@svgr/webpack!./svg/DropdownArrow.svg"
import Ability from "!@svgr/webpack!./svg/Ability.svg"
import View from "!@svgr/webpack!./svg/View.svg"
import Applause from "!@svgr/webpack!./svg/Applause.svg"
import Death from "!@svgr/webpack!./svg/Death.svg"
import Robot from "!@svgr/webpack!./svg/Robot.svg"
import Global from "!@svgr/webpack!./svg/Global.svg"
import BostonCyberneticsLogo from "./images/BostonCyberneticsLogo.png"
import RedMountainLogo from "./images/RedMountainLogo.png"
import ZaibatsuLogo from "./images/ZaibatsuLogo.png"

export { BostonCyberneticsLogo, RedMountainLogo, ZaibatsuLogo }

export interface SvgWrapperProps extends BoxProps {
	size?: string
	fill?: string
	height?: string
	width?: string
}

export const SvgWrapper: React.FC<SvgWrapperProps> = ({ fill, sx, size, width, height, ...props }: SvgWrapperProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				pb: 0.3,
				"& > svg": {
					width: width || size || "20px",
					height: height || size || "20px",
					fill: fill || colors.text,
				},
				...sx,
			}}
			{...props}
		/>
	)
}

export const SvgNinjaSyndicateLogo: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<NinjaSyndicateLogo />
	</SvgWrapper>
)

export const SvgSupremacyLogo: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<SupremacyLogo />
	</SvgWrapper>
)

export const SvgSupToken: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<SupToken />
	</SvgWrapper>
)

export const SvgWallet: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Wallet />
	</SvgWrapper>
)

export const SvgPlus: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Plus />
	</SvgWrapper>
)

export const SvgRank: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Rank />
	</SvgWrapper>
)

export const SvgHorizontalRuleSharpIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<HorizontalRuleSharpIcon />
	</SvgWrapper>
)

export const SvgArrowRightAltSharpIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<ArrowRightAltSharpIcon />
	</SvgWrapper>
)

export const SvgChat: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Chat />
	</SvgWrapper>
)

export const SvgSend: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Send />
	</SvgWrapper>
)

export const SvgGlobal: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Global />
	</SvgWrapper>
)

export const SvgDropdownArrow: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<DropdownArrow />
	</SvgWrapper>
)

export const SvgAbility: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Ability />
	</SvgWrapper>
)

export const SvgView: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<View />
	</SvgWrapper>
)

export const SvgDeath: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Death />
	</SvgWrapper>
)

export const SvgApplause: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Applause />
	</SvgWrapper>
)

export const SvgRobot: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Robot />
	</SvgWrapper>
)

export const SvgAssets: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Assets />
	</SvgWrapper>
)

export const SvgShop: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Shop />
	</SvgWrapper>
)

export const SvgProfile: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Profile />
	</SvgWrapper>
)

export const SvgLogout: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Logout />
	</SvgWrapper>
)

export const SvgAppsIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<AppsIcon />
	</SvgWrapper>
)

export const SvgExternalLink: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<ExternalLink />
	</SvgWrapper>
)

export const SvgRefresh: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Refresh />
	</SvgWrapper>
)

export const SvgEmoji: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<Emoji />
	</SvgWrapper>
)

export const SvgInfoCircular: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<InfoCircular />
	</SvgWrapper>
)

export const SvgFastRepair: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
	<SvgWrapper {...props}>
		<FastRepair />
	</SvgWrapper>
)
