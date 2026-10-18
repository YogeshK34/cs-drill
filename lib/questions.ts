import { Question, Topic } from "./types";

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // TOPIC: OS (Operating Systems) - 20 Questions
  // ==========================================
  {
    topic: "OS",
    question: "What is the primary role of the Translation Lookaside Buffer (TLB)?",
    options: [
      "Cache recently accessed virtual-to-physical address translations",
      "Store inactive page table entries in swap space",
      "Synchronize cache lines across multi-core processors",
      "Schedule user-space threads based on priority"
    ],
    correct: 0,
    explanation: "The TLB is a high-speed hardware associative cache that stores recently resolved virtual-to-physical address mappings, minimizing expensive page table walks in RAM."
  },
  {
    topic: "OS",
    question: "Which of the following is NOT one of Coffman's four necessary conditions for deadlock?",
    options: [
      "Mutual Exclusion",
      "Preemption",
      "Hold and Wait",
      "Circular Wait"
    ],
    correct: 1,
    explanation: "Coffman's conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks; 'No Preemption' is the condition required for a deadlock."
  },
  {
    topic: "OS",
    question: "What is the 'convoy effect' in CPU scheduling?",
    options: [
      "Short I/O-bound processes queuing behind a long CPU-bound process in FCFS",
      "Frequent context switches causing CPU thrashing in Round Robin",
      "Starvation of low-priority processes in preemptive priority scheduling",
      "Deadlock occurring when two processes access hardware resources simultaneously"
    ],
    correct: 0,
    explanation: "In First-Come, First-Served (FCFS) scheduling, when a CPU-intensive job hogs the CPU, shorter I/O-bound jobs queue behind it, drastically decreasing overall system throughput."
  },
  {
    topic: "OS",
    question: "Which resource is typically SHARED among all threads within the same process?",
    options: [
      "Program Counter (PC)",
      "Call Stack memory",
      "Heap memory segment",
      "CPU register set"
    ],
    correct: 2,
    explanation: "Threads of the same process share the virtual address space—including the Heap, code (text), and global data segments—while maintaining independent stacks, registers, and program counters."
  },
  {
    topic: "OS",
    question: "What is the fundamental difference between a binary semaphore and a mutex?",
    options: [
      "A mutex enforces ownership (only the acquiring thread can unlock), whereas a semaphore can be signaled by any thread",
      "A binary semaphore can take values greater than 1",
      "Mutexes are only used in user-space, while semaphores are kernel-only",
      "Semaphores prevent race conditions, but mutexes do not"
    ],
    correct: 0,
    explanation: "A mutex has the concept of ownership: only the thread that locked the mutex is allowed to release it. A semaphore is an integer signaling mechanism with no ownership restriction."
  },
  {
    topic: "OS",
    question: "What is Belady's Anomaly?",
    options: [
      "Increasing the number of page frames leads to more page faults in FIFO replacement",
      "LRU producing higher miss rates than FIFO for cyclic access patterns",
      "Thrashing occurring even when physical RAM is 90% free",
      "A context switch taking longer than the current process time slice"
    ],
    correct: 0,
    explanation: "Belady's Anomaly is the counterintuitive phenomenon where adding more physical page frames increases the total number of page faults, commonly seen in FIFO page replacement."
  },
  {
    topic: "OS",
    question: "What CPU transition occurs when a user application invokes a system call?",
    options: [
      "From User Mode (Ring 3) to Kernel Mode (Ring 0) via a software trap / interrupt",
      "From Kernel Mode to Hypervisor Mode via an I/O bus interrupt",
      "From Blocked state directly to Running state",
      "From Heap memory execution to Stack segment execution"
    ],
    correct: 0,
    explanation: "System calls invoke a trap or software interrupt instruction (e.g. syscall/sysenter), which switches the CPU execution ring from unprivileged User Mode to privileged Kernel Mode."
  },
  {
    topic: "OS",
    question: "What primary condition causes 'thrashing' in an operating system?",
    options: [
      "The working set size exceeds physical RAM, causing the OS to spend more time paging than executing instructions",
      "Thermal throttling when CPU temperature exceeds safe thresholds",
      "Two processes competing for the same socket port binding",
      "Unsynchronized threads rapidly writing to the same cache line"
    ],
    correct: 0,
    explanation: "Thrashing occurs when total memory demand of active processes exceeds physical memory, forcing continuous page faults and disk swapping, collapsing CPU utilization toward zero."
  },
  {
    topic: "OS",
    question: "How does the Banker's Algorithm handle deadlock?",
    options: [
      "Deadlock Avoidance: dynamically checks if resource allocation maintains a safe execution state",
      "Deadlock Detection: runs periodic cycle detection on the resource graph and terminates processes",
      "Deadlock Prevention: disallows hold-and-wait by requiring all resources upfront",
      "Deadlock Ignorance: ignores the deadlock problem until memory runs out"
    ],
    correct: 0,
    explanation: "Dijkstra's Banker's Algorithm is an avoidance strategy that simulates resource allocation to verify that at least one safe execution sequence exists before granting any request."
  },
  {
    topic: "OS",
    question: "Which Inter-Process Communication (IPC) mechanism offers the highest throughput on the same host?",
    options: [
      "Shared Memory",
      "Unix Domain Sockets",
      "Named Pipes (FIFO)",
      "POSIX Message Queues"
    ],
    correct: 0,
    explanation: "Shared Memory maps common physical memory pages into each process's address space, allowing zero-copy communication at raw memory bus bandwidth without kernel intervention."
  },
  {
    topic: "OS",
    question: "What distinguishes internal fragmentation from external fragmentation?",
    options: [
      "Internal is wasted space inside an allocated block; external is scattered free memory between blocks",
      "Internal occurs in swap storage; external occurs in CPU L1/L2 cache",
      "Internal occurs across different processes; external occurs inside one thread",
      "Internal is caused by dynamic memory allocation; external is caused by static compilation"
    ],
    correct: 0,
    explanation: "Internal fragmentation occurs when allocated blocks are larger than the requested size (e.g., fixed page sizes). External fragmentation occurs when total free space exists but is fragmented into small disjoint chunks."
  },
  {
    topic: "OS",
    question: "In the 5-state process lifecycle, which transition is NOT permitted?",
    options: [
      "Blocked / Waiting directly to Running",
      "Running to Ready",
      "Ready to Running",
      "Running to Blocked / Waiting"
    ],
    correct: 0,
    explanation: "A blocked process that finishes I/O must transition into the 'Ready' queue first. The CPU scheduler only picks processes from the Ready state to transition into the Running state."
  },
  {
    topic: "OS",
    question: "Which CPU scheduling algorithm is provably optimal for minimizing average waiting time?",
    options: [
      "Shortest Job First (SJF)",
      "First-Come, First-Served (FCFS)",
      "Round Robin (RR)",
      "Priority Scheduling with Aging"
    ],
    correct: 0,
    explanation: "Shortest Job First (SJF) is mathematically optimal for minimizing average waiting time because moving shorter jobs earlier reduces the cumulative wait time for all subsequent processes."
  },
  {
    topic: "OS",
    question: "What does `fork()` return to the parent process upon successful process creation in Unix?",
    options: [
      "The Process ID (PID) of the newly created child process",
      "0",
      "-1",
      "The parent process's own PID"
    ],
    correct: 0,
    explanation: "Upon success, `fork()` returns the child's positive PID to the parent process, and returns 0 to the newly spawned child process."
  },
  {
    topic: "OS",
    question: "Which hardware instruction is standardly used to implement atomic locks without disabling CPU interrupts?",
    options: [
      "Compare-and-Swap (CAS) / Test-and-Set",
      "JMP (Jump)",
      "NOP (No Operation)",
      "HLT (Halt CPU)"
    ],
    correct: 0,
    explanation: "Compare-and-Swap (CAS) and Test-and-Set execute read-modify-write cycles in a single indivisible bus cycle, providing the building block for spinlocks, mutexes, and lock-free structures."
  },
  {
    topic: "OS",
    question: "What is the primary benefit of Direct Memory Access (DMA)?",
    options: [
      "Allows I/O controllers to transfer data directly to/from RAM without CPU polling",
      "Doubles the bandwidth of the L1 instruction cache",
      "Prevents segmentation faults in user processes",
      "Removes the need for physical device drivers"
    ],
    correct: 0,
    explanation: "DMA offloads bulk data transfers between peripheral hardware (disks, network cards) and main memory from the CPU, generating a single interrupt when the entire transfer finishes."
  },
  {
    topic: "OS",
    question: "In standard Unix filesystems, which information is NOT stored in an inode?",
    options: [
      "The file name",
      "File size in bytes",
      "Access and modification timestamps",
      "Pointers to data blocks"
    ],
    correct: 0,
    explanation: "In Unix, directory entries (dentries) map file names to inode numbers. Inodes store metadata (permissions, ownership, size, block pointers) but not the file name itself."
  },
  {
    topic: "OS",
    question: "What does the Copy-on-Write (CoW) technique achieve during a `fork()` call?",
    options: [
      "Parent and child share read-only memory pages; a private page duplicate is created only when modified",
      "Immediately duplicates all physical pages before `fork()` returns",
      "Compresses dirty pages into swap storage asynchronously",
      "Writes page contents to disk before allowing memory modifications"
    ],
    correct: 0,
    explanation: "Copy-on-Write optimizes `fork()` by having the parent and child initially share the same physical pages marked read-only. A page fault duplicates a page only when either process attempts a write."
  },
  {
    topic: "OS",
    question: "What is a 'zombie' process in Unix?",
    options: [
      "A terminated process whose exit status has not yet been read by its parent via `wait()`",
      "A process running in an infinite loop consuming 100% CPU",
      "A process whose parent has died and been adopted by systemd/init",
      "A process swapped out to disk due to low physical memory"
    ],
    correct: 0,
    explanation: "A zombie process has finished execution but remains in the OS process table with its exit code until its parent calls `wait()` or `waitpid()` to reap it."
  },
  {
    topic: "OS",
    question: "What is the function of the OS scheduler's 'Aging' technique?",
    options: [
      "Gradually increases the priority of waiting processes to prevent starvation",
      "Deallocates idle memory pages to prevent memory leaks",
      "Lowers CPU voltage as hardware components age",
      "Terminates long-running background tasks automatically"
    ],
    correct: 0,
    explanation: "Aging prevents indefinite starvation in priority scheduling by gradually elevating the priority of processes that have been waiting in the ready queue for an extended duration."
  },

  // ==========================================
  // TOPIC: Networks - 20 Questions
  // ==========================================
  {
    topic: "Networks",
    question: "How many packets are exchanged in a standard TCP connection establishment handshake?",
    options: [
      "3 packets (SYN, SYN-ACK, ACK)",
      "4 packets (SYN, ACK, SYN, ACK)",
      "2 packets (SYN, ACK)",
      "1 packet (CONNECT)"
    ],
    correct: 0,
    explanation: "TCP uses a three-way handshake: Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK, synchronizing sequence numbers on both ends."
  },
  {
    topic: "Networks",
    question: "Which layer of the 7-layer OSI model provides end-to-end reliability, segmentation, and flow control?",
    options: [
      "Transport Layer (Layer 4)",
      "Network Layer (Layer 3)",
      "Data Link Layer (Layer 2)",
      "Session Layer (Layer 5)"
    ],
    correct: 0,
    explanation: "The Transport Layer (Layer 4, e.g. TCP) is responsible for host-to-host communication, segmenting data streams, managing flow control, and ensuring reliable error recovery."
  },
  {
    topic: "Networks",
    question: "What DNS record type maps a domain name directly to an IPv4 address?",
    options: [
      "A record",
      "AAAA record",
      "CNAME record",
      "MX record"
    ],
    correct: 0,
    explanation: "'A' records map hostnames to 32-bit IPv4 addresses, while 'AAAA' records map hostnames to 128-bit IPv6 addresses."
  },
  {
    topic: "Networks",
    question: "Which feature is guaranteed by TCP but NOT by UDP?",
    options: [
      "In-order delivery and congestion control",
      "Checksum verification of payload integrity",
      "Port-based endpoint multiplexing",
      "Low-latency datagram transmission"
    ],
    correct: 0,
    explanation: "TCP provides connection-oriented, guaranteed in-order stream delivery with congestion/flow control, whereas UDP is connectionless and does not guarantee packet delivery order."
  },
  {
    topic: "Networks",
    question: "In an IPv4 `/26` subnet, how many usable host IP addresses are available?",
    options: [
      "62",
      "64",
      "126",
      "30"
    ],
    correct: 0,
    explanation: "A `/26` subnet leaves 32 - 26 = 6 bits for hosts. 2^6 = 64 total addresses. Excluding the network address (.0) and broadcast address (.63) leaves 62 usable host addresses."
  },
  {
    topic: "Networks",
    question: "What primary architectural problem does HTTP/2 solve over HTTP/1.1?",
    options: [
      "Head-of-Line (HoL) blocking at the application layer via binary stream multiplexing",
      "Eliminating the need for TLS encryption",
      "Replacing TCP with UDP at the transport layer",
      "Enforcing JSON as the only valid response format"
    ],
    correct: 0,
    explanation: "HTTP/2 introduces binary framing and stream multiplexing, enabling concurrent bidirectional requests and responses over a single TCP connection, overcoming application-layer HoL blocking."
  },
  {
    topic: "Networks",
    question: "What is the primary function of the Address Resolution Protocol (ARP)?",
    options: [
      "Map a known IPv4 address to a physical MAC address on a local network segment",
      "Resolve human-readable domain names to public IP addresses",
      "Assign dynamic IP configurations to newly booted network clients",
      "Route packets across autonomous systems via BGP"
    ],
    correct: 0,
    explanation: "ARP operates at Layer 2/3 to translate a target IPv4 address into its corresponding hardware Media Access Control (MAC) address within the local broadcast domain."
  },
  {
    topic: "Networks",
    question: "What does Network Address Translation (NAT) accomplish?",
    options: [
      "Maps multiple private internal IP addresses to a single public IP address",
      "Encrypts IP packet headers using asymmetric RSA cryptography",
      "Translates IPv4 subnet masks into Classful network prefixes",
      "Converts DNS queries from UDP to TCP automatically"
    ],
    correct: 0,
    explanation: "NAT (specifically NAPT / Port Address Translation) maps private RFC 1918 addresses to a shared public IP address using distinct port numbers, conserving IPv4 space."
  },
  {
    topic: "Networks",
    question: "Which routing protocol is the standard Exterior Gateway Protocol (EGP) used between Autonomous Systems (AS)?",
    options: [
      "BGP (Border Gateway Protocol)",
      "OSPF (Open Shortest Path First)",
      "RIP (Routing Information Protocol)",
      "IS-IS"
    ],
    correct: 0,
    explanation: "BGP is the path-vector exterior routing protocol that glues the global Internet together, managing routing tables between different Autonomous Systems based on peering policies."
  },
  {
    topic: "Networks",
    question: "What occurs if an IPv4 packet exceeds an intermediate link's MTU and the DF (Don't Fragment) flag is set?",
    options: [
      "The router drops the packet and responds with an ICMP 'Fragmentation Needed' message",
      "The router ignores the DF flag and fragments the packet into fragments",
      "The router queues the packet in buffer memory until the link clears",
      "The router switches the packet transmission from IP to UDP"
    ],
    correct: 0,
    explanation: "If DF=1 and packet size > MTU, the router discards the packet and sends an ICMP Type 3 Code 4 (Fragmentation Needed) error to the sender, which is the basis of Path MTU Discovery (PMTUD)."
  },
  {
    topic: "Networks",
    question: "Why does the active closing endpoint of a TCP connection enter the `TIME_WAIT` state?",
    options: [
      "To ensure the remote peer received the final ACK and to drain lingering duplicate packets from the network",
      "To wait for new incoming client SYN connection requests",
      "To negotiate cryptographic ciphers for the next session",
      "To flush dirty write blocks to secondary persistent storage"
    ],
    correct: 0,
    explanation: "The `TIME_WAIT` state (typically lasting 2 MSL = 60-120s) guarantees the peer received the final ACK (retransmitting ACK if FIN is resent) and prevents old delayed segments from corrupting a new socket on the same port."
  },
  {
    topic: "Networks",
    question: "How does TCP Flow Control differ fundamentally from TCP Congestion Control?",
    options: [
      "Flow control protects the receiver from being overwhelmed; congestion control protects the network routers",
      "Flow control works with packet checksums; congestion control works with sequence numbers",
      "Flow control operates at Layer 3; congestion control operates at Layer 7",
      "Flow control is only used in UDP; congestion control is only used in TCP"
    ],
    correct: 0,
    explanation: "Flow control uses the advertised receive window (rwnd) to prevent the sender from exhausting the receiver's buffer. Congestion control uses the congestion window (cwnd) to prevent congesting intermediate network paths."
  },
  {
    topic: "Networks",
    question: "What are the four phases of the DHCP IP configuration process?",
    options: [
      "Discover, Offer, Request, Acknowledge (DORA)",
      "Detect, Open, Route, Allocate",
      "Dial, Authenticate, Connect, Listen",
      "Probe, Announce, Register, Confirm"
    ],
    correct: 0,
    explanation: "DHCP follows DORA: Client broadcasts DHCPDISCOVER, DHCP servers respond with DHCPOFFER, Client broadcasts DHCPREQUEST for chosen offer, Server replies with DHCPACK."
  },
  {
    topic: "Networks",
    question: "What does the HTTP 429 status code represent?",
    options: [
      "Too Many Requests (Rate limiting active)",
      "Unavailable For Legal Reasons",
      "Request Header Fields Too Large",
      "Client Closed Request Prematurely"
    ],
    correct: 0,
    explanation: "HTTP 429 indicates that the client has submitted too many requests within a given timeframe, commonly returned by API rate limiters."
  },
  {
    topic: "Networks",
    question: "Which transport protocol does HTTP/3 operate on top of?",
    options: [
      "QUIC over UDP",
      "Standard TCP with TLS 1.3",
      "SCTP over IP",
      "Raw Ethernet frames"
    ],
    correct: 0,
    explanation: "HTTP/3 runs on QUIC, an encrypted multiplexed transport protocol implemented in user space on top of UDP, eliminating TCP-level head-of-line blocking."
  },
  {
    topic: "Networks",
    question: "Which ICMP message enables the operation of the `traceroute` utility?",
    options: [
      "Time Exceeded (TTL expired in transit)",
      "Echo Reply",
      "Destination Port Unreachable",
      "Redirect Message"
    ],
    correct: 0,
    explanation: "`traceroute` sends packets with ascending TTL values (1, 2, 3...). Each hop router decrements TTL to 0, drops the packet, and returns an ICMP Time-to-Live Exceeded message, revealing router hops."
  },
  {
    topic: "Networks",
    question: "What is IP Anycast routing?",
    options: [
      "Assigning the same IP to multiple global servers and routing users to the closest node via BGP",
      "Broadcasting data packets to every connected device on a local VLAN",
      "Using multicast groups to stream video over satellite links",
      "Tunneling IPv4 packets through an encrypted IPv6 VPN mesh"
    ],
    correct: 0,
    explanation: "In Anycast, multiple distributed servers announce the identical IP address via BGP. Routers direct client requests to the topologically nearest instance, widely used by root DNS servers and CDNs."
  },
  {
    topic: "Networks",
    question: "What IEEE standard specifies Virtual Local Area Network (VLAN) tagging on Ethernet frames?",
    options: [
      "IEEE 802.1Q",
      "IEEE 802.11ac",
      "IEEE 802.3",
      "IEEE 802.1X"
    ],
    correct: 0,
    explanation: "IEEE 802.1Q defines a 4-byte VLAN tag inserted into standard Ethernet frames, allowing traffic from up to 4,094 distinct VLANs to traverse a single trunk link."
  },
  {
    topic: "Networks",
    question: "What is the role of TLS Server Name Indication (SNI)?",
    options: [
      "Allows the client to specify which hostname it is contacting during the TLS handshake for multi-tenant servers",
      "Generates a unique MAC address for virtual network cards",
      "Translates domain names to IP addresses without recursive queries",
      "Compresses HTTP request headers across TLS sessions"
    ],
    correct: 0,
    explanation: "SNI is a TLS extension where the client indicates the desired hostname in the Client Hello message, allowing a single IP address to host multiple distinct HTTPS certificates."
  },
  {
    topic: "Networks",
    question: "What is the primary role of a Content Delivery Network (CDN) edge server?",
    options: [
      "Cache and serve content geographically proximate to users to reduce latency and origin server load",
      "Execute database transactions with ACID guarantees",
      "Assign IP addresses to client modems via DHCP",
      "Replace local router firewalls with hardware inspection"
    ],
    correct: 0,
    explanation: "CDN edge points of presence (PoPs) cache static assets and accelerate dynamic responses close to end users, minimizing Round Trip Time (RTT) and offloading origin servers."
  },

  // ==========================================
  // TOPIC: DBMS (Database Management Systems) - 20 Questions
  // ==========================================
  {
    topic: "DBMS",
    question: "What does the 'Durability' guarantee in ACID properties signify?",
    options: [
      "Committed transactions persist in non-volatile storage even across unexpected system crashes",
      "All concurrent transactions execute in complete isolation without interference",
      "A transaction completes completely or leaves state unchanged",
      "Integrity constraints and foreign keys are never violated"
    ],
    correct: 0,
    explanation: "Durability guarantees that once a transaction commits, its modifications are permanently recorded to disk (typically via Write-Ahead Logging) and will not be lost during a crash."
  },
  {
    topic: "DBMS",
    question: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and:",
    options: [
      "No non-prime attribute is partially dependent on any candidate key",
      "Every determinant is a superkey",
      "There are no transitive dependencies between non-prime attributes",
      "Every cell contains a single scalar value"
    ],
    correct: 0,
    explanation: "2NF requires that all non-prime attributes are fully functionally dependent on the entire primary key, eliminating partial dependencies on composite candidate keys."
  },
  {
    topic: "DBMS",
    question: "Why do relational database engines standardly use B+ Trees over B-Trees for disk indices?",
    options: [
      "All data pointers reside in sequentially linked leaf nodes, making range scans much faster",
      "B+ Trees consume significantly less disk memory for key storage",
      "B+ Trees do not require rebalancing rotations during insertions",
      "B+ Trees have a shallower fan-out factor than B-Trees"
    ],
    correct: 0,
    explanation: "In B+ Trees, internal nodes only store search keys, allowing high branch fan-out. All values are stored at the leaf level, which are linked as a doubly linked list, optimizing range queries."
  },
  {
    topic: "DBMS",
    question: "Which concurrency anomaly is prevented by 'Repeatable Read' isolation that 'Read Committed' permits?",
    options: [
      "Non-repeatable Read (fuzzy read)",
      "Dirty Read",
      "Write Skew",
      "Deadlock condition"
    ],
    correct: 0,
    explanation: "A Non-repeatable Read occurs when a transaction rereads a row and finds altered data because another transaction committed an update. Repeatable Read guarantees reading identical row values."
  },
  {
    topic: "DBMS",
    question: "What is the core rule of the Write-Ahead Logging (WAL) protocol?",
    options: [
      "Log records describing changes must be flushed to disk before dirty data pages are written to disk",
      "Database queries must write an audit entry before returning results to clients",
      "Data pages are written to disk every 10 milliseconds regardless of logs",
      "Logs are written in RAM and purged immediately upon commit"
    ],
    correct: 0,
    explanation: "WAL ensures atomicity and durability by mandating that transaction log records are forced to persistent non-volatile storage before corresponding dirty database pages are flushed from RAM."
  },
  {
    topic: "DBMS",
    question: "Which SQL JOIN returns all rows from the left table and matched rows from the right table, populating NULLs for non-matches?",
    options: [
      "LEFT OUTER JOIN",
      "INNER JOIN",
      "CROSS JOIN",
      "FULL OUTER JOIN"
    ],
    correct: 0,
    explanation: "A LEFT OUTER JOIN preserves all records from the left relation, matching rows from the right relation where predicates evaluate to true, and supplying NULL values when matches do not exist."
  },
  {
    topic: "DBMS",
    question: "What defines the Two-Phase Locking (2PL) concurrency control protocol?",
    options: [
      "A transaction acquires locks in an expanding phase and cannot acquire new locks once it begins releasing them",
      "Transactions acquire locks for two seconds before releasing them automatically",
      "Locks are acquired on primary keys in phase 1, and foreign keys in phase 2",
      "Read locks are granted by the master replica and write locks by slave replicas"
    ],
    correct: 0,
    explanation: "2PL guarantees conflict serializability by dividing locking into a Growing Phase (locks may be acquired, none released) and a Shrinking Phase (locks released, none acquired)."
  },
  {
    topic: "DBMS",
    question: "What is the key functional difference between `WHERE` and `HAVING` in SQL?",
    options: [
      "`WHERE` filters individual rows before aggregation; `HAVING` filters grouped rows after aggregation",
      "`WHERE` is used with aggregate functions; `HAVING` cannot use aggregate functions",
      "`WHERE` requires `ORDER BY`; `HAVING` requires `JOIN`",
      "There is no difference; they are aliases"
    ],
    correct: 0,
    explanation: "`WHERE` filters source rows before grouping and aggregate calculations. `HAVING` filters the results of aggregate calculations produced by `GROUP BY`."
  },
  {
    topic: "DBMS",
    question: "How does Multi-Version Concurrency Control (MVCC) maximize database read/write concurrency?",
    options: [
      "Readers do not block writers and writers do not block readers by maintaining versioned row snapshots",
      "It executes all transactions sequentially on an ultra-fast in-memory CPU queue",
      "It converts relational tables into key-value documents",
      "It locks entire tables during any write operation to ensure consistency"
    ],
    correct: 0,
    explanation: "MVCC provides each transaction with a consistent historical view/snapshot of the data as of its start timestamp, eliminating read locks and preventing reads and writes from blocking each other."
  },
  {
    topic: "DBMS",
    question: "What is horizontal database sharding?",
    options: [
      "Partitioning table rows across multiple autonomous database servers based on a shard key",
      "Normalizing wide tables by splitting columns across multiple tables",
      "Creating read replicas that asynchronously copy data from a primary instance",
      "Compressing table partitions using column-oriented storage formats"
    ],
    correct: 0,
    explanation: "Sharding partitions data horizontally by distributing subsets of rows across independent physical nodes based on a partition/shard key, enabling horizontal scaling."
  },
  {
    topic: "DBMS",
    question: "What is the strict requirement for Boyce-Codd Normal Form (BCNF)?",
    options: [
      "For every non-trivial functional dependency X -> Y, X must be a superkey",
      "Every relation must possess a composite surrogate key",
      "There must be no multi-valued dependencies across tables",
      "All foreign key constraints must point to clustered primary indexes"
    ],
    correct: 0,
    explanation: "BCNF is a stricter form of 3NF. It requires that for every functional dependency X -> Y, determinant X must strictly be a superkey of the relation."
  },
  {
    topic: "DBMS",
    question: "What defines a clustered index in a relational database?",
    options: [
      "An index that defines the physical storage order of table rows on disk (only one per table)",
      "An index that clusters multiple foreign key constraints together",
      "An index stored entirely in RAM memory for fast caching",
      "A non-unique index created automatically on boolean columns"
    ],
    correct: 0,
    explanation: "A clustered index dictates the actual physical sorting and storage order of rows on disk. Since data can only be physically sorted one way, a table can possess at most one clustered index."
  },
  {
    topic: "DBMS",
    question: "According to the CAP Theorem, when a network partition (P) occurs, a distributed system must choose between:",
    options: [
      "Consistency (C) and Availability (A)",
      "Concurrency (C) and Atomicity (A)",
      "Capacity (C) and Authorization (A)",
      "Compression (C) and Accuracy (A)"
    ],
    correct: 0,
    explanation: "Under the CAP theorem, during network partitions where nodes cannot communicate, a distributed system must choose between remaining available with potentially stale data (AP) or ensuring strict consistency by failing unconfirmed requests (CP)."
  },
  {
    topic: "DBMS",
    question: "What is the most robust mitigation against SQL Injection attacks?",
    options: [
      "Parameterized queries and prepared statements",
      "Client-side regular expression input validation",
      "Escaping special characters in web frontend input fields",
      "Disabling database foreign key checks"
    ],
    correct: 0,
    explanation: "Parameterized queries separate SQL instructions from user parameters, transmitting data out-of-band so malicious user input can never be parsed as executable SQL code."
  },
  {
    topic: "DBMS",
    question: "How do relational databases detect and resolve transaction deadlocks?",
    options: [
      "By constructing a Wait-For Graph (WFG) to detect cycles and aborting a chosen victim transaction",
      "By disabling concurrent read transactions during peak load",
      "By restarting the entire database server whenever a lock wait occurs",
      "By converting all transactions to serial execution mode"
    ],
    correct: 0,
    explanation: "DBMS engines build directed Wait-For Graphs of waiting transactions. Cycle detection algorithms identify circular dependencies, and the engine aborts and rolls back a designated victim transaction."
  },
  {
    topic: "DBMS",
    question: "What is the deliberate goal of database denormalization?",
    options: [
      "Improve read query performance by avoiding expensive table JOIN operations",
      "Eliminate data redundancy to save storage space",
      "Ensure mathematical purity and eliminate update anomalies",
      "Enforce cascading foreign key deletions automatically"
    ],
    correct: 0,
    explanation: "Denormalization intentionally introduces controlled data redundancy into a normalized schema to accelerate read performance and reduce computational JOIN overhead in analytical/read-heavy systems."
  },
  {
    topic: "DBMS",
    question: "What is a 'phantom read' anomaly in database transactions?",
    options: [
      "A transaction re-executes a query with a range condition and finds newly inserted/deleted rows committed by another transaction",
      "A transaction reads uncommitted changes that are later rolled back",
      "A transaction reads updated values from an already deleted primary key",
      "A transaction reads corrupted data blocks following a disk power loss"
    ],
    correct: 0,
    explanation: "A phantom read occurs when a transaction queries a set of rows satisfying a search predicate, and a concurrent transaction inserts or deletes rows matching that predicate, changing the set count on a subsequent read."
  },
  {
    topic: "DBMS",
    question: "In MySQL's InnoDB storage engine, what does the leaf node of a secondary (non-clustered) index contain?",
    options: [
      "The indexed column value and the corresponding row's primary key",
      "The full row data payload with all columns",
      "A direct physical disk offset pointer (RID)",
      "A hash code of the row's table partition"
    ],
    correct: 0,
    explanation: "In InnoDB, leaf nodes of secondary indexes store the indexed column key alongside the row's primary key. Lookups locate the primary key in the secondary index, then perform a clustered index seek."
  },
  {
    topic: "DBMS",
    question: "What is a materialized view?",
    options: [
      "A database query result physically persisted on disk and refreshed on schedule or trigger",
      "A virtual view created dynamically in memory on each query invocation",
      "A temporary table scoped strictly to a single stored procedure",
      "A frontend React UI component that binds directly to database sockets"
    ],
    correct: 0,
    explanation: "Unlike a standard virtual view which runs its underlying query on demand, a materialized view computes and physically stores the query result on disk, offering rapid retrieval for complex aggregates."
  },
  {
    topic: "DBMS",
    question: "What is the lowest standard SQL isolation level that prevents 'Dirty Reads'?",
    options: [
      "Read Committed",
      "Read Uncommitted",
      "Repeatable Read",
      "Serializable"
    ],
    correct: 0,
    explanation: "Read Committed guarantees that a transaction reads only data that has been successfully committed, preventing dirty reads of uncommitted in-flight modifications."
  },

  // ==========================================
  // TOPIC: OOP (Object-Oriented Programming) - 20 Questions
  // ==========================================
  {
    topic: "OOP",
    question: "Which core OOP principle allows derived objects to be treated as instances of their base type with method dispatch resolved dynamically at runtime?",
    options: [
      "Polymorphism",
      "Encapsulation",
      "Abstraction",
      "Composition"
    ],
    correct: 0,
    explanation: "Polymorphism (specifically subtype polymorphism) allows objects of different classes to respond to the same interface, resolving the specific implementation dynamically via virtual method dispatch."
  },
  {
    topic: "OOP",
    question: "What is the requirement of the Liskov Substitution Principle (LSP) in SOLID?",
    options: [
      "Subtypes must be substitutable for their base types without altering program correctness or contracts",
      "Every class must have only a single, well-defined reason to change",
      "High-level business policies should not depend on low-level database details",
      "Classes should be open for extension but closed for modification"
    ],
    correct: 0,
    explanation: "LSP requires that child classes behave in a way that respects all preconditions, postconditions, and invariants guaranteed by the parent class, allowing transparent substitution without unexpected errors."
  },
  {
    topic: "OOP",
    question: "Which creational design pattern restricts class instantiation to a single object and provides a global access point?",
    options: [
      "Singleton Pattern",
      "Factory Method Pattern",
      "Builder Pattern",
      "Prototype Pattern"
    ],
    correct: 0,
    explanation: "The Singleton pattern ensures a class has only one instance and provides a static accessor method to access that instance globally throughout the application."
  },
  {
    topic: "OOP",
    question: "What is the primary architectural purpose of Encapsulation?",
    options: [
      "Restricting direct external access to internal state and coupling behavior with data",
      "Allowing derived classes to inherit internal implementation details",
      "Maximizing the number of public getters and setters in domain models",
      "Enabling classes to compile into static functional libraries"
    ],
    correct: 0,
    explanation: "Encapsulation bundles data and the methods operating on that data within a boundary, hiding internal representation and protecting invariants by enforcing controlled access points."
  },
  {
    topic: "OOP",
    question: "What does the Open/Closed Principle (OCP) mandate?",
    options: [
      "Software entities should be open for extension, but closed for modification",
      "Public methods should be open to all packages, but private fields closed to subclasses",
      "File descriptors must be opened explicitly and closed in `finally` blocks",
      "APIs should be open source and closed to proprietary license agreements"
    ],
    correct: 0,
    explanation: "OCP dictates that system components should be designed so that new capabilities can be added (via inheritance, interfaces, or strategy patterns) without modifying existing, tested source code."
  },
  {
    topic: "OOP",
    question: "Which structural design pattern attaches additional responsibilities to an object dynamically by wrapping it?",
    options: [
      "Decorator Pattern",
      "Facade Pattern",
      "Adapter Pattern",
      "Composite Pattern"
    ],
    correct: 0,
    explanation: "The Decorator pattern dynamically wraps an object with classes that share the same interface, augmenting its behavior at runtime without subverting class hierarchies."
  },
  {
    topic: "OOP",
    question: "Why does modern software engineering favor object composition over class inheritance?",
    options: [
      "Composition yields loose coupling, runtime flexibility, and avoids fragile base class issues",
      "Composition consumes significantly less memory than class inheritance",
      "Inheritance does not allow code reuse across multiple projects",
      "Modern programming languages do not support class inheritance"
    ],
    correct: 0,
    explanation: "Inheritance exposes internal implementation details (white-box reuse) and creates rigid compile-time coupling. Composition enables black-box reuse and allows dynamically interchanging components at runtime."
  },
  {
    topic: "OOP",
    question: "What is the key difference between Method Overloading and Method Overriding?",
    options: [
      "Overloading is compile-time polymorphism with different signatures; Overriding is runtime polymorphism replacing superclass behavior",
      "Overloading requires base class inheritance; Overriding occurs within the same class",
      "Overloading modifies return types only; Overriding modifies parameter counts",
      "Overloading is dynamic dispatch; Overriding is static dispatch"
    ],
    correct: 0,
    explanation: "Overloading defines methods with identical names but different parameter lists within the same class (resolved at compile time). Overriding redefines a base class method with identical signature in a subclass (resolved at runtime)."
  },
  {
    topic: "OOP",
    question: "Which behavioral pattern establishes a publish-subscribe relationship so that when one object updates, dependents are notified automatically?",
    options: [
      "Observer Pattern",
      "Command Pattern",
      "Strategy Pattern",
      "Mediator Pattern"
    ],
    correct: 0,
    explanation: "The Observer pattern establishes a one-to-many relationship where changes in the subject state automatically trigger updates across all registered observer objects."
  },
  {
    topic: "OOP",
    question: "What does the Dependency Inversion Principle (DIP) state?",
    options: [
      "High-level modules should not depend on low-level modules; both should depend on abstractions",
      "Subclasses should invert the methods inherited from superclasses",
      "Classes should instantiate their own concrete dependencies internally",
      "Objects must be serialized in inverted order to disk"
    ],
    correct: 0,
    explanation: "DIP states that high-level business policies and low-level details should both depend on abstractions (interfaces), decoupling business rules from technical implementation details."
  },
  {
    topic: "OOP",
    question: "Which design pattern acts as an intermediary translating an existing class's incompatible interface into an interface expected by clients?",
    options: [
      "Adapter Pattern",
      "Bridge Pattern",
      "Proxy Pattern",
      "Flyweight Pattern"
    ],
    correct: 0,
    explanation: "The Adapter pattern wraps an incompatible legacy or third-party service, converting its interface into one matching client expectations without modifying original source code."
  },
  {
    topic: "OOP",
    question: "How do object-oriented runtimes (like C++ or JVM) implement dynamic virtual method dispatch?",
    options: [
      "Using a Virtual Method Table (vtable) and an internal virtual pointer (vptr) per object instance",
      "Using runtime string reflection to look up method names on each call",
      "Inlining all virtual methods at compile time into switch statements",
      "Converting class instances into functional closures stored on the stack"
    ],
    correct: 0,
    explanation: "Classes containing virtual methods generate a static vtable of function pointers. Each object holds an internal `vptr` pointing to its class vtable, enabling O(1) indirect pointer dereference for method dispatch."
  },
  {
    topic: "OOP",
    question: "What is the primary structural difference between an abstract class and an interface?",
    options: [
      "A class can implement multiple interfaces but inherit from only one abstract class, and abstract classes can maintain internal instance state",
      "Interfaces can maintain instance fields; abstract classes cannot",
      "Abstract classes can be instantiated directly with `new`; interfaces cannot",
      "Interfaces cannot define method signatures"
    ],
    correct: 0,
    explanation: "In most OO languages, classes support multiple interface implementation but single class inheritance. Abstract classes can encapsulate instance variables and constructors, while interfaces declare behavioral contracts."
  },
  {
    topic: "OOP",
    question: "What is the 'Diamond Problem' in object-oriented programming with multiple inheritance?",
    options: [
      "Ambiguity occurring when a class inherits from two parent classes that share a common ancestor with conflicting method implementations",
      "Memory leak caused by circular object references across four classes",
      "A performance bottleneck when navigating deep class inheritance trees",
      "Failure of an interface to declare abstract getter methods"
    ],
    correct: 0,
    explanation: "If class D inherits from classes B and C, which both inherit from class A, D receives duplicate copies or ambiguous implementations of methods originating in A, known as the Diamond Problem."
  },
  {
    topic: "OOP",
    question: "Which design pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime?",
    options: [
      "Strategy Pattern",
      "Template Method Pattern",
      "State Pattern",
      "Iterator Pattern"
    ],
    correct: 0,
    explanation: "The Strategy pattern decouples algorithms from the client that uses them, packaging each variation into a separate class that implements a shared interface, allowing swapping at runtime."
  },
  {
    topic: "OOP",
    question: "What does the Interface Segregation Principle (ISP) encourage?",
    options: [
      "Clients should not be forced to depend on methods they do not use (prefer specific, cohesive interfaces)",
      "All interfaces must inherit from a single root interface",
      "Classes should implement at most one interface each",
      "Interfaces must never be extended by other interfaces"
    ],
    correct: 0,
    explanation: "ISP emphasizes designing small, focused, client-specific interfaces rather than broad, fat interfaces that force implementers to write dummy or empty methods for operations they do not support."
  },
  {
    topic: "OOP",
    question: "What is the difference between a shallow copy and a deep copy of an object?",
    options: [
      "Shallow copy copies reference pointers to nested objects; deep copy recursively duplicates all nested objects",
      "Shallow copy copies private fields; deep copy copies public fields",
      "Shallow copy is stored on the stack; deep copy is stored on the heap",
      "Shallow copy is thread-safe; deep copy is not"
    ],
    correct: 0,
    explanation: "A shallow copy duplicates the immediate object and copies references to nested objects, meaning both instances share nested references. A deep copy recursively duplicates all referenced child structures."
  },
  {
    topic: "OOP",
    question: "What is the core intent of the Factory Method design pattern?",
    options: [
      "Define an interface for creating objects, delegating instantiation decisions to subclasses",
      "Maintain a pool of cached database connections for reuse",
      "Prevent subclasses from modifying private static members",
      "Convert asynchronous event handlers into synchronous execution blocks"
    ],
    correct: 0,
    explanation: "The Factory Method pattern encapsulates object creation by letting a base class declare a creation method while subclasses override it to specify the exact concrete class to instantiate."
  },
  {
    topic: "OOP",
    question: "In software engineering design metrics, robust architectures strive for:",
    options: [
      "High cohesion and low coupling",
      "Low cohesion and high coupling",
      "High cohesion and high coupling",
      "Low cohesion and low coupling"
    ],
    correct: 0,
    explanation: "High cohesion ensures elements inside a module belong together and serve a unified purpose. Low coupling minimizes dependencies between distinct modules, making code modular and maintainable."
  },
  {
    topic: "OOP",
    question: "Which behavioral design pattern allows an object to alter its behavior when internal state changes, appearing to alter its class?",
    options: [
      "State Pattern",
      "Memento Pattern",
      "Chain of Responsibility",
      "Visitor Pattern"
    ],
    correct: 0,
    explanation: "The State pattern encapsulates state-specific logic inside distinct state classes conforming to a common interface. The context delegates calls to its current state object, swapping state implementations dynamically."
  },

  // ==========================================
  // TOPIC: DSA Theory (Data Structures & Algorithms) - 20 Questions
  // ==========================================
  {
    topic: "DSA Theory",
    question: "What is the worst-case time complexity of standard QuickSort with first/last element pivot selection?",
    options: [
      "O(n^2)",
      "O(n log n)",
      "O(n)",
      "O(log n)"
    ],
    correct: 0,
    explanation: "When an already sorted or reverse-sorted array is partitioned using the first or last element as pivot, the subproblems reduce by only 1 element each step, degrading time complexity to O(n^2)."
  },
  {
    topic: "DSA Theory",
    question: "What are the average-case and worst-case search complexities in a Hash Table with separate chaining?",
    options: [
      "Average O(1), Worst O(n)",
      "Average O(log n), Worst O(n)",
      "Average O(1), Worst O(log n)",
      "Average O(n), Worst O(n^2)"
    ],
    correct: 0,
    explanation: "Under uniform hashing, average lookup is O(1). In the pathological worst case where all n keys produce hash collisions into a single bucket list, search complexity degrades to O(n)."
  },
  {
    topic: "DSA Theory",
    question: "What is the time complexity to build a Binary Heap of n elements using Floyd's bottom-up `heapify` algorithm?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(log n)",
      "O(n^2)"
    ],
    correct: 0,
    explanation: "Floyd's algorithm processes nodes bottom-up. The sum of heights across all nodes forms a convergent Taylor series n * sum(h / 2^h) = O(n), unlike repeated insertion which is O(n log n)."
  },
  {
    topic: "DSA Theory",
    question: "What is the time complexity of Dijkstra's algorithm implemented with a Binary Min-Heap?",
    options: [
      "O((V + E) log V)",
      "O(V^2)",
      "O(V * E)",
      "O(E log E + V^2)"
    ],
    correct: 0,
    explanation: "Extracting min vertices takes O(V log V) and edge relaxations trigger heap priority updates taking O(E log V). Summed together, the complexity is O((V + E) log V)."
  },
  {
    topic: "DSA Theory",
    question: "What is the maximum permissible difference in height between left and right subtrees in an AVL Tree?",
    options: [
      "1",
      "0",
      "2",
      "log n"
    ],
    correct: 0,
    explanation: "The AVL balance factor invariant mandates that for every node, the height difference between its left and right child subtrees must be in {-1, 0, 1}. Violations are resolved via rotations."
  },
  {
    topic: "DSA Theory",
    question: "What two properties must an algorithmic problem exhibit to be effectively solved via Dynamic Programming?",
    options: [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice Property and Polynomial Bound",
      "Divide-and-Conquer and Monotonicity",
      "Topological Ordering and Strongly Connected Components"
    ],
    correct: 0,
    explanation: "Dynamic programming applies when a global optimal solution can be constructed from optimal subproblem solutions (Optimal Substructure) and the subproblems recur repeatedly (Overlapping Subproblems)."
  },
  {
    topic: "DSA Theory",
    question: "What is the amortized time complexity of an `append()` operation on a dynamic array that doubles capacity when full?",
    options: [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(1/n)"
    ],
    correct: 0,
    explanation: "Although doubling the array and copying n elements takes O(n), this cost occurs only after n insertions. Spreading this reallocation expense evenly gives an amortized cost of O(1) per append."
  },
  {
    topic: "DSA Theory",
    question: "Which algorithm finds a Minimum Spanning Tree (MST) by sorting edges and greedily uniting non-cyclic components with a Disjoint Set (Union-Find)?",
    options: [
      "Kruskal's Algorithm",
      "Prim's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm"
    ],
    correct: 0,
    explanation: "Kruskal's algorithm sorts all graph edges by weight and greedily selects edges that do not introduce cycles, using Disjoint Set Union (DSU) to test connectivity in O(E log E) time."
  },
  {
    topic: "DSA Theory",
    question: "Which Binary Search Tree (BST) traversal produces keys in strictly non-decreasing sorted order?",
    options: [
      "In-order Traversal (Left, Root, Right)",
      "Pre-order Traversal (Root, Left, Right)",
      "Post-order Traversal (Left, Right, Root)",
      "Level-order Traversal (BFS)"
    ],
    correct: 0,
    explanation: "Because a BST guarantees that all left-subtree keys < root < right-subtree keys, an in-order traversal (Left, Root, Right) recursively visits nodes in strictly ascending sorted order."
  },
  {
    topic: "DSA Theory",
    question: "What is the auxiliary space complexity of iterative Breadth-First Search (BFS) on a graph with V vertices and E edges?",
    options: [
      "O(V)",
      "O(E)",
      "O(1)",
      "O(V + E)"
    ],
    correct: 0,
    explanation: "BFS maintains a queue and a visited set. In the worst case (such as a star graph), the queue and visited set hold references to O(V) vertices simultaneously."
  },
  {
    topic: "DSA Theory",
    question: "Which comparison-based sorting algorithm guarantees O(n log n) worst-case time complexity AND preserves relative order of duplicate elements (stable)?",
    options: [
      "MergeSort",
      "HeapSort",
      "QuickSort",
      "Selection Sort"
    ],
    correct: 0,
    explanation: "MergeSort runs in O(n log n) across best, average, and worst cases and is stable (it does not reorder equal keys). HeapSort is O(n log n) but unstable; QuickSort is O(n^2) worst-case and unstable."
  },
  {
    topic: "DSA Theory",
    question: "A Topological Sort can only be determined for which class of graphs?",
    options: [
      "Directed Acyclic Graphs (DAG)",
      "Any Undirected Graph",
      "Complete Bipartite Graphs",
      "Strongly Connected Graphs containing cycles"
    ],
    correct: 0,
    explanation: "A topological sort linearly orders vertices such that for every directed edge u -> v, u precedes v. If any cycle exists, a contradiction arises, making topological sorting possible only on DAGs."
  },
  {
    topic: "DSA Theory",
    question: "What is the primary operational advantage of the Knuth-Morris-Pratt (KMP) string matching algorithm?",
    options: [
      "It precomputes an LPS prefix table to search in O(n + m) time without backing up the text pointer",
      "It hashes substrings using rolling polynomial Rabin-Karp hashes",
      "It compresses text files using Huffman trees in O(1) space",
      "It achieves O(log n) search time on arbitrary unsorted text"
    ],
    correct: 0,
    explanation: "KMP precomputes the Longest Proper Prefix which is also a Suffix (LPS) array for the pattern. Upon a mismatch, it uses LPS to skip redundant comparisons without ever backtracking the text pointer."
  },
  {
    topic: "DSA Theory",
    question: "Which single-source shortest path algorithm is capable of handling negative edge weights and detecting negative cycles?",
    options: [
      "Bellman-Ford Algorithm",
      "Dijkstra's Algorithm",
      "A* Search",
      "Prim's Algorithm"
    ],
    correct: 0,
    explanation: "Bellman-Ford relaxes all edges V - 1 times in O(V * E) time. If an additional relaxation iteration successfully reduces any distance, a reachable negative weight cycle is confirmed."
  },
  {
    topic: "DSA Theory",
    question: "Given the recurrence relation T(n) = 2T(n/2) + O(n), what is its asymptotic complexity by the Master Theorem?",
    options: [
      "O(n log n)",
      "O(n)",
      "O(n^2)",
      "O(log n)"
    ],
    correct: 0,
    explanation: "Here a = 2, b = 2, and f(n) = n. Since n^(log_b(a)) = n^(log_2(2)) = n^1 = f(n), Case 2 of the Master Theorem applies, yielding T(n) = Theta(n log n)."
  },
  {
    topic: "DSA Theory",
    question: "What is the amortized time complexity of Union and Find operations in a Disjoint Set with Path Compression and Union by Rank?",
    options: [
      "O(alpha(n)) where alpha is the Inverse Ackermann function",
      "O(log n)",
      "O(1) strict worst-case",
      "O(sqrt(n))"
    ],
    correct: 0,
    explanation: "Combining path compression with rank heuristics bounds the amortized cost to O(alpha(n)) per operation, where the Inverse Ackermann function alpha(n) is effectively <= 4 for all practical values of n."
  },
  {
    topic: "DSA Theory",
    question: "What is the minimum number of keys that any non-root internal node must hold in a B-Tree of order m?",
    options: [
      "ceil(m / 2) - 1",
      "m - 1",
      "1",
      "floor(m / 2)"
    ],
    correct: 0,
    explanation: "In a B-Tree of order m, every non-root node must contain at least ceil(m / 2) child pointers, which equates to at least ceil(m / 2) - 1 keys."
  },
  {
    topic: "DSA Theory",
    question: "Which algorithm identifies Strongly Connected Components (SCCs) in a directed graph using two depth-first searches and graph transposition?",
    options: [
      "Kosaraju's Algorithm",
      "Kruskal's Algorithm",
      "Floyd-Warshall Algorithm",
      "Hopcroft-Karp Algorithm"
    ],
    correct: 0,
    explanation: "Kosaraju's algorithm performs a first DFS to order nodes by finish time, transposes (reverses) all graph edges, and conducts a second DFS in descending finish order to extract SCCs in O(V + E) time."
  },
  {
    topic: "DSA Theory",
    question: "What is the time complexity to search for a string key of length k in a Trie containing n words?",
    options: [
      "O(k)",
      "O(n * k)",
      "O(log n)",
      "O(n)"
    ],
    correct: 0,
    explanation: "Trie lookup depends exclusively on the length of the target string k, traversing character edge transitions node by node, completely independent of the total word count n."
  },
  {
    topic: "DSA Theory",
    question: "Which sorting algorithm is inherently UNSTABLE in standard implementation?",
    options: [
      "QuickSort",
      "MergeSort",
      "Insertion Sort",
      "Bubble Sort"
    ],
    correct: 0,
    explanation: "Standard QuickSort swaps non-adjacent elements over long distances across the pivot, which frequently inverts the relative original order of equal items, rendering it unstable."
  }
];

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles question options while updating the correct answer index.
 */
function shuffleQuestionOptions(q: Question): Question {
  const originalCorrectOption = q.options[q.correct];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...q,
    options: shuffledOptions,
    correct: newCorrectIndex
  };
}

/**
 * Retrieve exactly `count` (default: 20) questions for a topic.
 * Can be swapped with Postgres database query when Docker is configured.
 */
export function getQuestions(topic: string = "Mixed", count: number = 20): Question[] {
  const normalizedTopic = topic.trim();

  let pool: Question[] = [];

  if (!normalizedTopic || normalizedTopic.toLowerCase() === "mixed") {
    // Collect from all topics evenly
    const topics: Topic[] = ["OS", "Networks", "DBMS", "OOP", "DSA Theory"];
    const perTopic = Math.floor(count / topics.length); // 4 each for 20 questions

    for (const t of topics) {
      const topicQuestions = shuffleArray(QUESTION_BANK.filter(q => q.topic.toLowerCase() === t.toLowerCase()));
      pool.push(...topicQuestions.slice(0, perTopic));
    }

    // If any remain to reach count, fill from remaining
    if (pool.length < count) {
      const remaining = shuffleArray(QUESTION_BANK.filter(q => !pool.includes(q)));
      pool.push(...remaining.slice(0, count - pool.length));
    }
  } else {
    pool = QUESTION_BANK.filter(
      q => q.topic.toLowerCase() === normalizedTopic.toLowerCase()
    );

    // Fallback to all questions if topic not found
    if (pool.length === 0) {
      pool = [...QUESTION_BANK];
    }
  }

  // Shuffle selected questions and randomize option order for variety
  const selected = shuffleArray(pool).slice(0, count);
  return selected.map(q => shuffleQuestionOptions(q));
}
