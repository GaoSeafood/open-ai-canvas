import { MIGE_BRAND, isMigeBrand } from "@/lib/brand";
import { useAppearanceStore } from "@/stores/use-appearance-store";

/** Brand illustration is decorative; custom site identities retain their own space. */
export function BrandMascot({ className }: { className?: string }) {
    const appearance = useAppearanceStore((state) => state.appearance);
    if (!isMigeBrand(appearance)) return null;
    return <img className={className} src={MIGE_BRAND.mascot} alt="" aria-hidden="true" width={1448} height={1086} decoding="async" draggable={false} />;
}
