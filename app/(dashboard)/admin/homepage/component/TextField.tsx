import type { FieldValues } from "react-hook-form"
import {getNestedError, type TextInputFieldProps} from "../component/PropsُType";
import {

    Field,

    FieldDescription,

    FieldError,

    FieldGroup,

    FieldLabel,

} from "@/components/ui/field"
import {Input} from "@/components/ui/input";


export function TextField<T extends FieldValues>({form, type, description, name, label, placeholder}: TextInputFieldProps<T>) {
    const {register, formState: {errors}} = form
    const fieldError = getNestedError(errors, name)

    return (
        <Field data-invalid={!!fieldError}>
            <FieldLabel htmlFor={name}>
                {label}
            </FieldLabel>
            <Input
                id={name}
                type={type}
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