export const MIGE_BRAND = {
    name: "米格",
    slug: "mige",
    wordmark: "MIGE",
    tagline: "让脑洞，开拍。",
    description: "从一个画面、一个角色或一句话开始，让灵感走向银幕。",
    mascot: "/images/brand/mige-storyboard.png",
} as const;

export function isMigeBrand(appearance: { brandName: string; brandSlug: string }) {
    return appearance.brandName === MIGE_BRAND.name && appearance.brandSlug === MIGE_BRAND.slug;
}
