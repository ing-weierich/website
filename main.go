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
	"github.com/janmarkuslanger/ssgo/dev"
	"github.com/janmarkuslanger/ssgo/page"
	"github.com/janmarkuslanger/ssgo/rendering"
	"github.com/janmarkuslanger/ssgo/writer"
)

type NavItem struct {
	Title    string     `json:"title"`
	Slug     string     `json:"slug"`
	Children []*NavItem `json:"children"`
}

type PageVM struct {
	Slug     string      `json:"slug"`
	Meta     *PageMeta   `json:"meta"`
	Sections []SectionVM `json:"sections"`
}

type PageMeta struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type SectionVM struct {
	Background SectionBackground `json:"background"`
	Modules    []ModuleVM        `json:"modules"`
}

type SectionBackground struct {
	Color     string `json:"color"`
	NoPadding bool   `json:"noPadding"`
}

type ModuleVM struct {
	Type string         `json:"type"`
	Data map[string]any `json:"data"`
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
			Pattern:  "/:slug",
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
					return []string{"/"}
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

	if os.Getenv("SSGO_DEV") == "1" {
		if err := os.MkdirAll(buildConfig.OutputDir, 0o755); err != nil {
			log.Fatal(err)
		}
		if err := copyDir("public", buildConfig.OutputDir); err != nil {
			log.Fatal(err)
		}
		log.Printf("SSGO dev server running on http://localhost:8080")
		dev.StartServer(buildConfig)
		return
	}

	for i := range buildConfig.Generators {
		originalPaths := buildConfig.Generators[i].Config.GetPaths
		if originalPaths == nil {
			continue
		}
		buildConfig.Generators[i].Config.GetPaths = func() []string {
			paths := originalPaths()
			for i, p := range paths {
				if p == "/" {
					paths[i] = "index"
					continue
				}
				paths[i] = strings.TrimPrefix(p, "/")
			}
			return paths
		}
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
		paths = append(paths, "/"+slug)
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
			"Meta":        (*PageMeta)(nil),
			"Sections":    []SectionVM{},
			"NavMain":     navMain,
			"NavFooter":   navFooter,
			"CurrentYear": currentYear,
		}
	}

	return map[string]any{
		"Slug":        pageData.Slug,
		"Meta":        pageData.Meta,
		"Sections":    pageData.Sections,
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
	var page PageVM
	if err := json.Unmarshal(raw, &page); err != nil {
		return nil, err
	}

	for i := range page.Sections {
		if page.Sections[i].Background.Color == "" {
			page.Sections[i].Background.Color = "#f0f0f0"
		}
	}

	return &page, nil
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

	return items, nil
}

func copyDir(src string, dst string) error {
	return filepath.WalkDir(src, func(sourcePath string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(src, sourcePath)
		if err != nil {
			return err
		}
		targetPath := filepath.Join(dst, rel)
		if entry.IsDir() {
			return os.MkdirAll(targetPath, 0o755)
		}
		sourceInfo, err := entry.Info()
		if err != nil {
			return err
		}
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return err
		}
		in, err := os.Open(sourcePath)
		if err != nil {
			return err
		}
		defer in.Close()
		out, err := os.Create(targetPath)
		if err != nil {
			return err
		}
		if _, err := out.ReadFrom(in); err != nil {
			out.Close()
			return err
		}
		if err := out.Chmod(sourceInfo.Mode()); err != nil {
			out.Close()
			return err
		}
		return out.Close()
	})
}
