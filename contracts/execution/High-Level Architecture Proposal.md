                    +-----------------------------------+
                    |        Parallel Execution         |
                    |             Fabric                |
                    |                                   |
                    |  +-----------------------------+  |
                    |  |       Orchestrator          |  |<---> [ Tag Bank ]
                    |  |                             |  |
                    |  |  - Route Transactions       |  |
                    |  |  - Manage Shards            |  |
                    |  |  - Resolve Dependencies     |  |
                    |  |  - Ensure Finality          |  |
                    |  +-----------------------------+  |
                    |                                   |
+-------------+     |  +------------+  +------------+   |     +-----------------+
|             |     |  |            |  |            |   |     |                 |
|  Client /   |---->|  |  Shard A   |  |  Shard B   |...|---->|  Blockchain     |
|  DApp       |<----|  | (Executor) |  | (Executor) |   |<----|  Node (Geth,    |
|             |     |  |            |  |            |   |     |  Nethermind, etc)|
+-------------+     |  +------------+  +------------+   |     +-----------------+
                    |                                   |
                    +-----------------------------------+