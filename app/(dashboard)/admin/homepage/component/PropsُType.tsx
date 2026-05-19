import {FieldPath, FieldValues, UseFormReturn} from "react-hook-form";

export type TextInputFieldProps<T extends FieldValues = FieldValues> = {
    form: UseFormReturn<T>
    name: FieldPath<T>
    label: string
    placeholder?: string
    description?: string
    type?: string
}



export function getNestedError(errors: unknown, path: string): any {

    return path.split(".").reduce((acc: any, key) => {

        if (!acc) return undefined

        if (/^\d+$/.test(key)) {

            return acc[Number(key)]

        }

        return acc[key]

    }, errors)

}
