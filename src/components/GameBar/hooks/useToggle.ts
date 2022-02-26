import { useState, useCallback } from "react"

export const useToggle = (initialValue: any = false) => {
	const [value, setValue] = useState(initialValue)

	const toggleValue = useCallback((value: any) => {
		setValue((currentValue: any) => (typeof value === "boolean" ? value : !currentValue))
	}, [])

	return [value, toggleValue]
}
