import { Action } from "react-fetching-library"

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
