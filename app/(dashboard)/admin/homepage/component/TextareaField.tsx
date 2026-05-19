import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"

import { Textarea } from "@/components/ui/textarea"
import {getNestedError} from "../component/PropsُType";

type Props<T extends FieldValues> = {
    form: UseFormReturn<T>
    name: FieldPath<T>
    label: string
    placeholder?: string
    description?: string
}

export function TextareaField<T extends FieldValues>({
                                  form,
                                  name,
                                  label,
                                  placeholder,
                                  description,
                              }: Props<T>) {
    const {
        register,
        formState: { errors },
    } = form

    const fieldError = getNestedError(errors, name)

    return (
        <Field data-invalid={!!fieldError}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <Textarea
                id={name}
                placeholder={placeholder}
                aria-invalid={!!fieldError}
                {...register(name)}
            />

            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}

            {fieldError?.message && (
                <FieldError>{String(fieldError.message)}</FieldError>
            )}
        </Field>
    )
}
