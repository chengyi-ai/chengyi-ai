// Preloaded before generate-snake-animation: limits the contribution calendar it fetches
// to the last SNAKE_DAYS days (default 30) by adding from/to to the GraphQL query.
const days = Number(process.env.SNAKE_DAYS || 30);
const to = new Date();
const from = new Date(to.getTime() - days * 864e5);
const realFetch = globalThis.fetch;
globalThis.fetch = (url, opts) => {
  if (String(url).endsWith("/graphql") && opts?.body) {
    const body = JSON.parse(opts.body);
    body.query = body.query.replace(
      "contributionsCollection {",
      `contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {`,
    );
    opts = { ...opts, body: JSON.stringify(body) };
  }
  return realFetch(url, opts);
};
