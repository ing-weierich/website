/* eslint-disable no-console */
const apollo = require('@apollo/client');
const fetch = require('cross-fetch');
const gql = require('graphql-tag');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { documentToReactComponents } = require('@contentful/rich-text-react-renderer');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || process.env.SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || process.env.TOKEN;
const ENV = process.env.CONTENTFUL_ENV || 'master';
const USE_LEGACY_URL = process.env.CONTENTFUL_USE_LEGACY_URL === 'true';
const OUTPUT_DIR = process.env.CONTENTFUL_OUTPUT_DIR || path.join(process.cwd(), 'data');
const ASSET_DIR = path.join(process.cwd(), 'public', 'assets', 'contentful');
const CONCURRENCY = Number(process.env.CONTENTFUL_CONCURRENCY || 5);
const KEEP_RICHTEXT_JSON = process.env.KEEP_RICHTEXT_JSON === 'true';

if (!SPACE_ID || !TOKEN) {
    console.error('Missing CONTENTFUL_SPACE_ID/SPACE_ID or CONTENTFUL_ACCESS_TOKEN/TOKEN in env.');
    process.exit(1);
}

const GRAPHQL_ENDPOINT = USE_LEGACY_URL
    ? `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}?access_token=${TOKEN}`
    : `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENV}?access_token=${TOKEN}`;

const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: GRAPHQL_ENDPOINT, fetch }),
    cache: new apollo.InMemoryCache(),
    defaultOptions: {
        query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
        watchQuery: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
    },
});

const STATIC_PATHS = gql`
    query staticPaths($skip: Int!, $limit: Int!) {
        pageCollection(skip: $skip, limit: $limit) {
            total
            items {
                slug
            }
        }
    }
`;

const PAGE_DATA = gql`
    query pageData($slug: String!) {
        pageCollection(limit: 1, where: { slug: $slug }) {
            items {
                sys {
                    id
                }
                seo {
                    metaTitle
                    metaDescription
                }
                openGraph {
                    title
                    url
                    type
                    description
                    imagesCollection {
                        items {
                            url
                            width
                            height
                            title
                        }
                    }
                }
                articlesCollection {
                    items {
                        sys {
                            id
                        }
                        ... on Article {
                            color
                            noPadding
                            modulesCollection {
                                items {
                                    sys {
                                        id
                                    }
                                    __typename
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const MAIN_NAVIGATION = gql`
    query mainNavigation {
        pageCollection(limit: 1000, order: index_ASC, where: { mainNavigation: true }) {
            items {
                sys {
                    id
                }
                title
                slug
                parent {
                    sys {
                        id
                    }
                }
            }
        }
    }
`;

const FOOTER_NAVIGATION = gql`
    query footerNavigation {
        pageCollection(limit: 1000, order: index_ASC, where: { footerNavigation: true }) {
            items {
                sys {
                    id
                }
                title
                slug
                parent {
                    sys {
                        id
                    }
                }
            }
        }
    }
`;

const MODULE_QUERIES = {
    ModuleText: gql`
        query moduleTextById($id: String!) {
            moduleText(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                topline
                buttonLabel
                buttonLink {
                    slug
                }
                text {
                    json
                }
            }
        }
    `,
    ModuleImageText: gql`
        query moduleImageTextById($id: String!) {
            moduleImageText(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                image {
                    url
                    width
                    height
                    title
                }
                text {
                    json
                }
            }
        }
    `,
    ModuleCards: gql`
        query moduleCardsById($id: String!) {
            moduleCards(id: $id) {
                sys {
                    id
                }
                __typename
                cardsCollection {
                    items {
                        image {
                            url
                            width
                            height
                            title
                        }
                        headline
                        text {
                            json
                        }
                    }
                }
            }
        }
    `,
    ModuleAkkordeons: gql`
        query moduleAkkordeonsById($id: String!) {
            moduleAkkordeons(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                accordeonsCollection {
                    items {
                        label
                        text {
                            json
                        }
                        title
                    }
                }
            }
        }
    `,
    ModuleHtml: gql`
        query moduleHtmlById($id: String!) {
            moduleHtml(id: $id) {
                sys {
                    id
                }
                __typename
                html
            }
        }
    `,
    ModuleHeadlines: gql`
        query moduleHeadlinesById($id: String!) {
            moduleHeadlines(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                subheadline
            }
        }
    `,
    ModuleSlider: gql`
        query moduleSliderById($id: String!) {
            moduleSlider(id: $id) {
                sys {
                    id
                }
                __typename
                imagesCollection {
                    items {
                        url
                        title
                    }
                }
            }
        }
    `,
    ModuleStage: gql`
        query moduleStageById($id: String!) {
            moduleStage(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                subheadline
                image {
                    url
                    title
                    width
                    height
                }
            }
        }
    `,
    ModuleExample: gql`
        query moduleExampleById($id: String!) {
            moduleExample(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                subline
            }
            test: moduleExample(id: $id) {
                sys {
                    id
                }
                __typename
                headline
                subline
            }
        }
    `,
};

const ASSET_URL_REGEX = /(https?:\/\/images\.ctfassets\.net\/[^\s"'<>]+|\/\/images\.ctfassets\.net\/[^\s"'<>]+)/g;
const assetMap = new Map();

const normalizeAssetUrl = (rawUrl) => {
    if (!rawUrl) {
        return null;
    }
    if (rawUrl.startsWith('//')) {
        return `https:${rawUrl}`;
    }
    return rawUrl;
};

const getLocalAssetPaths = (rawUrl) => {
    const normalized = normalizeAssetUrl(rawUrl);
    const url = new URL(normalized);
    const parts = url.pathname.split('/').filter(Boolean);
    const assetId = parts[1] || 'asset';
    const fileName = parts[2] || 'asset';
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const localFileName = `${assetId}-${safeFileName}`;
    return {
        sourceUrl: normalized,
        publicPath: `/assets/contentful/${localFileName}`,
        filePath: path.join(ASSET_DIR, localFileName),
    };
};

const ensureAsset = (rawUrl) => {
    const normalized = normalizeAssetUrl(rawUrl);
    if (!normalized) {
        return null;
    }
    if (!assetMap.has(normalized)) {
        assetMap.set(normalized, getLocalAssetPaths(normalized));
    }
    return assetMap.get(normalized);
};

const rewriteAssetsInString = (value) => {
    return value.replace(ASSET_URL_REGEX, (match) => {
        const asset = ensureAsset(match);
        return asset ? asset.publicPath : match;
    });
};

const rewriteAssetsInObject = (node) => {
    if (!node) {
        return node;
    }

    if (Array.isArray(node)) {
        node.forEach((item, index) => {
            node[index] = rewriteAssetsInObject(item);
        });
        return node;
    }

    if (typeof node === 'object') {
        Object.keys(node).forEach((key) => {
            node[key] = rewriteAssetsInObject(node[key]);
        });
        return node;
    }

    if (typeof node === 'string' && node.includes('images.ctfassets.net')) {
        return rewriteAssetsInString(node);
    }

    return node;
};

const richTextToHtml = (richText) => {
    if (!richText?.json) {
        return '';
    }
    const elements = documentToReactComponents(richText.json);
    return renderToStaticMarkup(React.createElement(React.Fragment, null, elements));
};

const convertModuleRichText = (module) => {
    if (!module || typeof module !== 'object') {
        return;
    }

    if (module.moduleText?.text?.json) {
        module.moduleText.text.html = richTextToHtml(module.moduleText.text);
        if (!KEEP_RICHTEXT_JSON) {
            delete module.moduleText.text.json;
        }
    }

    if (module.moduleImageText?.text?.json) {
        module.moduleImageText.text.html = richTextToHtml(module.moduleImageText.text);
        if (!KEEP_RICHTEXT_JSON) {
            delete module.moduleImageText.text.json;
        }
    }

    if (module.moduleCards?.cardsCollection?.items?.length) {
        module.moduleCards.cardsCollection.items.forEach((item) => {
            if (item?.text?.json) {
                item.text.html = richTextToHtml(item.text);
                if (!KEEP_RICHTEXT_JSON) {
                    delete item.text.json;
                }
            }
        });
    }

    if (module.moduleAkkordeons?.accordeonsCollection?.items?.length) {
        module.moduleAkkordeons.accordeonsCollection.items.forEach((item) => {
            if (item?.text?.json) {
                item.text.html = richTextToHtml(item.text);
                if (!KEEP_RICHTEXT_JSON) {
                    delete item.text.json;
                }
            }
        });
    }
};

const convertPageRichText = (pageData) => {
    const articles = pageData?.articlesCollection?.items;
    if (!articles?.length) {
        return;
    }
    articles.forEach((article) => {
        const modules = article?.modulesCollection?.items || [];
        modules.forEach((module) => {
            convertModuleRichText(module);
        });
    });
};

const mapWithConcurrency = async (items, limit, mapper) => {
    const result = new Array(items.length);
    let index = 0;
    const workerCount = Math.min(limit, items.length);

    const workers = Array.from({ length: workerCount }, async () => {
        while (index < items.length) {
            const current = index;
            index += 1;
            result[current] = await mapper(items[current], current);
        }
    });

    await Promise.all(workers);
    return result;
};

const fetchAllPageSlugs = async () => {
    const slugs = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const response = await client.query({ query: STATIC_PATHS, variables: { skip, limit } });
        const collection = response?.data?.pageCollection;
        const items = collection?.items || [];
        items.forEach((item) => {
            if (item?.slug !== undefined && item?.slug !== null) {
                slugs.push(item.slug);
            }
        });
        skip += items.length;
        if (items.length === 0 || skip >= (collection?.total || 0)) {
            break;
        }
    }

    return slugs;
};

const fetchPageBySlug = async (slug) => {
    const response = await client.query({ query: PAGE_DATA, variables: { slug } });
    return response?.data?.pageCollection?.items?.[0] || null;
};

const fetchModuleData = async (module) => {
    const query = MODULE_QUERIES[module.__typename];
    if (!query) {
        console.warn(`Missing module query for ${module.__typename}`);
        return module;
    }

    const response = await client.query({ query, variables: { id: module.sys.id } });
    return { ...module, ...response?.data };
};

const hydrateModules = async (pageData) => {
    const articles = pageData?.articlesCollection?.items;
    if (!articles?.length) {
        return;
    }

    for (let i = 0; i < articles.length; i += 1) {
        const article = articles[i];
        const modules = article?.modulesCollection?.items || [];
        if (!modules.length) {
            continue;
        }
        article.modulesCollection.items = await mapWithConcurrency(modules, CONCURRENCY, fetchModuleData);
    }
};

const pageFilePath = (slug) => {
    const normalized = slug ? slug.replace(/^\/+|\/+$/g, '') : 'index';
    if (!normalized) {
        return path.join(OUTPUT_DIR, 'pages', 'index.json');
    }
    const segments = normalized.split('/').filter(Boolean);
    const fileName = segments.pop();
    return path.join(OUTPUT_DIR, 'pages', ...segments, `${fileName}.json`);
};

const writeJson = async (filePath, data) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const fetchNavigation = async () => {
    const [mainRes, footerRes] = await Promise.all([
        client.query({ query: MAIN_NAVIGATION }),
        client.query({ query: FOOTER_NAVIGATION }),
    ]);

    return {
        main: mainRes?.data?.pageCollection?.items || [],
        footer: footerRes?.data?.pageCollection?.items || [],
    };
};

const downloadAssets = async () => {
    await fs.mkdir(ASSET_DIR, { recursive: true });
    const assets = Array.from(assetMap.values());

    await mapWithConcurrency(assets, CONCURRENCY, async (asset) => {
        if (fsSync.existsSync(asset.filePath)) {
            return;
        }
        const response = await fetch(asset.sourceUrl);
        if (!response.ok) {
            console.warn(`Failed to download asset: ${asset.sourceUrl}`);
            return;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(asset.filePath, buffer);
    });
};

const run = async () => {
    const redactedEndpoint = GRAPHQL_ENDPOINT.replace(TOKEN, '***');
    console.log(`Exporting Contentful data from ${redactedEndpoint}`);
    console.log(`Output dir: ${OUTPUT_DIR}`);

    const navigation = await fetchNavigation();
    rewriteAssetsInObject(navigation);
    await writeJson(path.join(OUTPUT_DIR, 'navigation', 'main.json'), navigation.main);
    await writeJson(path.join(OUTPUT_DIR, 'navigation', 'footer.json'), navigation.footer);

    const slugs = await fetchAllPageSlugs();
    console.log(`Found ${slugs.length} pages`);

    for (let i = 0; i < slugs.length; i += 1) {
        const slug = slugs[i];
        const pageData = await fetchPageBySlug(slug);
        if (!pageData) {
            console.warn(`Skipping empty page for slug: ${slug}`);
            continue;
        }

        await hydrateModules(pageData);
        convertPageRichText(pageData);
        rewriteAssetsInObject(pageData);

        const filePath = pageFilePath(slug);
        await writeJson(filePath, pageData);
    }

    await downloadAssets();
    console.log(`Downloaded ${assetMap.size} assets`);
    console.log('Done.');
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
