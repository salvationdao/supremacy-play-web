import { Switch, SwitchProps } from "@mui/material"
import { ResponsiveStyleValue } from "@mui/system"
import { Property } from "csstype"
import { useTheme } from "../../../containers/theme"

export interface NiceSwitchProps extends Omit<SwitchProps, "color"> {
    color?: ResponsiveStyleValue<Property.Color | undefined>
}

export const NiceSwitch = ({ color, sx, ...props }: NiceSwitchProps) => {
    const theme = useTheme()
    const realColor = color ? color : theme.factionTheme.primary

    return (
        <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            sx={{
                width: 44,
                height: 22,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                    padding: 0,
                    m: "2px",
                    transitionDuration: "300ms",
                    "&.Mui-checked": {
                        transform: "translateX(22px)",
                        color: realColor,
                        "& + .MuiSwitch-track": {
                            backgroundColor: `${realColor}44`,
                            opacity: 1,
                            border: 0,
                        },
                        "&.Mui-disabled + .MuiSwitch-track": {
                            opacity: 0.5,
                        },
                    },
                    "&.Mui-focusVisible .MuiSwitch-thumb": {
                        color: realColor,
                        border: "6px solid #fff",
                    },
                    "&.Mui-disabled .MuiSwitch-thumb": {
                        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
                    },
                    "&.Mui-disabled + .MuiSwitch-track": {
                        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
                    },
                },
                "& .MuiSwitch-thumb": {
                    boxSizing: "border-box",
                    width: 18,
                    height: 18,
                },
                "& .MuiSwitch-track": {
                    borderRadius: 22 / 2,
                    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
                    opacity: 1,
                    transition: theme.transitions.create(["background-color"], {
                        duration: 500,
                    }),
                },
                ...sx,
            }}
            {...props}
        />
    )
}
