export function mapCategoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    eventCount: row.eventCount ?? row._count?.events ?? 0,
  };
}
