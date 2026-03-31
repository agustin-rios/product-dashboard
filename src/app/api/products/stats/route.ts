export async function GET() {
    // hello world
    return new Response(JSON.stringify({
        'totalProducts': 0,
        'averagePrice': 0,
        'averageRating': 0,
        'lowStockCount': 0,
        'outOfStockCount': 0,
        'topCategory': "—",
        'categoryCounts': {},
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  }
    );
}