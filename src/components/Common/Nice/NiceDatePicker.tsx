import { DatePicker } from "@mui/x-date-pickers"
import { useTheme } from "../../../containers/theme"
import { NiceTextField } from "./NiceTextField"

interface NiceDatePickerProps {
    value: Date | null
    onChange: (v: Date | null) => void
    disabled?: boolean
    minDate?: Date
}

export const NiceDatePicker = ({ value, onChange, disabled, minDate }: NiceDatePickerProps) => {
    const theme = useTheme()

    return (
        <DatePicker
            inputFormat={"DD/MM/YYYY"}
            value={value || null}
            onChange={onChange}
            minDate={minDate || new Date()}
            disabled={disabled}
            renderInput={({ value, ...params }) => (
                <NiceTextField
                    primaryColor={theme.factionTheme.primary}
                    fullWidth
                    value={value as string}
                    type="date"
                    onChange={(value) => params.onChange && params.onChange(value)}
                    sx={{ ".MuiOutlinedInput-root": { pr: 0 } }}
                />
            )}
        />
    )
}
