# Task: Network Intelligence Visualization Implementation

## 1. Strategic Analysis & Solution Options

### 1.1 Problem Definition

**Current State**: The VC Portfolio OS lacks visualization capabilities for network intelligence and relationship mapping between portfolio companies, investors, co-investors, and other ecosystem participants. Users cannot easily visualize complex relationships and network patterns that exist within their portfolio.

**Desired State**: Implement an interactive network intelligence visualization system that displays relationships between portfolio companies, investors, co-investors, board members, and other key stakeholders in an intuitive, searchable, and filterable interface.

### 1.2 Solution Options Analysis

#### Option 1: Full-Featured Network Graph with D3.js

**Approach**: Implement a comprehensive network graph using D3.js with force-directed layouts, clustering algorithms, and advanced interaction capabilities.

**Pros**:

- Highly customizable and powerful visualization
- Advanced network analysis capabilities
- Smooth animations and transitions
- Extensive plugin ecosystem
- Full control over visualization behavior

**Cons**:

- Steep learning curve and complexity
- Higher implementation time
- Performance concerns with large networks
- More maintenance overhead
- Potential accessibility challenges

**Technical Requirements**:

- D3.js library integration
- Complex state management for network data
- Performance optimization for large datasets
- Advanced interaction handling
- Responsive design implementation

#### Option 2: React-based Network Visualization with vis-network

**Approach**: Use a React-friendly network visualization library like vis-network or react-force-graph-3d for easier integration and maintenance.

**Pros**:

- Better React integration
- Easier to maintain and extend
- Built-in performance optimizations
- Good documentation and community support
- Mobile-friendly implementations

**Cons**:

- Less customization compared to D3.js
- Limited to library capabilities
- Potential dependency on third-party library updates
- Some features may require workarounds

**Technical Requirements**:

- vis-network or react-force-graph library
- React component wrapper
- Data transformation utilities
- Event handling system
- Performance monitoring

#### Option 3: Hybrid Approach with Multiple Visualization Types (RECOMMENDED)

**Approach**: Implement a multi-modal visualization system with different views for different types of network intelligence - interactive network graphs, relationship matrices, and cluster analyses.

**Pros**:

- Best of both worlds - comprehensive yet approachable
- Different visualizations for different use cases
- Progressive complexity based on user needs
- Better performance by splitting visualizations
- Easier user adoption and learning

**Cons**:

- More components to maintain
- Complex state synchronization
- Higher initial development cost
- Consistency challenges across visualization types

**Technical Requirements**:

- Multiple visualization libraries
- Unified data layer
- Synchronized state management
- Consistent design system
- Performance optimization across components

### 1.3 Recommended Solution

**Selected Approach**: Option 3 - Hybrid Approach with Multiple Visualization Types

**Rationale**:

- Addresses different user needs with appropriate visualization types
- Balances power and usability
- Scales well with growing data complexity
- Maintains performance through specialization
- Provides clear user journey from simple to complex

**Implementation Strategy**:

- Start with basic relationship matrix
- Add interactive network graph for power users
- Implement cluster analysis for strategic insights
- Create unified data layer for all visualizations
- Ensure consistent design and interaction patterns

## 2. Project Analysis & Current State

### 2.1 Current Application State

#### Existing Network Data Analysis

```typescript
// Current tier3Analytics schema (partial)
interface Tier3Analytics {
  _id: Id<"tier3Analytics">;
  documentId: Id<"documents">;
  chunkId: Id<"enhancedHybridChunks">;
  coInvestors: string[];
  boardMembers: string[];
  keyExecutives: string[];
  partnerships: string[];
  competitors: string[];
  suppliers: string[];
  customers: string[];
  // ... 90+ additional fields including network data
}

// Current portfolioCompanies schema
interface PortfolioCompany {
  _id: Id<"portfolioCompanies">;
  companyName: string;
  industry: string;
  stage: string;
  investmentDate: number;
  // ... existing fields
}
```

#### Current Network Intelligence Capabilities

- Raw network data stored in tier3Analytics table
- Basic company relationships available in portfolio data
- No visualization capabilities implemented
- Limited relationship analysis tools
- No interactive exploration features

#### Identified Gaps

- No network visualization components
- Missing relationship analysis tools
- No interactive exploration capabilities
- Limited network insights extraction
- No collaboration features for network analysis

### 2.2 Technical Requirements Analysis

#### Required Network Data Types

1. **Investment Networks**: Companies ↔ Investors ↔ Funds
2. **Board/Executive Networks**: Companies ↔ Board Members ↔ Executives
3. **Partnership Networks**: Companies ↔ Partners ↔ Suppliers ↔ Customers
4. **Competitive Networks**: Companies ↔ Competitors ↔ Market Segments
5. **Geographic Networks**: Companies ↔ Locations ↔ Regions

#### Required Visualization Types

1. **Force-Directed Network Graph**: Interactive exploration of complex relationships
2. **Relationship Matrix**: Structured view of direct relationships
3. **Cluster Analysis**: Grouping and pattern identification
4. **Timeline View**: Evolution of networks over time
5. **Geographic Mapping**: Location-based network visualization

### 2.3 Dependencies and Prerequisites

#### Existing Dependencies (from package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "~5.7.2",
    "convex": "^1.24.2",
    "react-router-dom": "^7.9.3",
    "lucide-react": "^0.544.0"
  }
}
```

#### Additional Dependencies Needed

```json
{
  "dependencies": {
    "d3": "^7.8.5",
    "vis-network": "^9.1.6",
    "react-force-graph-2d": "^1.25.4",
    "d3-force": "^3.0.0",
    "d3-selection": "^3.0.0",
    "d3-scale": "^4.0.2",
    "d3-hierarchy": "^3.1.2"
  }
}
```

## 3. Technical Requirements & Specifications

### 3.1 Functional Requirements

#### Core Features

1. **Interactive Network Graph**
   - Force-directed layout with physics simulation
   - Node and edge filtering capabilities
   - Zoom, pan, and selection interactions
   - Real-time updates with Convex subscriptions
   - Export functionality (PNG, SVG, JSON)

2. **Relationship Matrix**
   - Grid-based relationship display
   - Heat map for relationship strength
   - Sorting and filtering options
   - Drilling down to detailed relationships
   - Comparative analysis capabilities

3. **Cluster Analysis**
   - Automatic community detection
   - Industry and stage clustering
   - Investment pattern analysis
   - Geographic clustering
   - Custom clustering algorithms

4. **Timeline Visualization**
   - Network evolution over time
   - Relationship development tracking
   - Investment flow visualization
   - Milestone and event overlay
   - Playback controls for historical analysis

5. **Search and Discovery**
   - Intelligent entity search
   - Relationship path finding
   - Network distance calculation
   - Influencer identification
   - Hidden relationship discovery

#### Advanced Features

1. **Network Analytics**
   - Centrality measures (degree, betweenness, closeness)
   - Network density and clustering coefficients
   - Path analysis and shortest path algorithms
   - Influence propagation modeling
   - Network health metrics

2. **Collaboration Features**
   - Shared network views
   - Annotation and commenting
   - Insight sharing
   - Team-based analysis
   - Export and presentation tools

### 3.2 Data Model Requirements

#### Network Data Schema Extensions

```typescript
// Network entities table
interface NetworkEntity {
  _id: Id<"networkEntities">;
  type: "company" | "investor" | "person" | "fund" | "location";
  name: string;
  category?: string;
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Network relationships table
interface NetworkRelationship {
  _id: Id<"networkRelationships">;
  fromEntityId: Id<"networkEntities">;
  toEntityId: Id<"networkEntities">;
  relationshipType:
    | "invests_in"
    | "board_member"
    | "partner"
    | "competitor"
    | "supplier"
    | "customer";
  strength: number; // 0-1 normalized strength
  startDate?: number;
  endDate?: number;
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Network clusters table
interface NetworkCluster {
  _id: Id<"networkClusters">;
  name: string;
  algorithm: "louvain" | "k-means" | "hierarchical";
  entityIds: Id<"networkEntities">[];
  clusterId: string;
  metadata: Record<string, any>;
  createdAt: number;
}

// Network analytics cache
interface NetworkAnalytics {
  _id: Id<"networkAnalytics">;
  entityType: string;
  entityId: Id<"networkEntities">;
  metric: string;
  value: number;
  calculationDate: number;
}
```

#### Data Integration Patterns

```typescript
// Data transformation utilities
export function transformPortfolioCompanyToNetworkEntity(
  company: PortfolioCompany
): NetworkEntity {
  return {
    _id: company._id as any,
    type: "company",
    name: company.companyName,
    category: company.industry,
    metadata: {
      stage: company.stage,
      foundedDate: company.foundedDate,
      location: company.headquarters,
      investmentAmount: company.investmentAmount,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function extractRelationshipsFromAnalytics(
  analytics: Tier3Analytics
): NetworkRelationship[] {
  const relationships: NetworkRelationship[] = [];

  // Extract co-investor relationships
  analytics.coInvestors.forEach((coInvestor) => {
    relationships.push({
      _id: generateId(),
      fromEntityId: analytics.documentId as any,
      toEntityId: generateEntityId(coInvestor),
      relationshipType: "partner",
      strength: 0.8,
      metadata: { source: "tier3_extraction" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });

  return relationships;
}
```

### 3.3 API Specifications

#### Required Convex Functions

```typescript
// Network data aggregation
export const getNetworkGraphData = query({
  args: {
    filters: v.optional(
      v.object({
        entityTypes: v.optional(v.array(v.string())),
        relationshipTypes: v.optional(v.array(v.string())),
        industries: v.optional(v.array(v.string())),
        dateRange: v.optional(
          v.object({
            start: v.number(),
            end: v.number(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Aggregate network data with filters
    // Return nodes and edges for visualization
  },
});

export const getRelationshipMatrix = query({
  args: {
    entityIds: v.array(v.id("networkEntities")),
    relationshipType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate relationship matrix data
    // Include strength values and metadata
  },
});

export const getNetworkClusters = query({
  args: {
    algorithm: v.optional(
      v.union(
        v.literal("louvain"),
        v.literal("k-means"),
        v.literal("hierarchical")
      )
    ),
    entityType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Run clustering algorithm
    // Return cluster assignments and metadata
  },
});

export const getNetworkAnalytics = query({
  args: {
    entityId: v.id("networkEntities"),
    metrics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate network metrics for entity
    // Return centrality measures and other analytics
  },
});

// Network search and discovery
export const searchNetworkEntities = query({
  args: {
    query: v.string(),
    entityType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search network entities with fuzzy matching
    // Return ranked results with relevance scores
  },
});

export const findNetworkPaths = query({
  args: {
    fromEntityId: v.id("networkEntities"),
    toEntityId: v.id("networkEntities"),
    maxDepth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find shortest paths between entities
    // Return path with intermediate nodes
  },
});
```

## 4. Implementation Plan

### 4.1 Phase 1: Data Infrastructure and Basic Network Graph (Week 1-3)

#### 4.1.1 File Structure Setup

```
src/
├── components/
│   ├── network/
│   │   ├── NetworkGraph.tsx
│   │   ├── RelationshipMatrix.tsx
│   │   ├── NetworkClusters.tsx
│   │   ├── NetworkTimeline.tsx
│   │   ├── NetworkSearch.tsx
│   │   └── NetworkAnalytics.tsx
│   ├── visualization/
│   │   ├── D3NetworkGraph.tsx
│   │   ├── ForceGraphContainer.tsx
│   │   ├── NetworkControls.tsx
│   │   └── VisualizationFilters.tsx
│   └── ui/
│       ├── NetworkTooltip.tsx
│       ├── EntityCard.tsx
│       └── RelationshipLegend.tsx
├── pages/
│   ├── NetworkIntelligencePage.tsx
│   └── NetworkAnalysisPage.tsx
├── hooks/
│   ├── useNetworkData.ts
│   ├── useNetworkFilters.ts
│   └── useNetworkAnalytics.ts
├── utils/
│   ├── networkUtils.ts
│   ├── graphUtils.ts
│   └── analyticsUtils.ts
└── types/
    ├── network.ts
    └── visualization.ts
```

#### 4.1.2 Core Network Graph Implementation

```typescript
// src/components/network/NetworkGraph.tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  category?: string;
  size: number;
  color: string;
  x?: number;
  y?: number;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: string;
  strength: number;
  value: number;
}

interface NetworkGraphProps {
  width?: number;
  height?: number;
  filters?: NetworkFilters;
}

export function NetworkGraph({
  width = 800,
  height = 600,
  filters
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  const networkData = useQuery(api.queries.getNetworkGraphData, { filters });

  useEffect(() => {
    if (!svgRef.current || !networkData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create force simulation
    const simulation = d3.forceSimulation<NetworkNode>(networkData.nodes)
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(networkData.links)
        .id(d => d.id)
        .strength(d => d.strength)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 2));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(networkData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", d => d.strength)
      .attr("stroke-width", d => Math.sqrt(d.value));

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(networkData.nodes)
      .enter()
      .append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("click", (event, d) => setSelectedNode(d))
      .on("mouseover", (event, d) => setHoveredNode(d))
      .on("mouseout", () => setHoveredNode(null));

    // Create labels
    const label = svg.append("g")
      .selectAll("text")
      .data(networkData.nodes)
      .enter()
      .append("text")
      .text(d => d.name)
      .style("font-size", "10px")
      .style("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as NetworkNode).x!)
        .attr("y1", d => (d.source as NetworkNode).y!)
        .attr("x2", d => (d.target as NetworkNode).x!)
        .attr("y2", d => (d.target as NetworkNode).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      label
        .attr("x", d => d.x! + d.size + 2)
        .attr("y", d => d.y! + 3);
    });

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, NetworkNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    return () => {
      simulation.stop();
    };
  }, [networkData, width, height]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 "
      />
      {selectedNode && (
        <EntityCard
          entity={selectedNode}
          onClose={() => setSelectedNode(null)}
          className="absolute top-4 right-4"
        />
      )}
      {hoveredNode && (
        <NetworkTooltip
          entity={hoveredNode}
          position={{ x: width / 2, y: 20 }}
        />
      )}
    </div>
  );
}

// src/components/visualization/D3NetworkGraph.tsx
import { useCallback, useMemo } from "react";
import { NetworkGraph } from "@/components/network/NetworkGraph";
import { NetworkControls } from "@/components/visualization/NetworkControls";
import { VisualizationFilters } from "@/components/visualization/VisualizationFilters";

interface D3NetworkGraphProps {
  className?: string;
}

export function D3NetworkGraph({ className }: D3NetworkGraphProps) {
  const [filters, setFilters] = useState<NetworkFilters>({
    entityTypes: ['company', 'investor'],
    relationshipTypes: ['invests_in', 'partner'],
    industries: [],
    dateRange: undefined
  });

  const [layout, setLayout] = useState<'force' | 'circular' | 'hierarchical'>('force');
  const [showLabels, setShowLabels] = useState(true);
  const [showStrength, setShowStrength] = useState(true);

  const handleFilterChange = useCallback((newFilters: NetworkFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = useCallback((format: 'png' | 'svg' | 'json') => {
    // Export functionality implementation
    console.log(`Exporting network as ${format}`);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Network Intelligence</h2>
        <NetworkControls
          layout={layout}
          onLayoutChange={setLayout}
          showLabels={showLabels}
          onShowLabelsChange={setShowLabels}
          showStrength={showStrength}
          onShowStrengthChange={setShowStrength}
          onExport={handleExport}
        />
      </div>

      <VisualizationFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      <NetworkGraph
        width={1200}
        height={600}
        filters={filters}
      />
    </div>
  );
}
```

#### 4.1.3 Network Page Implementation

```typescript
// src/pages/NetworkIntelligencePage.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkGraph } from "@/components/network/NetworkGraph";
import { RelationshipMatrix } from "@/components/network/RelationshipMatrix";
import { NetworkClusters } from "@/components/network/NetworkClusters";
import { NetworkTimeline } from "@/components/network/NetworkTimeline";
import { NetworkSearch } from "@/components/network/NetworkSearch";

export function NetworkIntelligencePage() {
  const [activeTab, setActiveTab] = useState('graph');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Network Intelligence</h1>
        <p className="text-gray-600">
          Explore relationships and patterns in your portfolio network
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="graph">Network Graph</TabsTrigger>
          <TabsTrigger value="matrix">Relationship Matrix</TabsTrigger>
          <TabsTrigger value="clusters">Cluster Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="search">Search & Discovery</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <NetworkGraph />
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <RelationshipMatrix />
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <NetworkClusters />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <NetworkTimeline />
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <NetworkSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4.2 Phase 2: Relationship Matrix and Cluster Analysis (Week 4-6)

#### 4.2.1 Relationship Matrix Implementation

```typescript
// src/components/network/RelationshipMatrix.tsx
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RelationshipMatrixProps {
  className?: string;
}

export function RelationshipMatrix({ className }: RelationshipMatrixProps) {
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [relationshipType, setRelationshipType] = useState<string>('all');

  const matrixData = useQuery(api.queries.getRelationshipMatrix, {
    entityIds: selectedEntities,
    relationshipType
  });

  const sortedEntities = useMemo(() => {
    if (!matrixData) return [];
    return matrixData.entities.sort((a, b) => a.name.localeCompare(b.name));
  }, [matrixData]);

  const getCellColor = (strength: number) => {
    const opacity = Math.max(0.1, strength);
    return `rgba(59, 130, 246, ${opacity})`; // Blue with varying opacity
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Relationship Matrix</h3>
        <div className="flex gap-2">
          <select
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="all">All Relationships</option>
            <option value="invests_in">Investment</option>
            <option value="partner">Partnership</option>
            <option value="competitor">Competition</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-600"></th>
              {sortedEntities.map((entity) => (
                <th
                  key={entity.id}
                  className="p-2 text-xs font-medium text-gray-600 rotate-45"
                  style={{ minWidth: '80px' }}
                >
                  {entity.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedEntities.map((rowEntity) => (
              <tr key={rowEntity.id}>
                <td className="p-2 text-sm font-medium text-gray-900 border-r">
                  {rowEntity.name}
                </td>
                {sortedEntities.map((colEntity) => {
                  if (rowEntity.id === colEntity.id) {
                    return (
                      <td
                        key={colEntity.id}
                        className="p-2 bg-gray-100 border border-gray-200"
                      ></td>
                    );
                  }

                  const relationship = matrixData?.relationships.find(
                    (r) =>
                      (r.from === rowEntity.id && r.to === colEntity.id) ||
                      (r.from === colEntity.id && r.to === rowEntity.id)
                  );

                  return (
                    <td
                      key={colEntity.id}
                      className="p-2 border border-gray-200 cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: relationship ? getCellColor(relationship.strength) : 'transparent'
                      }}
                      onClick={() => {
                        if (relationship) {
                          // Show relationship details
                          console.log('Relationship:', relationship);
                        }
                      }}
                    >
                      {relationship && (
                        <div className="text-xs text-center">
                          {Math.round(relationship.strength * 100)}%
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
          <span>Weak Relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border border-gray-300"></div>
          <span>Strong Relationship</span>
        </div>
      </div>
    </div>
  );
}
```

#### 4.2.2 Cluster Analysis Implementation

```typescript
// src/components/network/NetworkClusters.tsx
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NetworkClustersProps {
  className?: string;
}

export function NetworkClusters({ className }: NetworkClustersProps) {
  const [algorithm, setAlgorithm] = useState<'louvain' | 'k-means' | 'hierarchical'>('louvain');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const clusters = useQuery(api.queries.getNetworkClusters, { algorithm });

  const getClusterColor = (clusterId: string) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];
    const hash = clusterId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cluster Analysis</h3>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-md"
        >
          <option value="louvain">Louvain Community Detection</option>
          <option value="k-means">K-Means Clustering</option>
          <option value="hierarchical">Hierarchical Clustering</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clusters?.map((cluster) => (
          <div
            key={cluster.clusterId}
            className="bg-white border border-gray-200  p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getClusterColor(cluster.clusterId) }}
                ></div>
                Cluster {cluster.clusterId}
              </h4>
              <span className="text-sm text-gray-500">
                {cluster.entityIds.length} entities
              </span>
            </div>

            <div className="space-y-2">
              {cluster.entityIds.slice(0, 5).map((entityId) => (
                <div key={entityId} className="text-sm text-gray-600">
                  {/* Entity name would be resolved from entity ID */}
                  Entity: {entityId}
                </div>
              ))}
              {cluster.entityIds.length > 5 && (
                <div className="text-sm text-gray-400">
                  ... and {cluster.entityIds.length - 5} more
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Density: {cluster.metadata.density?.toFixed(2)}</span>
                <span>Modularity: {cluster.metadata.modularity?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50  p-4">
        <h4 className="font-medium mb-2">Cluster Insights</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Largest cluster contains {Math.max(...(clusters?.map(c => c.entityIds.length) || [0]))} entities</p>
          <p>• Total clusters identified: {clusters?.length || 0}</p>
          <p>• Average cluster size: {clusters ? Math.round(clusters.reduce((acc, c) => acc + c.entityIds.length, 0) / clusters.length) : 0}</p>
        </div>
      </div>
    </div>
  );
}
```

### 4.3 Phase 3: Timeline Visualization and Search Features (Week 7-9)

#### 4.3.1 Network Timeline Implementation

```typescript
// src/components/network/NetworkTimeline.tsx
import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface NetworkTimelineProps {
  className?: string;
}

export function NetworkTimeline({ className }: NetworkTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // months per second
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const timelineData = useQuery(api.queries.getNetworkTimeline, {
    startDate: new Date(currentDate.getFullYear() - 2, 0, 1).getTime(),
    endDate: currentDate.getTime()
  });

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stepForward = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }, [currentDate]);

  const stepBackward = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }, [currentDate]);

  const resetTimeline = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Network Evolution Timeline</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={stepBackward}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Previous Month"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlayback}
            className="p-2 hover:bg-gray-100 rounded-md"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={stepForward}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Next Month"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={resetTimeline}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200  p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Timeline Position</span>
            <span className="text-sm text-gray-500">
              {currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
          <input
            type="range"
            min={new Date(currentDate.getFullYear() - 2, 0, 1).getTime()}
            max={new Date().getTime()}
            value={currentDate.getTime()}
            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value)))}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Network Events</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {timelineData?.events
              .filter(event => new Date(event.date) <= currentDate)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 20)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'investment' ? 'bg-green-100 text-green-800' :
                        event.type === 'partnership' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'acquisition' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type}
                      </span>
                      {event.entities.map(entity => (
                        <span key={entity} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-3">Network Metrics Over Time</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {timelineData?.metrics[currentDate.toISOString()]?.nodes || 0}
              </div>
              <div className="text-sm text-gray-600">Total Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {timelineData?.metrics[currentDate.toISOString()]?.edges || 0}
              </div>
              <div className="text-sm text-gray-600">Total Edges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {timelineData?.metrics[currentDate.toISOString()]?.density?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Network Density</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {timelineData?.metrics[currentDate.toISOString()]?.clusters || 0}
              </div>
              <div className="text-sm text-gray-600">Clusters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 4.3.2 Network Search Implementation

```typescript
// src/components/network/NetworkSearch.tsx
import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Users, Building2, MapPin, TrendingUp } from "lucide-react";

interface NetworkSearchProps {
  className?: string;
}

export function NetworkSearch({ className }: NetworkSearchProps) {
  const [query, setQuery] = useState('');
  const [entityType, setEntityType] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [pathTarget, setPathTarget] = useState<string | null>(null);

  const searchResults = useQuery(api.queries.searchNetworkEntities, {
    query,
    entityType: entityType !== 'all' ? entityType : undefined,
    limit: 20
  });

  const networkPaths = useQuery(api.queries.findNetworkPaths, {
    fromEntityId: selectedEntity!,
    toEntityId: pathTarget!,
    maxDepth: 5
  }, { skip: !selectedEntity || !pathTarget });

  const handleEntitySelect = useCallback((entityId: string) => {
    if (selectedEntity && selectedEntity !== entityId) {
      setPathTarget(entityId);
    } else {
      setSelectedEntity(entityId);
      setPathTarget(null);
    }
  }, [selectedEntity]);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'investor': return <Users className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Network Search & Discovery</h3>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies, investors, people..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="company">Companies</option>
            <option value="investor">Investors</option>
            <option value="person">People</option>
            <option value="location">Locations</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Search Results</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults?.map((entity) => (
              <div
                key={entity.id}
                onClick={() => handleEntitySelect(entity.id)}
                className={`p-4 border  cursor-pointer transition-colors ${
                  selectedEntity === entity.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-gray-500">
                    {getEntityIcon(entity.type)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{entity.name}</h5>
                    <p className="text-sm text-gray-600">{entity.category}</p>
                    {entity.metadata && (
                      <div className="mt-2 text-xs text-gray-500">
                        {Object.entries(entity.metadata)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {String(value)}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      entity.type === 'company' ? 'bg-blue-100 text-blue-800' :
                      entity.type === 'investor' ? 'bg-green-100 text-green-800' :
                      entity.type === 'person' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entity.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">
            {pathTarget ? 'Network Paths' : 'Entity Analytics'}
          </h4>

          {pathTarget && networkPaths ? (
            <div className="space-y-3">
              {networkPaths.paths.map((path, index) => (
                <div key={index} className="p-4 bg-gray-50 ">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Path {index + 1}</span>
                    <span className="text-xs text-gray-500">
                      {path.length - 1} steps
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {path.map((entity, i) => (
                      <React.Fragment key={entity.id}>
                        <span className={`px-2 py-1 rounded ${
                          i === 0 || i === path.length - 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {entity.name}
                        </span>
                        {i < path.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedEntity ? (
            <div className="space-y-4">
              <EntityAnalytics entityId={selectedEntity} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select an entity to view analytics</p>
              <p className="text-sm mt-2">
                Select two entities to find network paths between them
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for entity analytics
function EntityAnalytics({ entityId }: { entityId: string }) {
  const analytics = useQuery(api.queries.getNetworkAnalytics, {
    entityId: entityId as any,
    metrics: ['degree_centrality', 'betweenness_centrality', 'closeness_centrality', 'clustering_coefficient']
  });

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-3">
      <h5 className="font-medium">Network Analytics</h5>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-md">
          <div className="text-lg font-bold text-blue-600">
            {analytics.degree_centrality?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Degree Centrality</div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-md">
          <div className="text-lg font-bold text-green-600">
            {analytics.betweenness_centrality?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Betweenness Centrality</div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-md">
          <div className="text-lg font-bold text-purple-600">
            {analytics.closeness_centrality?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Closeness Centrality</div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-md">
          <div className="text-lg font-bold text-orange-600">
            {analytics.clustering_coefficient?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Clustering Coefficient</div>
        </div>
      </div>
    </div>
  );
}
```

### 4.4 Phase 4: Advanced Analytics and Performance Optimization (Week 10-12)

#### 4.4.1 Advanced Network Analytics

```typescript
// src/components/network/NetworkAnalytics.tsx
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface NetworkAnalyticsProps {
  className?: string;
}

export function NetworkAnalytics({ className }: NetworkAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('growth_rate');
  const [timeRange, setTimeRange] = useState('1y');

  const analyticsData = useQuery(api.queries.getAdvancedNetworkAnalytics, {
    metric: selectedMetric,
    timeRange
  });

  const topInfluencers = useQuery(api.queries.getTopInfluencers, {
    limit: 10,
    metric: 'betweenness_centrality'
  });

  const networkHealth = useQuery(api.queries.getNetworkHealthMetrics);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Advanced Network Analytics</h3>
        <div className="flex gap-2">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="growth_rate">Network Growth</option>
            <option value="density">Network Density</option>
            <option value="clustering">Clustering Coefficient</option>
            <option value="connectivity">Network Connectivity</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 ">
          <h4 className="font-medium mb-4">Network Metrics Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 border border-gray-200 ">
          <h4 className="font-medium mb-4">Network Health Dashboard</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall Health Score</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(networkHealth?.overallScore || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((networkHealth?.overallScore || 0) * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Connectivity</div>
                <div className="text-lg font-bold text-blue-600">
                  {(networkHealth?.connectivity || 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Resilience</div>
                <div className="text-lg font-bold text-green-600">
                  {(networkHealth?.resilience || 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Diversity</div>
                <div className="text-lg font-bold text-purple-600">
                  {(networkHealth?.diversity || 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-lg font-bold text-orange-600">
                  {(networkHealth?.efficiency || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 ">
        <h4 className="font-medium mb-4">Top Network Influencers</h4>
        <div className="space-y-3">
          {topInfluencers?.map((influencer, index) => (
            <div key={influencer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{influencer.name}</div>
                  <div className="text-sm text-gray-600">{influencer.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{influencer.score.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Centrality Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 5. Code Change Overview

### 5.1 New Files to Create

#### Core Network Components

```typescript
// src/components/network/NetworkGraph.tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function NetworkGraph({
  width = 800,
  height = 600,
  filters,
}: NetworkGraphProps) {
  // Implementation from Phase 1.1.2
  // D3.js force-directed graph with Convex data integration
}

// src/components/network/RelationshipMatrix.tsx
export function RelationshipMatrix({ className }: RelationshipMatrixProps) {
  // Implementation from Phase 2.2.1
  // Interactive matrix visualization of entity relationships
}

// src/components/network/NetworkClusters.tsx
export function NetworkClusters({ className }: NetworkClustersProps) {
  // Implementation from Phase 2.2.2
  // Cluster analysis visualization with multiple algorithms
}

// src/components/network/NetworkTimeline.tsx
export function NetworkTimeline({ className }: NetworkTimelineProps) {
  // Implementation from Phase 3.3.1
  // Timeline visualization of network evolution
}

// src/components/network/NetworkSearch.tsx
export function NetworkSearch({ className }: NetworkSearchProps) {
  // Implementation from Phase 3.3.2
  // Advanced search and path finding capabilities
}

// src/components/network/NetworkAnalytics.tsx
export function NetworkAnalytics({ className }: NetworkAnalyticsProps) {
  // Implementation from Phase 4.4.1
  // Advanced network analytics dashboard
}
```

#### Visualization Components

```typescript
// src/components/visualization/D3NetworkGraph.tsx
export function D3NetworkGraph({ className }: D3NetworkGraphProps) {
  // Wrapper component for D3.js network graph
}

// src/components/visualization/ForceGraphContainer.tsx
export function ForceGraphContainer({
  data,
  config,
}: ForceGraphContainerProps) {
  // Configurable force-directed graph container
}

// src/components/visualization/NetworkControls.tsx
export function NetworkControls({
  layout,
  onLayoutChange,
  showLabels,
  onShowLabelsChange,
  showStrength,
  onShowStrengthChange,
  onExport,
}: NetworkControlsProps) {
  // Control panel for network visualization
}

// src/components/visualization/VisualizationFilters.tsx
export function VisualizationFilters({
  filters,
  onFiltersChange,
}: VisualizationFiltersProps) {
  // Filter panel for network visualizations
}
```

#### UI Components

```typescript
// src/components/ui/NetworkTooltip.tsx
export function NetworkTooltip({ entity, position }: NetworkTooltipProps) {
  // Tooltip component for network entities
}

// src/components/ui/EntityCard.tsx
export function EntityCard({ entity, onClose, className }: EntityCardProps) {
  // Detailed entity information card
}

// src/components/ui/RelationshipLegend.tsx
export function RelationshipLegend({
  relationshipTypes,
}: RelationshipLegendProps) {
  // Legend for relationship types and colors
}
```

#### Custom Hooks

```typescript
// src/hooks/useNetworkData.ts
export function useNetworkData(filters?: NetworkFilters) {
  const data = useQuery(api.queries.getNetworkGraphData, { filters });
  // Data processing and caching logic
  return { data, loading: !data, error: null };
}

// src/hooks/useNetworkFilters.ts
export function useNetworkFilters(initialFilters?: NetworkFilters) {
  const [filters, setFilters] = useState<NetworkFilters>(initialFilters || {});
  // Filter state management
  return { filters, setFilters, updateFilter, clearFilters };
}

// src/hooks/useNetworkAnalytics.ts
export function useNetworkAnalytics(entityId: string, metrics: string[]) {
  const analytics = useQuery(api.queries.getNetworkAnalytics, {
    entityId,
    metrics,
  });
  // Analytics data processing
  return { analytics, loading: !analytics, error: null };
}
```

#### Utility Functions

```typescript
// src/utils/networkUtils.ts
export function transformPortfolioDataToNetwork(
  portfolioData: PortfolioData[]
): NetworkData {
  // Transform portfolio data into network format
}

export function calculateNetworkMetrics(
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): NetworkMetrics {
  // Calculate various network metrics
}

export function findShortestPath(
  nodes: NetworkNode[],
  edges: NetworkEdge[],
  source: string,
  target: string
): NetworkPath[] {
  // Implement shortest path algorithm
}

export function detectCommunities(
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): Cluster[] {
  // Implement community detection algorithm
}

// src/utils/graphUtils.ts
export function createForceSimulation(
  nodes: any[],
  links: any[]
): d3.Simulation<any, any> {
  // Create D3 force simulation
}

export function colorByEntityType(type: string): string {
  // Return color based on entity type
}

export function sizeByImportance(importance: number): number {
  // Calculate node size based on importance
}

// src/utils/analyticsUtils.ts
export function calculateCentralityMeasures(
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): CentralityMeasures {
  // Calculate degree, betweenness, and closeness centrality
}

export function calculateNetworkDensity(
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): number {
  // Calculate network density
}

export function calculateClusteringCoefficient(
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): number {
  // Calculate clustering coefficient
}
```

#### Type Definitions

```typescript
// src/types/network.ts
export interface NetworkNode {
  id: string;
  name: string;
  type: "company" | "investor" | "person" | "fund" | "location";
  category?: string;
  size: number;
  color: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  metadata: Record<string, any>;
}

export interface NetworkEdge {
  id: string;
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: string;
  strength: number;
  value: number;
  metadata: Record<string, any>;
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface NetworkFilters {
  entityTypes?: string[];
  relationshipTypes?: string[];
  industries?: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  minStrength?: number;
}

export interface NetworkCluster {
  id: string;
  name: string;
  nodes: NetworkNode[];
  density: number;
  modularity: number;
  metadata: Record<string, any>;
}

export interface NetworkPath {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  length: number;
  strength: number;
}

// src/types/visualization.ts
export interface VisualizationConfig {
  layout: "force" | "circular" | "hierarchical";
  showLabels: boolean;
  showStrength: boolean;
  colorScheme: string;
  nodeSizeRange: [number, number];
  edgeWidthRange: [number, number];
}

export interface NetworkControlsProps {
  layout: string;
  onLayoutChange: (layout: string) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  showStrength: boolean;
  onShowStrengthChange: (show: boolean) => void;
  onExport: (format: string) => void;
}

export interface VisualizationFiltersProps {
  filters: NetworkFilters;
  onFiltersChange: (filters: NetworkFilters) => void;
}
```

### 5.2 Existing Files to Modify

#### Route Configuration Updates

```typescript
// src/App.tsx (existing file)
// BEFORE:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
</Routes>

// AFTER:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
  <Route path="/network" element={<NetworkIntelligencePage />} />
  <Route path="/network/analysis" element={<NetworkAnalysisPage />} />
</Routes>
```

#### Navigation Updates

```typescript
// src/components/Navigation.tsx (existing file)
// Add new navigation items:
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Companies", href: "/companies" },
  { name: "Network", href: "/network" },
  { name: "Documents", href: "/documents" },
  { name: "Analytics", href: "/analytics" },
];
```

#### Package Dependencies Update

```json
// package.json (add to dependencies)
{
  "dependencies": {
    // ... existing dependencies
    "d3": "^7.8.5",
    "vis-network": "^9.1.6",
    "react-force-graph-2d": "^1.25.4",
    "d3-force": "^3.0.0",
    "d3-selection": "^3.0.0",
    "d3-scale": "^4.0.2",
    "d3-hierarchy": "^3.1.2"
  }
}
```

### 5.3 Backend Functions to Add

#### Convex Query Functions

```typescript
// convex/queries.ts (add to existing file)
export const getNetworkGraphData = query({
  args: {
    filters: v.optional(
      v.object({
        entityTypes: v.optional(v.array(v.string())),
        relationshipTypes: v.optional(v.array(v.string())),
        industries: v.optional(v.array(v.string())),
        dateRange: v.optional(
          v.object({
            start: v.number(),
            end: v.number(),
          })
        ),
        minStrength: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { filters = {} } = args;

    // Get portfolio companies
    const companies = await ctx.db.query("portfolioCompanies").collect();

    // Get tier3 analytics for network data
    const analytics = await ctx.db.query("tier3Analytics").collect();

    // Transform to network format
    const nodes: NetworkNode[] = companies.map((company) => ({
      id: company._id,
      name: company.companyName,
      type: "company",
      category: company.industry,
      size: 10 + (company.investmentAmount || 0) / 1000000,
      color: getColorByIndustry(company.industry),
      metadata: {
        stage: company.stage,
        location: company.headquarters,
        investmentAmount: company.investmentAmount,
      },
    }));

    // Extract relationships from analytics
    const edges: NetworkEdge[] = [];
    for (const analytic of analytics) {
      // Add co-investor relationships
      analytic.coInvestors.forEach((coInvestor) => {
        edges.push({
          id: `${analytic.documentId}-${coInvestor}`,
          source: analytic.documentId,
          target: coInvestor,
          type: "co_investor",
          strength: 0.8,
          value: 1,
          metadata: { source: "tier3_extraction" },
        });
      });

      // Add other relationship types...
    }

    // Apply filters
    const filteredNodes = filterNodes(nodes, filters);
    const filteredEdges = filterEdges(edges, filters);

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  },
});

export const getRelationshipMatrix = query({
  args: {
    entityIds: v.array(v.id("networkEntities")),
    relationshipType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { entityIds, relationshipType } = args;

    // Get entities
    const entities = await ctx.db
      .query("networkEntities")
      .filter((q) => q.or(...entityIds.map((id) => q.eq(q.field("_id"), id))))
      .collect();

    // Get relationships
    const relationships = await ctx.db
      .query("networkRelationships")
      .filter((q) => {
        let query = q.or(
          ...entityIds.map((id) => q.eq(q.field("fromEntityId"), id)),
          ...entityIds.map((id) => q.eq(q.field("toEntityId"), id))
        );

        if (relationshipType) {
          query = q.and(
            query,
            q.eq(q.field("relationshipType"), relationshipType)
          );
        }

        return query;
      })
      .collect();

    // Generate matrix data
    const matrix: number[][] = [];
    for (let i = 0; i < entities.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < entities.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const relationship = relationships.find(
            (r) =>
              (r.fromEntityId === entities[i]._id &&
                r.toEntityId === entities[j]._id) ||
              (r.fromEntityId === entities[j]._id &&
                r.toEntityId === entities[i]._id)
          );
          matrix[i][j] = relationship?.strength || 0;
        }
      }
    }

    return {
      entities,
      relationships,
      matrix,
    };
  },
});

export const getNetworkClusters = query({
  args: {
    algorithm: v.optional(
      v.union(
        v.literal("louvain"),
        v.literal("k-means"),
        v.literal("hierarchical")
      )
    ),
    entityType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { algorithm = "louvain", entityType } = args;

    // Get entities
    const entities = await ctx.db
      .query("networkEntities")
      .filter((q) => (entityType ? q.eq(q.field("type"), entityType) : q))
      .collect();

    // Get relationships
    const relationships = await ctx.db.query("networkRelationships").collect();

    // Run clustering algorithm
    const clusters = runClusteringAlgorithm(entities, relationships, algorithm);

    return clusters;
  },
});

export const searchNetworkEntities = query({
  args: {
    query: v.string(),
    entityType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { query, entityType, limit = 20 } = args;

    // Implement fuzzy search
    const entities = await ctx.db
      .query("networkEntities")
      .filter((q) => {
        let baseQuery = q;

        if (entityType) {
          baseQuery = baseQuery.eq(q.field("type"), entityType);
        }

        // Simple text search (in production, use proper fuzzy search)
        return baseQuery.or(
          q.like(q.field("name"), `%${query}%`),
          q.like(q.field("category"), `%${query}%`)
        );
      })
      .take(limit);

    // Calculate relevance scores
    const scoredEntities = entities.map((entity) => ({
      ...entity,
      relevanceScore: calculateRelevanceScore(entity, query),
    }));

    // Sort by relevance
    return scoredEntities.sort((a, b) => b.relevanceScore - a.relevanceScore);
  },
});

export const findNetworkPaths = query({
  args: {
    fromEntityId: v.id("networkEntities"),
    toEntityId: v.id("networkEntities"),
    maxDepth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { fromEntityId, toEntityId, maxDepth = 5 } = args;

    // Get relationships
    const relationships = await ctx.db.query("networkRelationships").collect();

    // Build adjacency list
    const graph = buildAdjacencyList(relationships);

    // Find shortest paths using BFS
    const paths = findShortestPaths(graph, fromEntityId, toEntityId, maxDepth);

    return {
      paths,
      fromEntityId,
      toEntityId,
      maxDepth,
    };
  },
});

export const getNetworkTimeline = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate } = args;

    // Get events from various sources
    const investmentEvents = await getInvestmentEvents(ctx, startDate, endDate);
    const partnershipEvents = await getPartnershipEvents(
      ctx,
      startDate,
      endDate
    );
    const milestoneEvents = await getMilestoneEvents(ctx, startDate, endDate);

    // Combine and sort events
    const allEvents = [
      ...investmentEvents,
      ...partnershipEvents,
      ...milestoneEvents,
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Generate metrics over time
    const metrics = generateNetworkMetrics(allEvents, startDate, endDate);

    return {
      events: allEvents,
      metrics,
    };
  },
});

export const getAdvancedNetworkAnalytics = query({
  args: {
    metric: v.string(),
    timeRange: v.string(),
  },
  handler: async (ctx, args) => {
    const { metric, timeRange } = args;

    // Calculate time series data for requested metric
    const data = await calculateTimeSeriesMetric(ctx, metric, timeRange);

    return data;
  },
});

export const getTopInfluencers = query({
  args: {
    limit: v.number(),
    metric: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit, metric } = args;

    // Get entities with their analytics
    const entities = await ctx.db.query("networkEntities").collect();

    const influencers = await Promise.all(
      entities.map(async (entity) => {
        const analytics = await ctx.db
          .query("networkAnalytics")
          .withIndex("by_entity_metric", (q) =>
            q.eq("entityId", entity._id).eq("metric", metric)
          )
          .first();

        return {
          ...entity,
          score: analytics?.value || 0,
        };
      })
    );

    // Sort by score and limit
    return influencers.sort((a, b) => b.score - a.score).slice(0, limit);
  },
});

export const getNetworkHealthMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Calculate overall network health metrics
    const connectivity = await calculateNetworkConnectivity(ctx);
    const resilience = await calculateNetworkResilience(ctx);
    const diversity = await calculateNetworkDiversity(ctx);
    const efficiency = await calculateNetworkEfficiency(ctx);

    const overallScore =
      (connectivity + resilience + diversity + efficiency) / 4;

    return {
      overallScore,
      connectivity,
      resilience,
      diversity,
      efficiency,
    };
  },
});
```

#### Helper Functions

```typescript
// convex/lib/networkUtils.ts (new file)
import { NetworkNode, NetworkEdge, NetworkCluster } from "../types/network";

export function filterNodes(nodes: NetworkNode[], filters: any): NetworkNode[] {
  let filtered = [...nodes];

  if (filters.entityTypes?.length > 0) {
    filtered = filtered.filter((node) =>
      filters.entityTypes.includes(node.type)
    );
  }

  if (filters.industries?.length > 0) {
    filtered = filtered.filter((node) =>
      filters.industries.includes(node.category)
    );
  }

  return filtered;
}

export function filterEdges(edges: NetworkEdge[], filters: any): NetworkEdge[] {
  let filtered = [...edges];

  if (filters.relationshipTypes?.length > 0) {
    filtered = filtered.filter((edge) =>
      filters.relationshipTypes.includes(edge.type)
    );
  }

  if (filters.minStrength !== undefined) {
    filtered = filtered.filter((edge) => edge.strength >= filters.minStrength);
  }

  return filtered;
}

export function getColorByIndustry(industry: string): string {
  const colors = {
    Technology: "#3B82F6",
    Healthcare: "#10B981",
    Finance: "#F59E0B",
    Energy: "#EF4444",
    Consumer: "#8B5CF6",
    Industrial: "#EC4899",
    "Real Estate": "#14B8A6",
    Other: "#6B7280",
  };
  return colors[industry as keyof typeof colors] || colors.Other;
}

export function runClusteringAlgorithm(
  entities: NetworkNode[],
  relationships: NetworkEdge[],
  algorithm: string
): NetworkCluster[] {
  switch (algorithm) {
    case "louvain":
      return runLouvainClustering(entities, relationships);
    case "k-means":
      return runKMeansClustering(entities, relationships);
    case "hierarchical":
      return runHierarchicalClustering(entities, relationships);
    default:
      return runLouvainClustering(entities, relationships);
  }
}

export function calculateRelevanceScore(entity: any, query: string): number {
  const name = entity.name.toLowerCase();
  const category = entity.category?.toLowerCase() || "";
  const queryLower = query.toLowerCase();

  let score = 0;

  // Exact name match
  if (name === queryLower) score += 100;
  // Name starts with query
  else if (name.startsWith(queryLower)) score += 80;
  // Name contains query
  else if (name.includes(queryLower)) score += 60;
  // Category contains query
  else if (category.includes(queryLower)) score += 40;
  // Fuzzy match
  else if (fuzzyMatch(name, queryLower)) score += 20;

  return score;
}

export function fuzzyMatch(str1: string, str2: string): boolean {
  // Simple fuzzy matching implementation
  let i = 0;
  for (const char of str2) {
    i = str1.indexOf(char, i);
    if (i === -1) return false;
    i++;
  }
  return true;
}

export function buildAdjacencyList(
  relationships: NetworkEdge[]
): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  relationships.forEach((edge) => {
    const sourceId =
      typeof edge.source === "string" ? edge.source : edge.source.id;
    const targetId =
      typeof edge.target === "string" ? edge.target : edge.target.id;

    if (!graph.has(sourceId)) graph.set(sourceId, []);
    if (!graph.has(targetId)) graph.set(targetId, []);

    graph.get(sourceId)!.push(targetId);
    graph.get(targetId)!.push(sourceId);
  });

  return graph;
}

export function findShortestPaths(
  graph: Map<string, string[]>,
  source: string,
  target: string,
  maxDepth: number
): string[][] {
  const paths: string[][] = [];
  const queue: { node: string; path: string[] }[] = [
    { node: source, path: [source] },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (node === target) {
      paths.push(path);
      continue;
    }

    if (path.length > maxDepth || visited.has(node)) continue;

    visited.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return paths;
}

// Additional helper functions for specific algorithms
function runLouvainClustering(
  entities: NetworkNode[],
  relationships: NetworkEdge[]
): NetworkCluster[] {
  // Implement Louvain community detection algorithm
  // This is a simplified version - in production, use a proper library
  const clusters: NetworkCluster[] = [];
  const visited = new Set<string>();

  for (const entity of entities) {
    if (visited.has(entity.id)) continue;

    const cluster = {
      id: `cluster-${clusters.length}`,
      name: `Cluster ${clusters.length + 1}`,
      nodes: [entity],
      density: 0,
      modularity: 0,
      metadata: {},
    };

    // Find connected components (simplified clustering)
    const queue = [entity.id];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;

      visited.add(nodeId);

      const neighbors = relationships
        .filter((r) => r.source === nodeId || r.target === nodeId)
        .map((r) => (r.source === nodeId ? r.target : r.source));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const neighborEntity = entities.find((e) => e.id === neighbor);
          if (neighborEntity) {
            cluster.nodes.push(neighborEntity);
            queue.push(neighbor);
          }
        }
      }
    }

    cluster.density = calculateClusterDensity(cluster.nodes, relationships);
    clusters.push(cluster);
  }

  return clusters;
}

function runKMeansClustering(
  entities: NetworkNode[],
  relationships: NetworkEdge[]
): NetworkCluster[] {
  // Implement K-means clustering (simplified)
  const k = Math.min(5, Math.ceil(entities.length / 3));
  const clusters: NetworkCluster[] = [];

  // Simple implementation based on entity types
  const groups = entities.reduce(
    (acc, entity) => {
      const key = entity.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entity);
      return acc;
    },
    {} as Record<string, NetworkNode[]>
  );

  Object.entries(groups).forEach(([type, nodes], index) => {
    clusters.push({
      id: `cluster-${index}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Cluster`,
      nodes,
      density: calculateClusterDensity(nodes, relationships),
      modularity: 0,
      metadata: { algorithm: "k-means", entityType: type },
    });
  });

  return clusters;
}

function runHierarchicalClustering(
  entities: NetworkNode[],
  relationships: NetworkEdge[]
): NetworkCluster[] {
  // Implement hierarchical clustering (simplified)
  // For now, return single cluster with all entities
  return [
    {
      id: "cluster-0",
      name: "Complete Network",
      nodes: entities,
      density: calculateClusterDensity(entities, relationships),
      modularity: 0,
      metadata: { algorithm: "hierarchical" },
    },
  ];
}

function calculateClusterDensity(
  nodes: NetworkNode[],
  relationships: NetworkEdge[]
): number {
  if (nodes.length < 2) return 0;

  const nodeIds = new Set(nodes.map((n) => n.id));
  const internalEdges = relationships.filter(
    (r) => nodeIds.has(r.source as string) && nodeIds.has(r.target as string)
  );

  const possibleEdges = (nodes.length * (nodes.length - 1)) / 2;
  return internalEdges.length / possibleEdges;
}
```

### 5.4 Schema Extensions

#### New Tables for Network Data

```typescript
// convex/schema.ts (add to existing schema)
// Network entities table
networkEntities: defineTable({
  type: v.union(
    v.literal("company"),
    v.literal("investor"),
    v.literal("person"),
    v.literal("fund"),
    v.literal("location")
  ),
  name: v.string(),
  category: v.optional(v.string()),
  metadata: v.record(v.string(), v.any()),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_type", ["type"])
  .index("by_name", ["name"])
  .index("by_category", ["category"]),

// Network relationships table
networkRelationships: defineTable({
  fromEntityId: v.id("networkEntities"),
  toEntityId: v.id("networkEntities"),
  relationshipType: v.union(
    v.literal("invests_in"),
    v.literal("board_member"),
    v.literal("partner"),
    v.literal("competitor"),
    v.literal("supplier"),
    v.literal("customer"),
    v.literal("co_investor")
  ),
  strength: v.number(), // 0-1 normalized strength
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  metadata: v.record(v.string(), v.any()),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_from", ["fromEntityId"])
  .index("by_to", ["toEntityId"])
  .index("by_type", ["relationshipType"])
  .index("by_strength", ["strength"]),

// Network clusters table
networkClusters: defineTable({
  name: v.string(),
  algorithm: v.union(
    v.literal("louvain"),
    v.literal("k-means"),
    v.literal("hierarchical")
  ),
  entityIds: v.array(v.id("networkEntities")),
  clusterId: v.string(),
  density: v.number(),
  modularity: v.number(),
  metadata: v.record(v.string(), v.any()),
  createdAt: v.number()
})
  .index("by_algorithm", ["algorithm"])
  .index("by_cluster", ["clusterId"]),

// Network analytics cache table
networkAnalytics: defineTable({
  entityId: v.id("networkEntities"),
  metric: v.string(),
  value: v.number(),
  calculationDate: v.number(),
  metadata: v.optional(v.record(v.string(), v.any()))
})
  .index("by_entity", ["entityId"])
  .index("by_entity_metric", ["entityId", "metric"])
  .index("by_metric", ["metric"])
  .index("by_date", ["calculationDate"]),
```

## 6. Task Completion Tracking

### 6.1 Implementation Timeline

| Phase   | Tasks                                        | Duration | Status     |
| ------- | -------------------------------------------- | -------- | ---------- |
| Phase 1 | Data infrastructure, basic network graph     | 3 weeks  | ⏳ Pending |
| Phase 2 | Relationship matrix, cluster analysis        | 3 weeks  | ⏳ Pending |
| Phase 3 | Timeline visualization, search features      | 3 weeks  | ⏳ Pending |
| Phase 4 | Advanced analytics, performance optimization | 3 weeks  | ⏳ Pending |

### 6.2 Mandatory Workflows

#### Testing Strategy

- **Unit Tests**: Network algorithm testing, component testing
- **Integration Tests**: Convex query testing, data transformation testing
- **E2E Tests**: Complete user journey testing
- **Visual Regression**: Network visualization consistency
- **Performance Testing**: Large network rendering performance

#### Quality Assurance

- **Code Review**: Algorithm implementation review
- **Network Algorithm Validation**: Verify clustering and path-finding accuracy
- **Usability Testing**: User interaction testing
- **Cross-browser Testing**: D3.js compatibility testing
- **Mobile Testing**: Touch interaction testing

#### Documentation Requirements

- **Network Algorithm Documentation**: Mathematical approach documentation
- **API Documentation**: Convex function documentation
- **User Guide**: Network intelligence features guide
- **Developer Documentation**: Network data model documentation

### 6.3 Success Metrics

#### Technical Metrics

- **Graph Rendering**: < 3 seconds for 1000+ nodes
- **Algorithm Performance**: < 5 seconds for clustering algorithms
- **Search Response**: < 500ms for network search
- **Memory Usage**: < 200MB for large networks
- **Cross-browser Compatibility**: 95%+ feature support

#### User Experience Metrics

- **Network Exploration**: Users can explore 10+ relationships per session
- **Search Success Rate**: > 85% successful network searches
- **Feature Discovery**: > 60% of users use advanced features
- **User Satisfaction**: > 4.0/5 on network visualization features
- **Task Completion**: > 90% success rate for network analysis tasks

#### Business Metrics

- **Data Insights**: 25% increase in discovered relationships
- **User Engagement**: 30% increase in time spent on network features
- **Decision Support**: 20% improvement in investment decisions
- **Collaboration**: 40% increase in shared network insights
- **Data Quality**: 50% improvement in relationship data completeness

### 6.4 Risk Assessment and Mitigation

#### Technical Risks

- **Performance Issues**: Implement lazy loading and level-of-detail rendering
- **Algorithm Complexity**: Use proven libraries and test thoroughly
- **Data Consistency**: Implement data validation and integrity checks
- **Browser Compatibility**: Test across browsers and provide fallbacks
- **Mobile Performance**: Optimize touch interactions and rendering

#### User Experience Risks

- **Complex Visualizations**: Provide progressive disclosure and tutorials
- **Information Overload**: Implement smart filtering and focusing
- **Learning Curve**: Provide guided tours and help documentation
- **Accessibility**: Ensure screen reader compatibility
- **Navigation Complexity**: Implement clear navigation patterns

#### Business Risks

- **Adoption Barriers**: Provide training and onboarding
- **Data Privacy**: Implement proper data access controls
- **Integration Complexity**: Ensure smooth integration with existing features
- **Maintenance Overhead**: Design for maintainability
- **ROI Justification**: Track business impact and value generation

### 6.5 Handover and Deployment

#### Deployment Checklist

- [ ] All network algorithms tested and validated
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Documentation completed
- [ ] User training materials prepared
- [ ] Data migration scripts tested
- [ ] Monitoring and alerting configured
- [ ] Error tracking implemented
- [ ] User notification sent

#### Post-deployment Monitoring

- **Performance Monitoring**: Track rendering times and algorithm performance
- **Usage Analytics**: Monitor feature adoption and user behavior
- **Error Tracking**: Monitor errors and exceptions
- **Network Health**: Monitor network data quality and consistency
- **User Feedback**: Collect and analyze user feedback
- **Business Impact**: Track business metrics and ROI

#### Maintenance Plan

- **Regular Updates**: Update network algorithms and visualizations
- **Data Quality**: Monitor and maintain network data quality
- **Performance Optimization**: Continuously optimize performance
- **Feature Enhancement**: Add new network analysis features
- **User Support**: Provide ongoing user support and training
- **Documentation Updates**: Keep documentation up to date

## 7. AI Agent Instructions

### 7.1 Mandatory AI Agent Workflows

#### Agent Coordinator Instructions

- **Coordinate Specialized Agents**: Use specific agents for network algorithms, visualization, and performance
- **Ensure Algorithm Accuracy**: Validate network algorithm implementations
- **Performance Testing**: Ensure performance standards are met
- **Integration Testing**: Verify proper integration with existing systems
- **Documentation**: Ensure comprehensive documentation

#### TypeScript Specialist Instructions

- **Type Safety**: Ensure strict TypeScript compliance for network data
- **Algorithm Types**: Define proper types for network algorithms
- **Performance Optimization**: Optimize TypeScript for performance
- **Error Handling**: Implement robust error handling
- **Testing**: Write comprehensive TypeScript tests

#### UI/UX Architect Instructions

- **Visualization Design**: Design intuitive network visualizations
- **User Experience**: Focus on user-friendly network exploration
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach for network graphs
- **Performance**: Optimize for smooth interactions

#### Security Auditor Instructions

- **Data Access**: Secure network data access patterns
- **Privacy**: Protect sensitive network information
- **Authorization**: Implement proper access controls
- **Data Validation**: Validate network data integrity
- **Compliance**: Ensure compliance with data regulations

### 7.2 Code Quality Standards

#### Network Algorithm Standards

- **Algorithm Accuracy**: Use proven, validated algorithms
- **Performance**: Optimize for large datasets
- **Scalability**: Design for growing networks
- **Documentation**: Document algorithm approaches
- **Testing**: Test algorithm accuracy and performance

#### Visualization Standards

- **Performance**: Optimize rendering performance
- **Interactivity**: Provide smooth, intuitive interactions
- **Accessibility**: Ensure screen reader compatibility
- **Responsive Design**: Support various screen sizes
- **Browser Compatibility**: Support major browsers

#### Data Standards

- **Data Integrity**: Ensure data consistency and accuracy
- **Type Safety**: Use strict TypeScript types
- **Performance**: Optimize data queries and processing
- **Validation**: Validate network data
- **Security**: Protect sensitive network information

### 7.3 Testing Requirements

#### Algorithm Testing

- **Unit Tests**: Test individual network algorithms
- **Integration Tests**: Test algorithm integration with data
- **Performance Tests**: Test algorithm performance with large datasets
- **Accuracy Tests**: Verify algorithm accuracy
- **Edge Cases**: Test edge cases and error conditions

#### Visualization Testing

- **Unit Tests**: Test visualization components
- **Integration Tests**: Test visualization with real data
- **Performance Tests**: Test rendering performance
- **Interaction Tests**: Test user interactions
- **Visual Regression**: Ensure visual consistency

#### E2E Testing

- **User Journeys**: Test complete network analysis workflows
- **Search Testing**: Test network search functionality
- **Path Finding**: Test network path finding
- **Clustering**: Test clustering algorithms
- **Analytics**: Test network analytics features

### 7.4 Documentation Requirements

#### Technical Documentation

- **Algorithm Documentation**: Document network algorithms and approaches
- **API Documentation**: Document all network-related APIs
- **Data Model Documentation**: Document network data structures
- **Performance Documentation**: Document performance characteristics
- **Architecture Documentation**: Document system architecture

#### User Documentation

- **User Guide**: Create comprehensive user guide
- **Feature Documentation**: Document network intelligence features
- **Tutorial**: Create step-by-step tutorials
- **Best Practices**: Document network analysis best practices
- **Troubleshooting**: Create troubleshooting guide

#### Developer Documentation

- **Setup Guide**: Create development setup guide
- **API Reference**: Create API reference documentation
- **Algorithms Guide**: Create algorithm implementation guide
- **Testing Guide**: Create testing guide
- **Contribution Guide**: Create contribution guidelines

## 8. Conclusion

### 8.1 Summary

This comprehensive task document outlines the implementation of Network Intelligence Visualization for the VC Portfolio OS. The solution uses a hybrid approach with multiple visualization types to provide users with powerful network analysis capabilities while maintaining usability and performance.

### 8.2 Key Deliverables

- **Interactive Network Graph**: D3.js-based force-directed network visualization
- **Relationship Matrix**: Structured view of entity relationships
- **Cluster Analysis**: Multiple clustering algorithms for pattern identification
- **Timeline Visualization**: Network evolution over time
- **Advanced Search**: Intelligent search and path finding capabilities
- **Network Analytics**: Comprehensive network metrics and insights

### 8.3 Success Criteria

- **Technical**: Fast rendering, accurate algorithms, cross-browser compatibility
- **User Experience**: Intuitive exploration, high feature adoption, positive feedback
- **Business**: Improved decision making, increased insights, enhanced collaboration
- **Maintenance**: Well-documented, maintainable, and extensible codebase

### 8.4 Next Steps

1. **Review and Approval**: Review this task document and get approval
2. **Phase 1 Implementation**: Begin with data infrastructure and basic network graph
3. **Algorithm Validation**: Validate network algorithms for accuracy
4. **Performance Testing**: Ensure performance standards are met
5. **User Testing**: Conduct comprehensive user testing
6. **Deployment and Monitoring**: Deploy to production and monitor performance

This implementation will provide a powerful network intelligence system that helps users discover hidden relationships, identify patterns, and make better investment decisions through advanced network analysis and visualization.

---

**Task Document Status**: ✅ Complete
**Version**: 1.0
**Created**: 2025-10-07
**Last Updated**: 2025-10-07
**Next Review**: 2025-10-14
