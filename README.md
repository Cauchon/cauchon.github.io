# cauchon.github.io

Personal portfolio and blog for Justin Cauchon, hosted at [cauchon.net](https://cauchon.net/).

Built with [Jekyll](https://jekyllrb.com/) and deployed via [GitHub Pages](https://pages.github.com/).

## Features

- Personal blog with posts about career updates and life milestones
- Projects page showcasing work and personal projects
- Interactive special projects (e.g., a pronoun learning game for children)
- Responsive design with mobile support
- PWA-ready with a web app manifest
- RSS/Atom feed and auto-generated sitemap

## Local Development

**Prerequisites:** Ruby and Bundler

```bash
bundle install
jekyll serve --watch
```

The site will be available at `http://localhost:4000`.

## Project Structure

```
.
├── _layouts/          # Jekyll layout templates
├── _posts/            # Blog posts (Markdown)
├── css/               # Stylesheets
├── images/            # Images and avatars
├── icons/             # App icons (various sizes)
├── special-projects/  # Standalone interactive projects
├── _config.yml        # Jekyll configuration
├── Gemfile            # Ruby dependencies
├── index.html         # Homepage
├── posts.html         # Blog archive
└── projects.html      # Projects page
```

## Technologies

- **Jekyll** 4.4.1 — static site generator
- **GitHub Pages** — hosting
- **Vanilla CSS & JS** — no build tools required

## License

Content is personal and not licensed for reuse. The site template is derived from [notwaldorf/notwaldorf.github.com](https://github.com/notwaldorf/notwaldorf.github.com).
