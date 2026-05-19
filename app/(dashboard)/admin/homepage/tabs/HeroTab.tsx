import {UseFormReturn} from "react-hook-form";
import {AdminContentFormValues} from "../form/adminContentSchema";
import {ImageField} from "../component/ImageField";
import {TextField} from "../component/TextField";
import {SectionSaveBar} from "../component/SectionSaveBar";

type Props = {
    form: UseFormReturn<AdminContentFormValues>
}

export function HeroTab({ form }: Props) {
    return (
        <div className="space-y-4 pt-6">
            <SectionSaveBar form={form} section="hero" label="Hero" />
            <div className="grid gap-4 md:grid-cols-2">
            <ImageField form={form} name="hero.leftImage" label="Left image" />
            <ImageField form={form} name="hero.rightImage" label="Right image" />
            <ImageField form={form} name="hero.insetImage" label="Inset image" />

            <TextField form={form} name="hero.leftMetaName" label="Top-left meta name" />

            <TextField form={form} name="hero.cardName" label="Card name" />

            <TextField form={form} name="hero.cardLocation" label="Card location" />

            <TextField form={form} name="hero.cardEyebrow" label="Card eyebrow" />

            <TextField form={form} name="hero.cardHeadlineLine1" label="Card headline line 1" />

            <TextField form={form} name="hero.cardHeadlineLine2" label="Card headline line 2" />

            <TextField form={form} name="hero.bottomCaptionLine1" label="Bottom caption line 1" />

            <TextField form={form} name="hero.bottomCaptionLine2" label="Bottom caption line 2" />

            <TextField form={form} name="hero.rightImageLabel" label="Right image label" />

            <TextField form={form} name="hero.rightImageCaption" label="Right image caption" />

            <TextField form={form} name="hero.rightHeadlineTop" label="Right headline top" />

            <TextField form={form} name="hero.rightHeadlineMid1" label="Right headline mid left" />

            <TextField form={form} name="hero.rightHeadlineMid2" label="Right headline mid right" />

            <TextField form={form} name="hero.rightItalic1" label="Right italic line 1" />

            <TextField form={form} name="hero.rightItalic2" label="Right italic line 2" />

            <TextField form={form} name="hero.exploreLabel" label="Explore button label" />
            </div>
        </div>
    )
}
