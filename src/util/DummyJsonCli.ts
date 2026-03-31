export class DummyJsonClient {
  private static readonly BASE_URL = "https://dummyjson.com";

  constructor(private readonly baseUrl: string = DummyJsonClient.BASE_URL) {}

  async get<T = unknown>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    let res: Response;

    try {
      res = await fetch(url);
    } catch (err) {
      throw new Error(`Network error reaching ${url}`, { cause: err });
    }

    if (!res.ok) {
      throw new Error(
        `External API error: ${res.status} ${res.statusText} — ${url}`
      );
    }

    return res.json() as Promise<T>;
  }
}