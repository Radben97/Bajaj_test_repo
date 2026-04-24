const express = require("express")
const cors = require('cors')
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const adj = {}
const parents = {}
const nodes = new Set()
const accepted_edges = []
const valid_nodes = []
const invalid_nodes = []
const duplicate_nodes = []
const seen = new Set()
const undirected = {}
const visited = new Set()
const components = []
const hierarchies = []

const dataValidator = (data) => {
    for (let dt of data) {
        const trimmedData = dt.trim();
        if (!/^[A-Z]->[A-Z]$/.test(trimmedData)) {
            invalid_nodes.push(dt)
            continue
        }
        const [parent, child] = trimmedData.split("->")
        if (parent === child) {
            invalid_nodes.push(trimmedData)
            continue
        }
        if (seen.has(trimmedData)) {
            if (!duplicate_nodes.includes(trimmedData)) {
                duplicate_nodes.push(trimmedData)
            }
            continue
        }
        seen.add(trimmedData)
        valid_nodes.push([parent,child])
    }
}

const graphBuilder = (data) => {
    

    for (let [parent, child] of data) {
        nodes.add(parent)
        nodes.add(child)

        if (parents[child]) continue;
        if (!adj[parent]) adj[parent] = []
        adj[parent].push(child)
        parents[child] = parent;
        if (!adj[child]) adj[child] = []
        accepted_edges.push([parent, child]);
    }
}

const dfs = (node,comp) => {
    visited.add(node);
    comp.push(node);

    for (let neighbor of undirected[node]) {
        if (!visited.has(neighbor)) {
            dfs(neighbor, comp);
        }
    }
}

const getHierarchies = () => {
    for (let node of nodes) {
        undirected[node] = new Set();
    }

    for (let [u, v] of accepted_edges) {
        undirected[u].add(v);
        undirected[v].add(u);
    }

    for (let node of nodes) {
        if (!visited.has(node)) {
            const comp = [];
            dfs(node, comp);
            components.push(comp);
        }
    }
}

const findRoot = (comp) => {
    const roots = comp.filter(n => !parents[n]);
    if (roots.length > 0) return roots.sort()[0];
    return comp.sort()[0];
}

const findCycles = (comp) => {
    const visited = new Set();
    const stack = new Set();

    function dfs(node) {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      for (let child of adj[node] || []) {
        if (comp.includes(child) && dfs(child)) return true;
      }

      stack.delete(node);
      return false;
    }

    return comp.some(n => dfs(n));
}

const buildTree = (root) => {
    function dfs(node) {
      const obj = {};
      for (let child of adj[node] || []) {
        obj[child] = dfs(child);
      }
      return obj;
    }

    return { [root]: dfs(root) };
  }

  function getDepth(node) {
    if (!adj[node] || adj[node].length === 0) return 1;

    let max = 0;
    for (let child of adj[node]) {
      max = Math.max(max, getDepth(child));
    }
    return 1 + max;
}

const buildHierarchies = () => {
  let total_trees = 0;
  let total_cycles = 0;

  let maxDepth = -1;
  let largest_tree_root = "";

  for (let comp of components) {
    const root = findRoot(comp);
    const has_cycle = findCycles(comp);

    if (has_cycle) {
      total_cycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });

    } else {
      total_trees++;

      const tree = buildTree(root);
      const depth = getDepth(root);

      if (
        depth > maxDepth ||
        (depth === maxDepth && root < largest_tree_root)
      ) {
        maxDepth = depth;
        largest_tree_root = root;
      }

      hierarchies.push({
        root,
        tree,
        depth
      });
    }
  }
}
app.use(express.json())
app.use(cors())

app.post("/bfhl", (req, res) => {
    const { data=[] } = req.body;
    Object.keys(adj).forEach(k => delete adj[k]);
    Object.keys(parents).forEach(k => delete parents[k]);
    Object.keys(undirected).forEach(k => delete undirected[k]);
    nodes.clear();
    valid_nodes.length = 0;
    accepted_edges.length = 0;
    invalid_nodes.length = 0;
    duplicate_nodes.length = 0;
    seen.clear();
    visited.clear();
    components.length = 0;
    hierarchies.length = 0;
    dataValidator(data);
    graphBuilder(valid_nodes);
    getHierarchies();
    buildHierarchies();

    let total_trees = 0;
    let total_cycles = 0;
    let maxDepth = -1;
    let largest_tree_root = "";

    for (let h of hierarchies) {
        if (h.has_cycle) {
            total_cycles++;
        } else {
            total_trees++;

            if (
                h.depth > maxDepth ||
                (h.depth === maxDepth && h.root < largest_tree_root)
            ) {
                maxDepth = h.depth;
                largest_tree_root = h.root;
            }
        }
    }

    res.json({
    user_id: "Maheshwaran_02092005",
    email_id: "amaheshwaran.2005@email.com",
    college_roll_number: "RA2311004010152",

    hierarchies,
    invalid_entries: invalid_nodes,
    duplicate_edges: duplicate_nodes,

    summary: {
        total_trees,
        total_cycles,
        largest_tree_root
    }
});

})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});