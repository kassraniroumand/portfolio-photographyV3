import {AdminContentFormValues} from "../form/adminContentSchema";

export const adminEmptyContent: AdminContentFormValues = {

    hero: {

        leftImage: "",

        rightImage: "",

        insetImage: "",

        leftMetaName: "",

        cardName: "",

        cardLocation: "",

        cardEyebrow: "",

        cardHeadlineLine1: "",

        cardHeadlineLine2: "",

        bottomCaptionLine1: "",

        bottomCaptionLine2: "",

        rightImageLabel: "",

        rightImageCaption: "",

        rightHeadlineTop: "",

        rightHeadlineMid1: "",

        rightHeadlineMid2: "",

        rightItalic1: "",

        rightItalic2: "",

        exploreLabel: "",

    },

    gallery: {

        eyebrow: "",

        headline: "",

        intro: "",

        works: [],

    },

    lens: {

        eyebrow: "",

        headline: "",

        intro: "",

        frames: [],

    },

    stories: {

        eyebrow: "",

        headline: "",

        intro: "",

        items: [],

    },

    services: {

        eyebrow: "",

        headline: "",

        items: [],

    },

    about: {

        eyebrow: "",

        headlineLine1: "",

        headlineLine2: "",

        lead: "",

        body1: "",

        body2: "",

        stats: [

            { k: "", v: "" },

            { k: "", v: "" },

            { k: "", v: "" },

        ],

    },

    contact: {

        eyebrow: "",

        headlineLine1: "",

        headlineLine2: "",

        email: "",

        studioLine1: "",

        studioLine2: "",

        instagramUrl: "",

        arenaUrl: "",

        cta: "",

        footerLeft: "",

        footerRight: "",

    },

    seo: {

        title: "",

        description: "",

        keywords: [],

        canonicalPath: "/",

        robotsIndex: true,

        robotsFollow: true,

        openGraph: {

            title: "",

            description: "",

            siteName: "",

            locale: "en_US",

            type: "website",

            image: "",

            imageAlt: "",

        },

        twitter: {

            card: "summary_large_image",

            title: "",

            description: "",

            image: "",

        },

        schemaType: "Person",

    },

}
