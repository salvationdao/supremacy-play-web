import { TimePicker } from "@mui/x-date-pickers"
import { useTheme } from "../../../containers/theme"
import { NiceTextField } from "./NiceTextField"

interface NiceTimePickerProps {
    value: Date | null
    onChange: (t: Date | null) => void
    disabled?: boolean
}

export const NiceTimePicker = ({ value, onChange, disabled }: NiceTimePickerProps) => {
    const theme = useTheme()

    return (
        <TimePicker
            inputFormat={"hh:mm A"}
            value={value || null}
            onChange={onChange}
            disabled={disabled}
            renderInput={({ value, ...params }) => (
                <NiceTextField
                    primaryColor={theme.factionTheme.primary}
                    fullWidth
                    value={value as string}
                    type="time"
                    onChange={(value) => params.onChange && params.onChange(value)}
                    sx={{ ".MuiOutlinedInput-root": { pr: 0 } }}
                />
            )}
        />
    )
}
