# Ahmed Yehya — SEO Portfolio

Static portfolio: HTML, CSS and JavaScript. Deploy `dist/` to any static host.

Live site: https://ahmed-yehya-seo-portfolio.proudbeam2.chatgpt.site

## Preview

Run a static HTTP server from `dist/`, for example `python -m http.server 8000 --directory dist`.

## Content

- `dist/index.html`: profile, experience, expertise and contact form.
- `dist/app.js`: case cards, filters and accessible case-study dialogs.
- `dist/case-details.json`: extended case studies, comparisons and interpretation.
- `dist/cases.json`: original case-study source URLs.
- `dist/assets/case-*.jpg`: original Search Console screenshots (some are PNG files served under the existing asset filenames).
- `dist/style.css`: responsive design.
- `dist/thanks.html`: return page after contact submission.

## Contact setup

FormSubmit forwards the contact form to ahmedyehya205@gmail.com. The owner must confirm the activation email before forwarding starts. The form uses the provider's default CAPTCHA and an additional honeypot. No email password or API key is present in the source. The form's `_next` and `_url` inputs refer to the current live origin; update them if moving hosting.

The setup request being accepted is not proof of email delivery. Confirm activation, send a test from the published site, and confirm inbox receipt before relying on it for leads.

## Publishing and GitHub

The current live deployment is managed by Sites. A copy in GitHub does not automatically deploy changes to the current Sites URL. Configure a supported deployment pipeline separately if automatic publishing is wanted. `.openai/hosting.json` identifies the existing Site and is not a credential.

## Evidence

Case-study metrics come from the supplied Medium posts and their screenshots. Three-month comparison labels are visible, but exact calendar dates are not. Percentages calculated from rounded values are approximate. No leads, revenue or causality are inferred from Search Console data.

## CV

The CV download and its PDF asset were removed from the current site. The original CV was used only as a source for the profile information.
