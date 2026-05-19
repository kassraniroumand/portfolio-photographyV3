"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form } from "@/components/ui/form"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    portfolioSchema,
    type PortfolioFormInput,
    type PortfolioFormValues,
} from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"
import { emptyPortfolio } from "@/app/(dashboard)/admin/portfolio/page/form/emptyPortfolio"
import IntroTab from "@/app/(dashboard)/admin/portfolio/page/tabs/IntroTab"
import PhotosTab from "@/app/(dashboard)/admin/portfolio/page/tabs/PhotosTab"
import VideosTab from "@/app/(dashboard)/admin/portfolio/page/tabs/VideosTab"
import PortfolioSeoTab from "@/app/(dashboard)/admin/portfolio/page/tabs/PortfolioSeoTab"
import { useGetPortfolioQuery } from "@/lib/store/api"

const PortfolioForm = () => {
    const { data: record, isLoading } = useGetPortfolioQuery()

    const form = useForm<PortfolioFormInput, unknown, PortfolioFormValues>({
        resolver: zodResolver(portfolioSchema),
        defaultValues: emptyPortfolio,
    })

    useEffect(() => {
        if (record?.data) {
            const loaded = record.data as Partial<PortfolioFormValues>
            const loadedSeo: Partial<PortfolioFormValues["seo"]> = loaded.seo ?? {}
            form.reset({
                ...emptyPortfolio,
                ...loaded,
                intro: { ...emptyPortfolio.intro, ...(loaded.intro ?? {}) },
                seo: {
                    ...emptyPortfolio.seo,
                    ...loadedSeo,
                    openGraph: {
                        ...emptyPortfolio.seo.openGraph,
                        ...(loadedSeo.openGraph ?? {}),
                    },
                    twitter: {
                        ...emptyPortfolio.seo.twitter,
                        ...(loadedSeo.twitter ?? {}),
                    },
                },
            })
        }
    }, [record, form])

    const watchedValues = form.watch()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Portfolio</h1>
                <p className="text-sm text-muted-foreground">
                    {isLoading
                        ? "Loading…"
                        : "Manage the public /portfolio homepage. Each tab saves independently."}
                </p>
            </div>

            <Form {...form}>

                <Tabs defaultValue="intro" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="intro">Intro</TabsTrigger>
                        <TabsTrigger value="photo">Photo</TabsTrigger>
                        <TabsTrigger value="video">Video</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="intro">
                        <IntroTab form={form} />
                    </TabsContent>
                    <TabsContent value="photo">
                        <PhotosTab form={form} />
                    </TabsContent>
                    <TabsContent value="video">
                        <VideosTab form={form} />
                    </TabsContent>
                    <TabsContent value="seo">
                        <PortfolioSeoTab form={form} />
                    </TabsContent>
                </Tabs>
            </Form>
        </div>
    )
}

export default PortfolioForm
