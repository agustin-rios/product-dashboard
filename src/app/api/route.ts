export async function GET(request: Request) {
    // hello world
    return new Response(
        JSON.stringify({ message: "Hello, World!" }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}