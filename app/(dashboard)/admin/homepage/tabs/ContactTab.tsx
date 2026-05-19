"use client"

import React from "react"
import { UseFormReturn } from "react-hook-form"
import { AdminContentFormValues } from "../form/adminContentSchema"
import { TextField } from "../component/TextField"
import { SectionSaveBar } from "../component/SectionSaveBar"

type Props = {
    form: UseFormReturn<AdminContentFormValues>
}

const ContactTab = ({ form }: Props) => {
    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="contact" label="Contact" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="contact.eyebrow" label="Eyebrow" />
                <TextField
                    form={form}
                    name="contact.headlineLine1"
                    label="Headline line 1"
                />
                <TextField
                    form={form}
                    name="contact.headlineLine2"
                    label="Headline line 2"
                />
                <TextField
                    form={form}
                    name="contact.email"
                    label="Email"
                    type="email"
                    placeholder="hello@example.com"
                />
                <TextField
                    form={form}
                    name="contact.studioLine1"
                    label="Studio address line 1"
                />
                <TextField
                    form={form}
                    name="contact.studioLine2"
                    label="Studio address line 2"
                />
                <TextField
                    form={form}
                    name="contact.instagramUrl"
                    label="Instagram URL"
                />
                <TextField
                    form={form}
                    name="contact.arenaUrl"
                    label="Are.na URL"
                />
                <TextField form={form} name="contact.cta" label="CTA label" />
                <TextField
                    form={form}
                    name="contact.footerLeft"
                    label="Footer left"
                />
                <TextField
                    form={form}
                    name="contact.footerRight"
                    label="Footer right"
                />
            </div>
        </div>
    )
}

export default ContactTab
