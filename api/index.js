const UPSTREAM = "https://69de2e3d937c8a3182ac.digitalforestapp.xyz";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);

    const target = new URL(incoming.pathname + incoming.search, UPSTREAM);

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");

    try {
      const upstreamResponse = await fetch(target, {
        method: request.method,
        headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "manual",
      });

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: upstreamResponse.headers,
      });
    } catch (error) {
      return new Response("Proxy error: " + error.message, {
        status: 502,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }
  },
};
