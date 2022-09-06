import { Action } from "react-fetching-library"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateCheckoutSession = (formValues: any): Action<string> => {
    return {
        method: "POST",
        endpoint: `/package-checkout`,
        credentials: "include",
        responseType: "json",
        body: formValues,
    }
}

export {}
