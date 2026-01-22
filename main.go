package main

import (
	"encoding/json"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/janmarkuslanger/ssgo/builder"
	"github.com/janmarkuslanger/ssgo/page"
	"github.com/janmarkuslanger/ssgo/rendering"
	"github.com/janmarkuslanger/ssgo/writer"
)

type NavItem struct {
	Sys struct {
		ID string `json:"id"`
	} `json:"sys"`
	Title  string   `json:"title"`
	Slug   string   `json:"slug"`
	Parent *NavLink `json:"parent"`
	Childs []*NavItem
}

type NavLink struct {
	Sys struct {
		ID string `json:"id"`
	} `json:"sys"`
}

type PageVM struct {
	Slug     string
	Articles []ArticleVM
}

type ArticleVM struct {
	Color     string
	NoPadding bool
	Modules   []ModuleVM
}

type ModuleVM struct {
	Type string
	Data map[string]any
}

type rawPage struct {
	ArticlesCollection struct {
		Items []rawArticle `json:"items"`
	} `json:"articlesCollection"`
}

type rawArticle struct {
	Color             *string `json:"color"`
	NoPadding         *bool   `json:"noPadding"`
	ModulesCollection struct {
		Items []json.RawMessage `json:"items"`
	} `json:"modulesCollection"`
}

func main() {
	pages, err := loadPages("data/pages")
	if err != nil {
		log.Fatal(err)
	}

	navMain, err := loadNavigation("data/navigation/main.json")
	if err != nil {
		log.Fatal(err)
	}

	navFooter, err := loadNavigation("data/navigation/footer.json")
	if err != nil {
		log.Fatal(err)
	}

	layoutFiles := []string{
		"templates/layout.html",
		"templates/partials/header.html",
		"templates/partials/footer.html",
		"templates/modules/module-stage.html",
		"templates/modules/module-text.html",
		"templates/modules/module-image-text.html",
		"templates/modules/module-cards.html",
		"templates/modules/module-akkordeons.html",
		"templates/modules/module-headlines.html",
		"templates/modules/module-slider.html",
		"templates/modules/module-html.html",
	}

	renderer := rendering.HTMLRenderer{
		Layout: layoutFiles,
		CustomFuncs: template.FuncMap{
			"safeHTML": func(value any) template.HTML {
				if value == nil {
					return ""
				}
				if str, ok := value.(string); ok {
					return template.HTML(str)
				}
				return ""
			},
			"toURL": func(value any) string {
				str, ok := value.(string)
				if !ok {
					return "#"
				}
				str = strings.TrimSpace(str)
				if str == "" {
					return "#"
				}
				if strings.HasPrefix(str, "http://") || strings.HasPrefix(str, "https://") || strings.HasPrefix(str, "mailto:") || strings.HasPrefix(str, "tel:") {
					return str
				}
				if strings.HasPrefix(str, "#") {
					return str
				}
				if strings.HasPrefix(str, "/") {
					return str
				}
				return "/" + strings.TrimSuffix(str, "/")
			},
		},
	}

	slugGenerator := page.Generator{
		Config: page.Config{
			Pattern:  "",
			Template: "templates/page.html",
			GetPaths: func() []string {
				return slugPaths(pages)
			},
			GetData: func(payload page.PagePayload) map[string]any {
				slug := strings.Trim(payload.Path, "/")
				return buildPageView(slug, pages, navMain, navFooter)
			},
			Renderer: renderer,
		},
	}

	rootGenerator := page.Generator{
		Config: page.Config{
			Pattern:  "/",
			Template: "templates/page.html",
			GetPaths: func() []string {
				if _, ok := pages["startseite"]; ok {
					return []string{"index"}
				}
				return []string{}
			},
			GetData: func(payload page.PagePayload) map[string]any {
				return buildPageView("startseite", pages, navMain, navFooter)
			},
			Renderer: renderer,
		},
	}

	buildConfig := builder.Builder{
		OutputDir: "dist",
		Writer:    &writer.FileWriter{},
		Generators: []page.Generator{
			rootGenerator,
			slugGenerator,
		},
	}

	if err := buildConfig.Build(); err != nil {
		log.Fatal(err)
	}
}

func slugPaths(pages map[string]*PageVM) []string {
	paths := make([]string, 0, len(pages))
	for slug := range pages {
		if slug == "" {
			continue
		}
		paths = append(paths, slug)
	}
	sort.Strings(paths)
	return paths
}

func buildPageView(slug string, pages map[string]*PageVM, navMain []*NavItem, navFooter []*NavItem) map[string]any {
	currentYear := time.Now().Year()
	pageData, ok := pages[slug]
	if !ok {
		return map[string]any{
			"Slug":        slug,
			"Articles":    []ArticleVM{},
			"NavMain":     navMain,
			"NavFooter":   navFooter,
			"CurrentYear": currentYear,
		}
	}

	return map[string]any{
		"Slug":        pageData.Slug,
		"Articles":    pageData.Articles,
		"NavMain":     navMain,
		"NavFooter":   navFooter,
		"CurrentYear": currentYear,
	}
}

func loadPages(dir string) (map[string]*PageVM, error) {
	pages := map[string]*PageVM{}

	err := filepath.WalkDir(dir, func(filePath string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() || filepath.Ext(filePath) != ".json" {
			return nil
		}

		raw, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}

		pageData, err := parsePage(raw)
		if err != nil {
			return err
		}

		rel, err := filepath.Rel(dir, filePath)
		if err != nil {
			return err
		}

		slug := strings.TrimSuffix(rel, filepath.Ext(rel))
		slug = filepath.ToSlash(slug)
		pageData.Slug = slug
		pages[slug] = pageData
		return nil
	})

	return pages, err
}

func parsePage(raw []byte) (*PageVM, error) {
	var page rawPage
	if err := json.Unmarshal(raw, &page); err != nil {
		return nil, err
	}

	view := &PageVM{}

	for _, article := range page.ArticlesCollection.Items {
		articleView := ArticleVM{
			Color:     "#f0f0f0",
			NoPadding: false,
		}

		if article.Color != nil && *article.Color != "" {
			articleView.Color = *article.Color
		}
		if article.NoPadding != nil {
			articleView.NoPadding = *article.NoPadding
		}

		for _, moduleRaw := range article.ModulesCollection.Items {
			var moduleData map[string]any
			if err := json.Unmarshal(moduleRaw, &moduleData); err != nil {
				continue
			}

			typename, _ := moduleData["__typename"].(string)
			dataKey := lowerFirst(typename)
			dataValue := map[string]any{}
			if rawData, ok := moduleData[dataKey].(map[string]any); ok {
				dataValue = rawData
			}

			articleView.Modules = append(articleView.Modules, ModuleVM{
				Type: typename,
				Data: dataValue,
			})
		}

		view.Articles = append(view.Articles, articleView)
	}

	return view, nil
}

func loadNavigation(filePath string) ([]*NavItem, error) {
	raw, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var items []*NavItem
	if err := json.Unmarshal(raw, &items); err != nil {
		return nil, err
	}

	itemByID := map[string]*NavItem{}
	for _, item := range items {
		itemByID[item.Sys.ID] = item
	}

	var roots []*NavItem
	for _, item := range items {
		if item.Parent == nil || item.Parent.Sys.ID == "" {
			roots = append(roots, item)
			continue
		}
		if parent, ok := itemByID[item.Parent.Sys.ID]; ok {
			parent.Childs = append(parent.Childs, item)
		} else {
			roots = append(roots, item)
		}
	}

	return roots, nil
}

func lowerFirst(value string) string {
	if value == "" {
		return value
	}
	return strings.ToLower(value[:1]) + value[1:]
}
