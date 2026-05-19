"use client"

import React, { useEffect } from 'react';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


import {adminEmptyContent} from "../form/emptyContent";
import {
    AdminContentFormInput,
    AdminContentFormValues,
    adminContentSchema
} from "../form/adminContentSchema";
import {HeroTab} from "../tabs/HeroTab";
import GalleryTab from "../tabs/GalleryTab";
import LensTab from "../tabs/LensTab";
import StoriesTab from "../tabs/StoriesTab";
import ServicesTab from "../tabs/ServicesTab";
import AboutTab from "../tabs/AboutTab";
import ContactTab from "../tabs/ContactTab";
import SeoTab from "../tabs/SeoTab";
import { useGetSiteContentQuery } from "@/lib/store/api";

const Page = () => {
    const { data: siteContent, isLoading } = useGetSiteContentQuery();

    const form = useForm<AdminContentFormInput, unknown, AdminContentFormValues>({
        resolver: zodResolver(adminContentSchema),
        defaultValues: adminEmptyContent,
    })

    useEffect(() => {
        if (siteContent?.data) {
            form.reset(siteContent.data)
        }
    }, [siteContent, form])

    const watchedValues = form.watch()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Admin Content</h1>
                <p className="text-sm text-muted-foreground">
                    {isLoading
                        ? "Loading…"
                        : "Edit website content sections. Each tab saves independently."}
                </p>
            </div>
            <Form {...form}>
                <Tabs defaultValue={"hero"} className="w-full">
                    <TabsList className="grid w-full grid-cols-8">
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="lens">Lens</TabsTrigger>
                        <TabsTrigger value="stories">Stories</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero">
                        <HeroTab form={form} />
                    </TabsContent>

                    <TabsContent value={"gallery"}>
                        <GalleryTab form={form} />
                    </TabsContent>

                    <TabsContent value={"lens"}>
                        <LensTab form={form} />
                    </TabsContent>

                    <TabsContent value={"stories"}>
                        <StoriesTab form={form} />
                    </TabsContent>

                    <TabsContent value={"services"}>
                        <ServicesTab form={form} />
                    </TabsContent>

                    <TabsContent value={"about"}>
                        <AboutTab form={form} />
                    </TabsContent>

                    <TabsContent value={"contact"}>
                        <ContactTab form={form} />
                    </TabsContent>

                    <TabsContent value={"seo"}>
                        <SeoTab form={form} />
                    </TabsContent>
                </Tabs>
            </Form>
        </div>
    );
};

export default Page;
