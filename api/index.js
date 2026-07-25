const UPSTREAM = "https://69de2e3d937c8a3182ac.digitalforestapp.xyz/";

export default {
  async fetch() {
    try {
      const response = await fetch(UPSTREAM);

      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: {
          "content-type":
            response.headers.get("content-type") ||
            "text/html; charset=utf-8",
        },
      });
    } catch (error) {
      return new Response("FETCH ERROR: " + error.message, {
        status: 502,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }
  },
};
