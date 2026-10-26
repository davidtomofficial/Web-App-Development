# Web and App Development

Historical learning projects by [David Tom](https://github.com/davidtomofficial), retained for resume demonstrations and reference for future development: a React Native community-app prototype and an HTML/CSS coursework website.

| Project | Contents | Status |
| --- | --- | --- |
| [Robindale YSA Ward](App%20Development/Robindale%20YSA%20Ward/) | Expo / React Native app with navigation and links to community services | Reproducible browser demo and regression tests; native devices unverified; forms do not submit data |
| [CIT 151 Final Project](Web%20Development/CIT%20151%20Final%20Project/Main/) | Four-page CSN cafe demonstration built with HTML and CSS | Historical Spring 2024 coursework; contact form is a demonstration |

These projects are development examples. Campus hours and contact details in the coursework are historical, and the repository does not provide an operational signup or contact service.

## Run the static website

From the repository root:

```sh
python3 -m http.server 8000 --directory "Web Development/CIT 151 Final Project/Main"
```

Open `http://localhost:8000`. The sample contact form does not send or store messages.

## Run the application prototype

See the [app README](App%20Development/Robindale%20YSA%20Ward/README.md) for a browser demo, clean-install instructions, automated checks, and platform limitations. Its framework versions remain on the existing Expo SDK 51 stack. This is a portfolio reference, not an application intended for operational use.

## Contributions

Open an issue with the project path, steps to reproduce, and expected behavior, or propose a focused pull request. Include the relevant browser/device and any validation you performed.

Third-party assets and their existing attribution remain in their respective project folders.
