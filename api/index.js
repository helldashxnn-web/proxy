export default {
  async fetch() {
    return new Response("VERCEL FUNCTION WORKS", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }
};
