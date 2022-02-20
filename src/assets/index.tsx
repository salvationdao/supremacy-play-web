import MapWarMachine from '!react-svg-loader!./svg/MapWarMachine.svg'
import Skull from '!react-svg-loader!./svg/Skull.svg'
import MapSkull from '!react-svg-loader!./svg/MapSkull.svg'
import SupToken from '!react-svg-loader!./svg/SupToken.svg'
import Resize from '!react-svg-loader!./svg/Resize.svg'
import Chat from '!react-svg-loader!./svg/Chat.svg'
import User from '!react-svg-loader!./svg/User.svg'
import Info from '!react-svg-loader!./svg/Info.svg'
import InfoCircular from '!react-svg-loader!./svg/InfoCircular.svg'
import Applause from '!react-svg-loader!./svg/Applause.svg'
import Fullscreen from '!react-svg-loader!./svg/Fullscreen.svg'
import Unknown from '!react-svg-loader!./svg/Unknown.svg'
import Volume from '!react-svg-loader!./svg/Volume.svg'
import Settings from '!react-svg-loader!./svg/Settings.svg'
import Damage from '!react-svg-loader!./svg/Damage.svg'
import Drag from '!react-svg-loader!./svg/Drag.svg'
import CampaignSharpIcon from '@mui/icons-material/CampaignSharp'
import FlagSharpIcon from '@mui/icons-material/FlagSharp'
import MapSharpIcon from '@mui/icons-material/MapSharp'
import WorkspacesSharpIcon from '@mui/icons-material/WorkspacesSharp'
import AccessTimeSharpIcon from '@mui/icons-material/AccessTimeSharp'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { Box, BoxProps } from '@mui/system'
import { colors } from '../theme/theme'
import GenericWarMachinePNG from './images/GenericWarMachine.png'
import FlamesPNG from './images/Flames.png'

export { GenericWarMachinePNG, FlamesPNG }

interface SvgWrapperProps extends BoxProps {
    size?: string
    fill?: string
}

export const SvgWrapper: React.FC<SvgWrapperProps> = ({ fill, sx, size, ...props }: SvgWrapperProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pb: 0.3,
                '& > svg': {
                    width: size || '20px',
                    height: size || '20px',
                    fill: fill || colors.text,
                },
                ...sx,
            }}
            {...props}
        />
    )
}

export const SvgSupToken: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <SupToken />
    </SvgWrapper>
)

export const SvgSyndicateFlag: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <FlagSharpIcon />
    </SvgWrapper>
)

export const SvgSkull: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Skull />
    </SvgWrapper>
)

export const SvgMapSkull: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <MapSkull />
    </SvgWrapper>
)

export const SvgMapWarMachine: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <MapWarMachine />
    </SvgWrapper>
)

export const SvgMapSharpIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <MapSharpIcon />
    </SvgWrapper>
)

export const SvgActivities: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <CampaignSharpIcon />
    </SvgWrapper>
)

export const SvgActions: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <WorkspacesSharpIcon />
    </SvgWrapper>
)

export const SvgResizeArrow: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Resize />
    </SvgWrapper>
)

export const SvgDrag: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Drag />
    </SvgWrapper>
)

export const SvgCooldown: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <AccessTimeSharpIcon />
    </SvgWrapper>
)

export const SvgPriceUpArrow: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <ArrowDropUpIcon />
    </SvgWrapper>
)

export const SvgPriceDownArrow: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <ArrowDropDownIcon />
    </SvgWrapper>
)

export const SvgApplause: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Applause />
    </SvgWrapper>
)

export const SvgSettings: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Settings />
    </SvgWrapper>
)

export const SvgFullscreen: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Fullscreen />
    </SvgWrapper>
)

export const SvgVolume: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Volume />
    </SvgWrapper>
)

export const SvgUser: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <User />
    </SvgWrapper>
)

export const SvgBattleAbilityIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Unknown />
    </SvgWrapper>
)

export const SvgChatIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Chat />
    </SvgWrapper>
)

export const SvgInfoIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Info />
    </SvgWrapper>
)

export const SvgInfoCircularIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <InfoCircular />
    </SvgWrapper>
)

export const SvgDamageIcon: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <Damage />
    </SvgWrapper>
)

export const SvgDamageCross: React.VoidFunctionComponent<SvgWrapperProps> = (props) => (
    <SvgWrapper {...props}>
        <CloseSharpIcon />
    </SvgWrapper>
)
