# Code Hive Bridge — Portfolio Site

A static portfolio site for showcasing your shipped projects, with free
downloads and a manual UPI payment flow for paid source code. No backend,
no build step — plain HTML/CSS/JS, so it hosts for free on GitHub Pages.

## Files

- `index.html` — page structure
- `style.css` — all styling
- `config.js` — **the only file you need to edit regularly**: your UPI ID,
  contact details, and the full project list
- `script.js` — site logic (filters, project cards, the payment popup) —
  you shouldn't need to touch this to add projects

## 1. Add your real projects

Open `config.js` and edit the `PROJECTS` array. Each project looks like:

```js
{
  id: "unique-id-no-spaces",
  title: "Project Name",
  stack: "php",                 // primary stack: html, css, js, python, php, mysql
  tags: ["mysql", "js"],        // any other stacks it uses
  summary: "One or two sentences about what it does.",
  price: 0,                     // 0 = free, or a number like 799 for ₹799
  freeUrl: "https://github.com/you/repo"   // only used when price is 0
}
```

For **free** projects, `freeUrl` should point to wherever the buyer can grab
the code right now — a public GitHub repo, a zip on Google Drive (set link
sharing to "anyone with the link"), etc.

For **paid** projects, leave `freeUrl: ""` — buyers get a "Buy via UPI"
button instead, which is handled automatically once you set up your
payment details below.

## 2. Set your payment and contact details

Still in `config.js`, at the top:

```js
const SITE_CONFIG = {
  upiId: "yourname@upi",
  payeeName: "Code Hive Bridge",
  whatsappNumber: "91XXXXXXXXXX",  // country code + number, digits only
  contactEmail: "you@example.com"
};
```

That's it — every "Buy via UPI" button generates a QR code and payment
link using these details, pre-filled with the correct amount and project
name for that specific project.

## 3. How the paid flow works (important — read this)

This site does **not** process payments automatically. There's no
merchant account or payment gateway involved, which means:

- A buyer scans the QR / pays your UPI ID directly through their own
  banking app.
- They then message you (WhatsApp or email, both pre-filled) with a
  screenshot and the project name.
- **You manually check the payment landed, then send the source code
  yourself** — email, WhatsApp, Google Drive link, however you prefer.

This keeps the site free to host with no backend, but it means you're the
one verifying each payment. A few things worth doing to protect yourself:

- Only mark something "paid" once you'd genuinely be comfortable manually
  fulfilling it — don't list more paid projects than you can keep up with.
- Keep a simple log (a spreadsheet is fine) of buyer contact + screenshot
  + what you sent, in case of disputes.
- If this grows past what manual verification can handle, look at a proper
  payment gateway with UPI support (Razorpay, Cashfree, Instamojo) that
  can auto-confirm payment and even auto-email the file — that requires a
  registered business/merchant account, which is a separate step from
  this site.

## 4. Preview it locally

You don't need a server for basic viewing, but some browsers restrict
`fetch`/module behavior on `file://`. Easiest local preview:

```bash
# from inside the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

## 5. Host it for free on GitHub Pages

1. Create a new **public** GitHub repository (e.g. `code-hive-bridge`).
2. Push these files to the repo's root (or to a `docs/` folder — your choice).
3. On GitHub: **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch".
5. Pick the branch (usually `main`) and the folder (`/root` or `/docs`),
   then **Save**.
6. GitHub gives you a live URL within a minute or two, in the form:
   `https://<your-username>.github.io/<repo-name>/`

If you want a custom domain (like `codehivebridge.com`) instead of the
`github.io` address, add a `CNAME` file with your domain name at the repo
root and point your domain's DNS to GitHub Pages — GitHub's docs walk
through the exact DNS records under **Settings → Pages → Custom domain**.

## 6. Updating the live site later

Every time you edit `config.js` (add a project, change a price, swap your
UPI ID) and push to GitHub, Pages rebuilds automatically within a minute —
no separate deploy step.
