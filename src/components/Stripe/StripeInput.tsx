import React, { useState, useImperativeHandle } from "react"
import { useTheme } from "@mui/material/styles"
import { InputBaseComponentProps } from "@mui/material/InputBase"
import { fonts } from "../../theme/theme"

export interface StripeGenericChangeEvent {
    complete: boolean
    error?: {
        type: string
        code: string
        message: string
    }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const StripeInput = React.forwardRef<any, InputBaseComponentProps>(function StripeInput(props, ref) {
    const { component: Component, options, ...other } = props
    const theme = useTheme()
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [mountNode, setMountNode] = useState<any | null>(null)

    useImperativeHandle(
        ref,
        () => ({
            focus: () => mountNode.focus(),
        }),
        [mountNode],
    )

    return (
        <Component
            onReady={setMountNode}
            options={{
                ...options,
                style: {
                    base: {
                        color: theme.palette.text.primary,
                        fontFamily: fonts.shareTech,
                        fontSize: "13.2px",
                    },
                    invalid: {
                        color: theme.palette.text.primary,
                    },
                },
            }}
            {...other}
        />
    )
})
