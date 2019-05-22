# Journey planner

## Build graph in memory

1. Run src/neighbour_map/group_by_hours.ts
2. Run src/neighbour_map/stops_by_id.ts
3. Run src/neighbour_map/build_neighbour_map.ts (~7mn for ~200mb+)
4. Run build_graph.ts
5. Run index.ts

# Upgrade nodejs heap

`node --max-old-space-size=8192`
