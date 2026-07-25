const UPSTREAM = "https://69de2e3d937c8a3182ac.digitalforestapp.xyz";

export default {
  async fetch(request) {
    try {
      const incomingUrl = new URL(request.url);

      // Путь передаётся из vercel.json через параметр path
      const path = incomingUrl.searchParams.get("path") || "";

      incomingUrl.searchParams.delete("path");

      const targetUrl = new URL(
        "/" + path.replace(/^\/+/, ""),
        UPSTREAM
      );

      targetUrl.search = incomingUrl.searchParams.toString();

      const headers = new Headers(request.headers);

      // Эти заголовки Vercel и fetch установят самостоятельно
      headers.delete("host");
      headers.delete("content-length");
      headers.delete("connection");

      headers.set(
        "x-forwarded-host",
        new URL(request.url).host
      );

      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "manual",
      });

      const responseHeaders = new Headers(response.headers);

      // Если backend перенаправляет на свой домен —
      // заменяем его адресом Vercel
      const location = responseHeaders.get("location");

      if (location) {
        const proxyOrigin = new URL(request.url).origin;

        responseHeaders.set(
          "location",
          location.replace(UPSTREAM, proxyOrigin)
        );
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response(
        "Proxy error: " + (error?.message || String(error)),
        {
          status: 502,
          headers: {
            "content-type": "text/plain; charset=utf-8",
          },
        }
      );
    }
  },
};
