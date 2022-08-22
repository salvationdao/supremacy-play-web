import { Action } from "react-fetching-library"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SetupCheckout = (formValues: any): Action<string> => {
    return {
        method: "POST",
        endpoint: `/fiat-checkout`,
        credentials: "include",
        responseType: "json",
        body: formValues,
    }
}
