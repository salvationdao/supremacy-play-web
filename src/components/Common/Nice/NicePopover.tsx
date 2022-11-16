import { Popover, PopoverProps } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export const NicePopover = ({ children, open, ...props }: PopoverProps) => {
    const theme = useTheme()

    return (
        <Popover
            open={open}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            PaperProps={{
                sx: {
                    backgroundColor: theme.factionTheme.background,
                    borderRadius: 0,
                },
            }}
            {...props}
        >
            <NiceBoxThing border={{ color: `#FFFFFF40`, thickness: "very-lean" }} background={{ colors: ["#FFFFFF10"] }} sx={{ height: "100%" }}>
                {children}
            </NiceBoxThing>
        </Popover>
    )
}
