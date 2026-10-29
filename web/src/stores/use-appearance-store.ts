import { create } from "zustand";
import { DEFAULT_CANVAS_APPEARANCE } from "@/lib/canvas/agent-appearance";
import { DEFAULT_UPDATE_ANNOUNCEMENT, normalizeUpdateAnnouncement } from "@/lib/update-announcement";

import type { PublicAppearance } from "@/services/api/appearance";
import { applySkinTheme, DEFAULT_MIGE_SKIN, normalizeSkinDefinition } from "@/lib/skin-themes";
import { MIGE_BRAND, isMigeBrand } from "@/lib/brand";

export const DEFAULT_PUBLIC_APPEARANCE: PublicAppearance = {
    updates: DEFAULT_UPDATE_ANNOUNCEMENT,
    canvas: DEFAULT_CANVAS_APPEARANCE,
    schemaVersion: 10,
    brandName: MIGE_BRAND.name,
    brandSlug: MIGE_BRAND.slug,
    authHeroTitle: "让脑洞，\n开拍。",
    authHeroDescription: MIGE_BRAND.description,
    logoUrl: "/logo.svg",
    darkLogoUrl: "/logo.svg",
    logoFrameEnabled: false,
    authVideoUrl: "",
    authVideoPosterUrl: "",
    authVideoAutoplay: true,
    skinId: DEFAULT_MIGE_SKIN.id,
    activeSkin: DEFAULT_MIGE_SKIN,
    seoTitle: "米格 MIGE · AI 影像创作工作台",
    seoDescription: "米格，让脑洞，开拍。用画布组织故事、角色与分镜，完成图片、视频、音频与文本创作。",
    seoKeywords: "米格,MIGE,AI影像,短剧创作,分镜,自由画布",
    footerCopyright: `© ${new Date().getFullYear()} 米格 MIGE`,
    icpFilingEnabled: false,
    icpFilingNumber: "",
    redeemPurchaseUrl: "",
    logoConfigured: false,
    darkLogoConfigured: false,
    authVideoConfigured: false,
    authVideoPosterConfigured: false,
    configured: false,
    revision: "builtin",
};

type AppearanceStore = {
    appearance: PublicAppearance;
    resolved: boolean;
    setAppearance: (appearance: PublicAppearance) => void;
};

export const useAppearanceStore = create<AppearanceStore>((set) => ({
    appearance: DEFAULT_PUBLIC_APPEARANCE,
    resolved: false,
    setAppearance: (appearance) => set({ appearance, resolved: true }),
}));

export function normalizePublicAppearance(value?: Partial<PublicAppearance> | null): PublicAppearance {
    const brandName = String(value?.brandName || "").trim();
    const brandSlug = normalizeBrandSlug(value?.brandSlug);
    const authHeroTitle = normalizeAppearanceCopy(value?.authHeroTitle, DEFAULT_PUBLIC_APPEARANCE.authHeroTitle);
    const authHeroDescription = normalizeAppearanceCopy(value?.authHeroDescription, DEFAULT_PUBLIC_APPEARANCE.authHeroDescription, true);
    const customVideo = Boolean(value?.authVideoConfigured);
    const logoUrl = safeAppearanceURL(value?.logoUrl, DEFAULT_PUBLIC_APPEARANCE.logoUrl);
    const darkLogoUrl = safeAppearanceURL(value?.darkLogoUrl, logoUrl);
    const resolvedBrandName = brandName || DEFAULT_PUBLIC_APPEARANCE.brandName;
    const seoTitle = normalizeAppearanceCopy(value?.seoTitle, resolvedBrandName);
    const seoDescription = normalizeAppearanceCopy(value?.seoDescription, `${resolvedBrandName}，面向 AI 影视与短剧创作的工作台。`, true);
    const seoKeywords = normalizeAppearanceCopy(value?.seoKeywords, "", true);
    const footerCopyright = normalizeAppearanceCopy(value?.footerCopyright, `© ${new Date().getFullYear()} ${resolvedBrandName}. All rights reserved.`);
    const icpFilingNumber = normalizeAppearanceCopy(value?.icpFilingNumber, "", true);
    const redeemPurchaseUrl = typeof value?.redeemPurchaseUrl === "string" ? safeAppearanceURL(value.redeemPurchaseUrl, "") : "";
    return {
        ...DEFAULT_PUBLIC_APPEARANCE,
        ...value,
        schemaVersion: 10,
        updates: normalizeUpdateAnnouncement(value?.updates),
        canvas: { ...DEFAULT_CANVAS_APPEARANCE, ...value?.canvas },
        brandName: resolvedBrandName,
        brandSlug,
        authHeroTitle,
        authHeroDescription,
        logoUrl,
        darkLogoUrl,
        logoFrameEnabled: value?.logoFrameEnabled ?? DEFAULT_PUBLIC_APPEARANCE.logoFrameEnabled,
        authVideoUrl: safeAppearanceURL(value?.authVideoUrl, DEFAULT_PUBLIC_APPEARANCE.authVideoUrl),
        authVideoPosterUrl: safeAppearanceURL(value?.authVideoPosterUrl, customVideo ? "" : DEFAULT_PUBLIC_APPEARANCE.authVideoPosterUrl),
        authVideoAutoplay: value?.authVideoAutoplay !== false,
        skinId: normalizeSkinDefinition(value?.activeSkin, DEFAULT_MIGE_SKIN).id,
        activeSkin: normalizeSkinDefinition(value?.activeSkin, DEFAULT_MIGE_SKIN),
        seoTitle,
        seoDescription,
        seoKeywords,
        footerCopyright,
        icpFilingEnabled: Boolean(value?.icpFilingEnabled && icpFilingNumber),
        icpFilingNumber,
        redeemPurchaseUrl,
        logoConfigured: Boolean(value?.logoConfigured),
        darkLogoConfigured: Boolean(value?.darkLogoConfigured),
        authVideoConfigured: customVideo,
        authVideoPosterConfigured: Boolean(value?.authVideoPosterConfigured),
        configured: Boolean(value?.configured),
        revision: String(value?.revision || DEFAULT_PUBLIC_APPEARANCE.revision),
    };
}

function normalizeAppearanceCopy(value: unknown, fallback: string, allowEmpty = false) {
    if (typeof value !== "string") return fallback;
    const normalized = value.replace(/\r\n?/g, "\n").trim();
    return normalized || (allowEmpty ? "" : fallback);
}

export function commitPublicAppearance(value?: Partial<PublicAppearance> | null) {
    const appearance = normalizePublicAppearance(value);
    useAppearanceStore.getState().setAppearance(appearance);
    applySkinTheme(appearance.activeSkin, typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");
    applyAppearanceMetadata(appearance);
    return appearance;
}

export function applyAppearanceMetadata(appearance: PublicAppearance, targetDocument: Document | undefined = typeof document === "undefined" ? undefined : document) {
    if (!targetDocument) return;
    targetDocument.title = appearance.seoTitle || appearance.brandName;
    setMeta(targetDocument, "name", "description", appearance.seoDescription);
    setMeta(targetDocument, "name", "keywords", appearance.seoKeywords);
    setMeta(targetDocument, "property", "og:title", appearance.seoTitle || appearance.brandName);
    setMeta(targetDocument, "property", "og:description", appearance.seoDescription);
    setMeta(targetDocument, "property", "og:site_name", appearance.brandName);
    setMeta(targetDocument, "property", "og:type", "website");
    setMeta(targetDocument, "name", "twitter:card", "summary");
    setMeta(targetDocument, "name", "twitter:title", appearance.seoTitle || appearance.brandName);
    setMeta(targetDocument, "name", "twitter:description", appearance.seoDescription);
    const mode = targetDocument.documentElement.classList.contains("dark") ? "dark" : "light";
    setMeta(targetDocument, "name", "theme-color", appearance.activeSkin.tokens[mode].canvas);
    let favicon = targetDocument.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!favicon) {
        favicon = targetDocument.createElement("link");
        favicon.rel = "icon";
        targetDocument.head.appendChild(favicon);
    }
    favicon.href = appearanceLogoURL(appearance, targetDocument.documentElement.classList.contains("dark") ? "dark" : "light");

    const location = targetDocument.defaultView?.location;
    if (location && (location.protocol === "http:" || location.protocol === "https:")) {
        let canonical = targetDocument.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonical) {
            canonical = targetDocument.createElement("link");
            canonical.rel = "canonical";
            targetDocument.head.appendChild(canonical);
        }
        canonical.href = `${location.origin}${location.pathname}`;
    }
}

function setMeta(targetDocument: Document, attribute: "name" | "property", key: string, content: string) {
    let element = targetDocument.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!content) {
        element?.remove();
        return;
    }
    if (!element) {
        element = targetDocument.createElement("meta");
        element.setAttribute(attribute, key);
        targetDocument.head.appendChild(element);
    }
    element.content = content;
}

export function appearanceLogoURL(appearance: PublicAppearance, theme: "light" | "dark") {
    return theme === "dark" ? appearance.darkLogoUrl || appearance.logoUrl : appearance.logoUrl || appearance.darkLogoUrl;
}

export function brandStudioLabel(appearance: PublicAppearance) {
    if (isMigeBrand(appearance)) return "MIGE / CREATIVE STUDIO";
    return appearance.brandSlug.replace(/-+/g, " ").toLocaleUpperCase();
}

function normalizeBrandSlug(value: unknown) {
    const candidate = String(value || "")
        .trim()
        .toLocaleLowerCase();
    return /^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(candidate) ? candidate : DEFAULT_PUBLIC_APPEARANCE.brandSlug;
}

function safeAppearanceURL(value: unknown, fallback: string) {
    const candidate = String(value || "").trim();
    if (!candidate) return fallback;
    if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
    try {
        const parsed = new URL(candidate);
        if (parsed.protocol === "https:") return parsed.toString();
    } catch {
        // Invalid or unsafe asset locations fall back to the bundled appearance.
    }
    return fallback;
}
