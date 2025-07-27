+++
title = "Creating Like Buttons for the Small Web"
date = 2025-07-27
description = "Building a privacy-first, self-hostable like button system using PostgreSQL and vanilla JavaScript. Featuring progressive enhancement and zero tracking."

[taxonomies]
tags = ["JavaScript", "web", "code", "interactive", "SQL"]

[extra]
mermaid = true
stylesheets = ["blog/iine-small-web-like-buttons/css/styles.css"]
social_media_card = "img/social_cards/blog_iine_small_web_like_buttons.jpg"
tldr = "I built [<ruby>い<rt>i</rt>い<rt>i</rt>ね<rt>ne</rt></ruby>](https://iine.to), private, accessible, free like buttons for the small/indie web."
+++

I wanted to add reaction buttons to my posts. Claps, hearts, cheers, kudos, likes.

My requirements:

- Anonymous: no need for readers to create an account/log in
- Free (as in *freedom* and as in *gratis*)
- No unnecessary processing/storing of reader’s data
- Accessible: keyboard and screen reader friendly
- Japanese name (naturally)
- Extra: works without JavaScript

(I also wanted an excuse to build my first backend project.)

The result:

<div class="iine-demo">
{{ iine(slug="/blog/iine-small-web-like-buttons/intro-demo") }}
</div>

## Back end

A friend suggested Supabase for the backend. The [free tier](https://supabase.com/pricing) offers 500MB of database storage. This limitation aligned my privacy and cost requirements: the less data I store, the farther I’ll be from the limit!

I decided the core of the project would be a single table with three columns:

| `origin_domain` 🔑 | `slug` 🔑           | `counter` |
|------------------|-------------------|---------|
| example.com      | /blog/hello-world | 47     |
| osc.garden       | /blog/nostalgia   | 6       |
| osc.garden       | /projects/iine    | 15      |

For debugging, I added two more columns:

- `created_ts`: when the row was created
- `updated_ts`: when the row was last updated

Because this is my first time creating a project with a backend, and because I’m making it public, I was cautious; I added rate limiting.

For a like to be processed, the user be below the threshold of hourly requests.

Again, I don’t want to store unnecessary/private data, so the rate limiting table stores:

| `identifier_hash` 🔑   | `request_count` |
|----------------------|---------------|
| -8234567890123456789 | 15            |
| 1234567890987654321  | 42            |
| -5678901234567890123 | 7             |
| 9876543210123456789  | 58            |

`identifier_hash` is a hash of the client IP + the current hour:

```sql
hashtext(client_ip || date_trunc('hour', now())::text)
```

The rate limiting table is truncated (emptied) on an hourly basis using the [`pg_cron`  extension](https://github.com/citusdata/pg_cron):

```sql
select cron.schedule(
  'hourly-rate-limit-cleanup',
  '3 * * * *',
  'truncate table iine.rate_limits;'
);
```

I had no idea Postgres supported cron jobs! How cool is that?!

## Front end

The idea is simple. On page load: detect the iine button and fetch likes count. On click: increase count locally (optimistic update), and call the endpoint that increments the count for that URL.

If JavaScript is disabled, we can't fetch the count (not without server-side rendering). Instead, we have a form that submits to the same endpoint. It looks like:

```html
<form action="https://e.supabase.co/rest/v1/rpc/increment_hits?apikey=key"
  method="post">
  <input type="hidden" name="page_slug" value="/your-page">
  <button type="submit" class="iine-button" aria-hidden="true">
    <noscript>♥️</noscript>
  </button>
</form>
```

The user-defined icon (in this example, ♥️) is only shown when JavaScript is disabled. Upon click, it calls the same endpoint with a `POST` request:

{% mermaid(full_width=true) %}
flowchart LR
      A[iine button] --> B{JavaScript?}

      B -->|Yes| C[GET /get_hits]
      C --> D[Display: ♥️ 41]
      D --> E[Click]
      E --> F[POST /increment_hits]
      F --> G[Display: ♥️ 42<br>Button disabled]

      B -->|No| H[Display: ♥️]
      H --> I[Form submit]
      I --> J[POST /increment_hits]
      J --> K[Server response:<br>URL liked! ♥️]
{% end %}

That’s it! Just two pieces:

- PostgreSQL with functions and endpoints
- A way (~3KB JavaScript / HTML form) to call the endpoints

---

I named it iine (いいね), which means “that’s nice!” in Japanese, and it’s also the way people refer to the like buttons in general.

Since the free tier of Supabase can comfortably support iine buttons for 100,000+ sites (assuming 20-50 buttons per site), I decided to make it public and not require registration (I really don’t want your data). For anyone interested in self-hosting, here’s [a guide](https://github.com/welpo/iine/blob/main/self-hosting.md).

I spent a weekend working on the backend + JavaScript. Half a day on accessibility, another half figuring out the progressive enhancement, and a few hours adding iine support to my theme, [tabi](https://github.com/welpo/tabi). Happy to share it with the world!

Visit the website at [iine.to](https://iine.to) and explore the code on [GitHub](https://github.com/welpo/iine).
