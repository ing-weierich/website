export interface NavItem {
    title: string;
    slug: string;
    children?: NavItem[];
}

export interface PageMeta {
    title?: string;
    description?: string;
}

export interface ImageData {
    url: string;
    title?: string;
    width?: number;
    height?: number;
}

export interface Module {
    type: string;
    data: Record<string, any>;
}

export interface SectionBackground {
    color?: string;
    noPadding?: boolean;
}

export interface Section {
    background: SectionBackground;
    modules: Module[];
}

export interface Page {
    slug: string;
    meta?: PageMeta;
    sections: Section[];
}

const DEFAULT_BACKGROUND = '#f0f0f0';

/**
 * Stellt dem seitenrelativen Pfad den konfigurierten `base`-Pfad voran.
 * Bei base '/' bleibt der Pfad unverändert, bei '/website' wird '/website/logo.svg' daraus.
 */
export function withBase(path: string): string {
    if (!path.startsWith('/')) {
        return path;
    }

    return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

const pageModules = import.meta.glob<Page>('../../data/pages/*.json', { eager: true, import: 'default' });

const navMainRaw = import.meta.glob<NavItem[]>('../../data/navigation/main.json', { eager: true, import: 'default' });
const navFooterRaw = import.meta.glob<NavItem[]>('../../data/navigation/footer.json', { eager: true, import: 'default' });

function normalizePage(slug: string, page: Page): Page {
    return {
        ...page,
        slug,
        sections: (page.sections ?? []).map((section) => ({
            ...section,
            background: {
                ...section.background,
                color: section.background?.color || DEFAULT_BACKGROUND,
            },
            modules: section.modules ?? [],
        })),
    };
}

export const pages: Page[] = Object.entries(pageModules)
    .map(([filePath, page]) => normalizePage(filePath.split('/').pop()!.replace(/\.json$/, ''), page))
    .sort((a, b) => a.slug.localeCompare(b.slug));

export function getPage(slug: string): Page | undefined {
    return pages.find((page) => page.slug === slug);
}

export const navMain: NavItem[] = Object.values(navMainRaw)[0] ?? [];
export const navFooter: NavItem[] = Object.values(navFooterRaw)[0] ?? [];

export const currentYear = new Date().getFullYear();

export function toURL(value: unknown): string {
    if (typeof value !== 'string') {
        return '#';
    }

    const trimmed = value.trim();
    if (trimmed === '') {
        return '#';
    }

    if (/^(https?:\/\/|mailto:|tel:|#)/.test(trimmed)) {
        return trimmed;
    }

    if (trimmed.startsWith('/')) {
        return withBase(trimmed);
    }

    return withBase('/' + trimmed.replace(/\/$/, ''));
}
