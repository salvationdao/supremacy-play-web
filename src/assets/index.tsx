import { ReactElement } from 'react'
import { Stack } from '@mui/material'
import { colors } from '../theme/theme'

import SupToken from '!react-svg-loader!./svg/SupToken.svg'
import MapWarMachine from '!react-svg-loader!./svg/MapWarMachine.svg'
import FlagSharpIcon from '@mui/icons-material/FlagSharp'
import PersonSharpIcon from '@mui/icons-material/PersonSharp'
import MapSharpIcon from '@mui/icons-material/MapSharp'
import CampaignSharpIcon from '@mui/icons-material/CampaignSharp'
import WorkspacesSharpIcon from '@mui/icons-material/WorkspacesSharp'
import { SxProps } from '@mui/system'

export const SvgWrapper = ({
    children,
    size,
    fill,
    sx,
}: {
    children: ReactElement
    size?: string
    fill?: string
    sx?: SxProps
}) => {
    return (
        <Stack
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                '& > svg': {
                    width: size || '20px',
                    height: size || '20px',
                    fill: fill || colors.text,
                },
                ...sx,
            }}
        >
            {children}
        </Stack>
    )
}

export const SvgSupToken = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <SupToken />
    </SvgWrapper>
)

export const SvgSyndicateFlag = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <FlagSharpIcon />
    </SvgWrapper>
)

export const SvgUser = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <PersonSharpIcon />
    </SvgWrapper>
)

export const SvgMapWarMachine = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <MapWarMachine />
    </SvgWrapper>
)

export const SvgMapSharpIcon = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <MapSharpIcon />
    </SvgWrapper>
)

export const SvgActivities = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <CampaignSharpIcon />
    </SvgWrapper>
)

export const SvgActions = ({ size, fill, sx }: { size?: string; fill?: string; sx?: SxProps }) => (
    <SvgWrapper size={size} fill={fill} sx={sx}>
        <WorkspacesSharpIcon />
    </SvgWrapper>
)
