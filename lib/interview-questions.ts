import { InterviewQuestion } from "./types";

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ==========================================
  // OOP (Object-Oriented Programming)
  // ==========================================
  {
    company: "Cohesity",
    topic: "OOP",
    question: "What is the difference between an Error and an Exception?",
    answer: "An Error represents a serious system-level problem the application cannot recover from (e.g. OutOfMemoryError, StackOverflowError). An Exception is a recoverable condition the program can catch and handle. Errors are usually thrown by the JVM; Exceptions are thrown by application or library code.",
    tags: ["error", "exception", "java"]
  },
  {
    company: "Google",
    topic: "OOP",
    question: "What is the difference between an abstract class and an interface, and when should you use each?",
    answer: "An abstract class can hold mutable instance state, member variables, and partial method implementations, representing an 'is-a' relationship with single inheritance. An interface defines a stateless behavioral contract ('can-do') and supports multiple inheritance. Use an abstract class for shared code and internal state across tightly coupled classes; use an interface to define polymorphic capabilities across unrelated classes.",
    tags: ["abstract class", "interface", "polymorphism"]
  },
  {
    company: "Microsoft",
    topic: "OOP",
    question: "What is the difference between method overloading and method overriding?",
    answer: "Method overloading occurs within the same class where methods share the same name but differ in signature (parameter types or count); it is resolved at compile time (static polymorphism). Method overriding occurs when a subclass provides a specific implementation of an inherited parent method with identical signature; it is resolved at runtime via dynamic dispatch (runtime polymorphism).",
    tags: ["overloading", "overriding", "polymorphism"]
  },
  {
    company: "Amazon",
    topic: "OOP",
    question: "What is the difference between a shallow copy and a deep copy?",
    answer: "A shallow copy creates a new object instance but copies only primitive fields and raw memory references to nested objects, meaning modifying a referenced object affects both copies. A deep copy recursively duplicates the parent object and every nested object referenced within it, creating completely independent memory allocations with zero shared references.",
    tags: ["shallow copy", "deep copy", "memory"]
  },
  {
    company: "Apple",
    topic: "OOP",
    question: "What is a destructor and how does resource cleanup work across languages?",
    answer: "A destructor is a special member function invoked automatically when an object's lifecycle ends to reclaim resources like file handles, sockets, and heap memory. In deterministic languages like C++, destructors execute immediately upon leaving scope following RAII semantics. In garbage-collected languages (Java/C#), cleanup relies on explicit constructs like try-with-resources or Dispose patterns rather than finalizers.",
    tags: ["destructor", "raii", "memory management"]
  },
  {
    company: "Oracle",
    topic: "OOP",
    question: "What is the difference between checked and unchecked exceptions?",
    answer: "Checked exceptions (direct subclasses of Exception excluding RuntimeException) are verified at compile time and must either be caught in a try-catch block or declared in the method signature via throws. Unchecked exceptions (subclasses of RuntimeException and Error) occur at runtime due to logical defects like NullPointerException or IndexOutOfBoundsException and do not require mandatory handling.",
    tags: ["checked exception", "unchecked exception", "java"]
  },
  {
    company: "Uber",
    topic: "OOP",
    question: "Explain the SOLID principles with concrete engineering examples.",
    answer: "SOLID consists of: Single Responsibility (UserNotifier only sends notifications, never handles DB queries), Open/Closed (PaymentProcessor accepts new PaymentMethod strategies without modifying existing core code), Liskov Substitution (Square cannot violate Rectangle invariant behaviors), Interface Segregation (separate Printable and Scannable interfaces), and Dependency Inversion (OrderService depends on an IPaymentGateway abstraction, not StripeAPI directly).",
    tags: ["solid", "design principles", "architecture"]
  },
  {
    company: "Meta",
    topic: "OOP",
    question: "When and why should you favor composition over inheritance?",
    answer: "Favor composition over inheritance when you want runtime flexibility, loose coupling, and to avoid fragile base-class problems where changes to a superclass break subclasses. Inheritance establishes a rigid compile-time 'is-a' hierarchy that exposes parent internals, whereas composition models a dynamic 'has-a' relationship where modular behaviors can be swapped or decorated at runtime.",
    tags: ["composition", "inheritance", "design patterns"]
  },
  {
    company: "Google",
    topic: "OOP",
    question: "What is a vtable (virtual method table) and how does dynamic dispatch work under the hood?",
    answer: "A vtable is a compiler-generated lookup table of function pointers for each class containing virtual functions. Every instance of such a class contains an invisible virtual pointer (vptr) pointing to the class's vtable. At runtime, virtual method invocations dereference the object's vptr and index into the vtable to call the correct overriding implementation, enabling polymorphism with a single pointer indirection cost.",
    tags: ["vtable", "dynamic dispatch", "c++"]
  },
  {
    company: "Salesforce",
    topic: "OOP",
    question: "What is the Diamond Problem in multiple inheritance and how do languages solve it?",
    answer: "The Diamond Problem occurs when a class inherits from two parent classes that both inherit from a single grandparent class, creating ambiguity over which superclass implementation and state to execute. C++ resolves this using virtual inheritance so only one shared grandparent instance is constructed. Java avoids it by prohibiting multiple class inheritance, allowing only interfaces with explicit conflict resolution rules for default methods.",
    tags: ["multiple inheritance", "diamond problem", "c++"]
  },
  {
    company: "Goldman Sachs",
    topic: "OOP",
    question: "What is the difference between Dependency Inversion and Dependency Injection?",
    answer: "The Dependency Inversion Principle (DIP) is a high-level architectural rule stating that high-level modules should not depend on low-level modules; both should depend on abstractions. Dependency Injection (DI) is a concrete design pattern that realizes DIP by passing external dependencies into a dependent class (via constructor, setter, or framework) rather than letting the class instantiate them directly.",
    tags: ["dependency injection", "inversion of control", "solid"]
  },
  {
    company: "Bloomberg",
    topic: "OOP",
    question: "Why are strings designed to be immutable in languages like Java and Python?",
    answer: "Strings are immutable primarily for security (sensitive connection strings and file paths cannot be modified by untrusted callers), thread safety (multiple threads can share string references without synchronization), and performance (hash codes can be precomputed and cached for instantaneous hash map lookups, and duplicates can be pooled via string interning).",
    tags: ["immutability", "strings", "thread safety"]
  },
  {
    company: "Netflix",
    topic: "OOP",
    question: "What is the difference between the Factory Method and Abstract Factory design patterns?",
    answer: "Factory Method uses inheritance to defer instantiation of a single product to subclass factory methods. Abstract Factory uses object composition to provide an interface for creating entire families of related or dependent objects (e.g., MacButton and MacCheckbox created by a MacUIFactory) without specifying their concrete classes.",
    tags: ["factory pattern", "design patterns", "creational"]
  },
  {
    company: "Common",
    topic: "OOP",
    question: "What is object slicing in C++ and how do you prevent it?",
    answer: "Object slicing occurs when a derived class object is assigned or passed by value to a base class variable, slicing off derived member variables and dynamic vtable pointers because the base storage only has room for base data. It is prevented by passing and storing polymorphic objects by reference or pointer (e.g., std::unique_ptr<Base> or const Base&).",
    tags: ["object slicing", "c++", "polymorphism"]
  },

  // ==========================================
  // OS (Operating Systems)
  // ==========================================
  {
    company: "Microsoft",
    topic: "OS",
    question: "What is the key difference between a process and a thread?",
    answer: "A process is an isolated execution container with its own private virtual address space, memory mappings, file descriptors, and security context. A thread is a lightweight unit of CPU execution that lives inside a process; threads within the same process share the heap, global variables, and OS resources, but maintain their own registers, program counter, and stack.",
    tags: ["process", "thread", "concurrency"]
  },
  {
    company: "Google",
    topic: "OS",
    question: "What are the four Coffman conditions for deadlock, and how can deadlocks be prevented?",
    answer: "Deadlock requires four simultaneous conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Prevention invalidates at least one condition by design—most commonly Circular Wait by enforcing a strict global numerical ordering on resource acquisition, or Hold and Wait by requiring processes to acquire all needed resources atomically up front.",
    tags: ["deadlock", "coffman conditions", "concurrency"]
  },
  {
    company: "Amazon",
    topic: "OS",
    question: "What is the difference between a mutex and a binary semaphore?",
    answer: "A mutex is a locking primitive with ownership semantics: only the exact thread that locked the mutex is allowed to unlock it. A binary semaphore is an integer signaling flag (0 or 1) with no ownership: any thread or interrupt handler can signal (increment) or wait (decrement), making semaphores ideal for producer-consumer signaling and mutexes ideal for critical section exclusion.",
    tags: ["mutex", "semaphore", "synchronization"]
  },
  {
    company: "Apple",
    topic: "OS",
    question: "What happens under the hood in the operating system when you run an executable program?",
    answer: "The shell calls fork() to create a child process followed by execve() to load the binary. The kernel parses the ELF binary header, allocates a new virtual address space, maps text (code), data, and BSS segments, initializes the stack and heap, resolves shared libraries via the dynamic linker (ld.so), configures standard file descriptors, and drops privilege to user mode to execute at the program entry point (_start).",
    tags: ["exec", "process creation", "linux"]
  },
  {
    company: "Meta",
    topic: "OS",
    question: "What is virtual memory and why does modern operating systems use it?",
    answer: "Virtual memory maps process-level virtual addresses to physical RAM frames using hardware page tables and the Memory Management Unit (MMU). It provides memory protection by isolating processes from each other, eliminates external physical memory fragmentation through uniform fixed-size pages, and allows programs to exceed physical RAM capacity by paging inactive memory out to disk swap.",
    tags: ["virtual memory", "mmu", "paging"]
  },
  {
    company: "Cohesity",
    topic: "OS",
    question: "What makes a context switch expensive and what state must the OS save?",
    answer: "A context switch requires saving CPU registers, program counter, and stack pointer to the Process Control Block (PCB), switching kernel stack pointers, and pointing the CR3 register to the new page table. The dominant overhead is cache invalidation: flushing or tagging TLB entries, losing L1/L2 CPU cache locality, and incurring expensive cold cache misses as the newly scheduled process begins executing.",
    tags: ["context switch", "tlb", "cpu cache"]
  },
  {
    company: "Uber",
    topic: "OS",
    question: "What is a race condition and how do you prevent it?",
    answer: "A race condition occurs when two or more concurrent execution threads access shared mutable state without proper synchronization, making the final system state dependent on non-deterministic thread scheduling and execution timing. It is prevented by guarding critical sections using mutexes, read-write locks, semaphores, or hardware atomic instructions (e.g. Compare-And-Swap).",
    tags: ["race condition", "critical section", "synchronization"]
  },
  {
    company: "Netflix",
    topic: "OS",
    question: "What is the difference between a zombie process and an orphan process?",
    answer: "An orphan process is an active process whose parent exited before it; the OS automatically re-parents the orphan to init/systemd (PID 1), which reaps its exit code upon completion. A zombie process is a terminated process whose execution has ended, but its parent has not yet invoked wait()/waitpid(); its entry remains in the process table until reaped by the parent.",
    tags: ["zombie process", "orphan process", "unix"]
  },
  {
    company: "Goldman Sachs",
    topic: "OS",
    question: "What is thrashing in operating systems and how is it resolved?",
    answer: "Thrashing occurs when the operating system spends significantly more CPU time swapping memory pages between RAM and swap disk than executing program instructions, causing throughput to plummet. It happens when the aggregate working sets of all running processes exceed physical RAM. It is resolved by reducing the multiprogramming level (suspending processes) or adding physical RAM.",
    tags: ["thrashing", "paging", "virtual memory"]
  },
  {
    company: "Stripe",
    topic: "OS",
    question: "What is the difference between User Mode and Kernel Mode?",
    answer: "CPU execution rings enforce privilege separation: User Mode (Ring 3) restricts execution to non-privileged instructions, blocking direct hardware and memory access to protect the OS from crashes. Kernel Mode (Ring 0) provides unrestricted CPU privilege and direct access to physical memory and hardware registers. User programs transition to kernel mode via software interrupts or syscall instructions.",
    tags: ["kernel mode", "user mode", "syscall"]
  },
  {
    company: "Common",
    topic: "OS",
    question: "What is Belady's Anomaly and which page replacement algorithms are immune to it?",
    answer: "Belady's Anomaly is the counterintuitive phenomenon where increasing the number of physical page frames results in more page faults for certain access patterns under First-In, First-Out (FIFO) replacement. Stack-based algorithms like Least Recently Used (LRU) and Optimal (OPT) are mathematically immune because pages in an n-frame cache are always a strict subset of an (n+1)-frame cache.",
    tags: ["beladys anomaly", "paging", "fifo"]
  },
  {
    company: "Salesforce",
    topic: "OS",
    question: "What are the primary IPC mechanisms in Linux and which is fastest?",
    answer: "Linux provides Pipes/FIFOs (unidirectional byte streams), Message Queues (structured messages), Unix Domain Sockets (bidirectional streams/datagrams), and Shared Memory. Shared Memory is the fastest IPC mechanism because data is mapped directly into each process's virtual address space, eliminating expensive kernel space-to-user space data copying once the mapping is set up.",
    tags: ["ipc", "shared memory", "linux"]
  },
  {
    company: "Bloomberg",
    topic: "OS",
    question: "What is an inode and how does Unix handle file deletion when a process still holds it open?",
    answer: "An inode is a filesystem metadata record storing file size, permissions, owner, timestamps, and data block pointers, but not the filename. When a file is unlinked while an active process holds an open file descriptor, the directory name entry is removed immediately, but the inode and data blocks remain allocated until the last open descriptor is closed by the process.",
    tags: ["inode", "filesystem", "unix"]
  },
  {
    company: "Oracle",
    topic: "OS",
    question: "What is the difference between Starvation and Deadlock in concurrent systems?",
    answer: "In a deadlock, two or more processes are permanently stuck in a circular wait for resources held by each other; no process can advance, and system progress is zero. In starvation (livelock/indefinite postponement), the system as a whole continues making forward progress, but a specific process is perpetually denied CPU or resources due to biased scheduling (e.g. strict priority without aging).",
    tags: ["starvation", "deadlock", "scheduling"]
  },

  // ==========================================
  // Networks (Computer Networks)
  // ==========================================
  {
    company: "Google",
    topic: "Networks",
    question: "What happens step-by-step when you type a URL into a browser and press Enter?",
    answer: "The browser checks local/DNS caches and queries recursive DNS to resolve the domain to an IP. It initiates a TCP 3-way handshake with the server, followed by a TLS handshake to negotiate cryptographic keys. The browser transmits an HTTP/HTTPS GET request across load balancers to backend servers. The server returns HTML/CSS/JS, and the browser parses the DOM, executes scripts, and renders the page.",
    tags: ["dns", "tcp", "browser internals"]
  },
  {
    company: "Amazon",
    topic: "Networks",
    question: "What are the key differences between TCP and UDP, and when would you choose one over the other?",
    answer: "TCP is a connection-oriented, reliable protocol that guarantees in-order packet delivery, flow control, and congestion control via sequence numbers and ACKs at the expense of higher latency and overhead. UDP is a connectionless, lightweight datagram protocol with no delivery guarantees or retransmissions. Choose TCP for web APIs and file transfers; choose UDP for live gaming, video streaming, and DNS lookups.",
    tags: ["tcp", "udp", "transport layer"]
  },
  {
    company: "Netflix",
    topic: "Networks",
    question: "What is a Content Delivery Network (CDN) and how does it improve web performance?",
    answer: "A CDN is a geographically distributed network of edge proxy servers that caches static and dynamic assets (media, scripts, HTML) close to end users. By serving requests from the nearest Point of Presence (PoP) instead of the central origin server, CDNs significantly reduce round-trip time (RTT), absorb traffic spikes, offload origin load, and provide edge DDoS protection.",
    tags: ["cdn", "caching", "latency"]
  },
  {
    company: "Apple",
    topic: "Networks",
    question: "What is the difference between HTTP and HTTPS, and how is encryption established?",
    answer: "HTTP transmits plain-text messages over port 80, vulnerable to packet sniffing and MITM attacks. HTTPS encrypts traffic over port 443 using TLS/SSL. During the TLS handshake, the client verifies the server's X.509 digital certificate, negotiates cipher suites, and uses asymmetric public-key cryptography to exchange a shared symmetric key (AES) for high-performance session encryption.",
    tags: ["https", "tls", "security"]
  },
  {
    company: "Microsoft",
    topic: "Networks",
    question: "What is a network socket and how does it uniquely identify an endpoint?",
    answer: "A socket is an operating system software abstraction representing an endpoint for sending or receiving data across a network. A network connection is uniquely identified by an OS 5-tuple: Source IP, Source Port, Destination IP, Destination Port, and the Transport Protocol (TCP or UDP).",
    tags: ["socket", "networking", "tcp"]
  },
  {
    company: "Meta",
    topic: "Networks",
    question: "How does DNS resolution work from the local resolver to the authoritative nameserver?",
    answer: "The client asks the local recursive resolver. If uncached, the resolver queries a Root nameserver (which points to the .com TLD nameserver), then queries the TLD nameserver (which points to the domain's Authoritative nameserver), and finally queries the Authoritative nameserver to get the A/AAAA IP record. The resolver caches the record per its TTL and returns the IP to the client.",
    tags: ["dns", "networking", "infrastructure"]
  },
  {
    company: "Uber",
    topic: "Networks",
    question: "What is a load balancer and what is the difference between Layer 4 and Layer 7 load balancing?",
    answer: "A load balancer distributes incoming network traffic across a server farm to maximize throughput, minimize latency, and ensure high availability. Layer 4 (L4) load balancers route packets at the transport layer based on IP addresses and TCP/UDP ports without inspecting payload. Layer 7 (L7) load balancers inspect application data, routing based on HTTP paths, headers, cookies, and HTTP methods.",
    tags: ["load balancer", "l4 vs l7", "scalability"]
  },
  {
    company: "Cohesity",
    topic: "Networks",
    question: "What is the difference between latency and throughput, and how do they impact performance?",
    answer: "Latency is the time delay for a single unit of data to travel from sender to receiver (measured in milliseconds). Throughput is the total volume of data successfully transmitted over a network channel in a given time period (measured in Mbps or Gbps). Interactive web services require low latency for user responsiveness, whereas batch data replication prioritizes high throughput.",
    tags: ["latency", "throughput", "performance"]
  },
  {
    company: "Stripe",
    topic: "Networks",
    question: "What is the difference between REST and GraphQL APIs, and what trade-offs do they present?",
    answer: "REST uses standard HTTP methods against fixed URL resources where each endpoint returns a rigid JSON structure, frequently causing over-fetching or under-fetching across multiple round trips. GraphQL uses a single endpoint where clients submit precise queries requesting only needed fields, saving bandwidth on mobile clients at the cost of server-side complexity and difficult HTTP caching.",
    tags: ["rest", "graphql", "api design"]
  },
  {
    company: "Goldman Sachs",
    topic: "Networks",
    question: "Explain the TCP 3-way handshake and why the TIME_WAIT state is necessary during connection teardown.",
    answer: "TCP establishes connections via SYN (client initiates seq number), SYN-ACK (server acknowledges and proposes its seq number), and ACK (client confirms). During connection teardown (FIN/ACK), the endpoint initiating active close enters the TIME_WAIT state (2 MSL = ~120s) to ensure its final ACK reached the peer and to prevent lingering duplicate packets from corrupting subsequent connections.",
    tags: ["tcp", "handshake", "time_wait"]
  },
  {
    company: "Bloomberg",
    topic: "Networks",
    question: "What is Head-of-Line (HoL) blocking and how do HTTP/2 and HTTP/3 address it?",
    answer: "In HTTP/1.1, HoL blocking occurs because only one request/response can be transmitted on a TCP connection at once. HTTP/2 solved application-layer HoL blocking by multiplexing streams over a single TCP connection, but a single lost TCP packet stalls all multiplexed streams. HTTP/3 eliminates transport-layer HoL blocking by running over QUIC (UDP), ensuring packet loss in one stream never stalls unrelated streams.",
    tags: ["http2", "http3", "quic"]
  },
  {
    company: "Salesforce",
    topic: "Networks",
    question: "What is the difference between a Forward Proxy and a Reverse Proxy?",
    answer: "A Forward Proxy sits between client devices and the public internet, masking client IP addresses to enforce corporate security policies, content filters, or anonymity. A Reverse Proxy sits in front of internal web servers, intercepting public incoming traffic to provide SSL termination, load balancing, reverse caching, and DDoS defense while hiding backend server topologies.",
    tags: ["reverse proxy", "forward proxy", "architecture"]
  },
  {
    company: "Common",
    topic: "Networks",
    question: "What is Cross-Origin Resource Sharing (CORS) and why does the browser enforce it?",
    answer: "CORS is a browser security protocol that relaxes the Same-Origin Policy (SOP), enabling client web pages on one origin to securely request resources from another origin. The browser enforces this by sending an HTTP OPTIONS preflight request; the destination server responds with headers like Access-Control-Allow-Origin, explicitly white-listing authorized domains, methods, and credentials.",
    tags: ["cors", "security", "browsers"]
  },
  {
    company: "Uber",
    topic: "Networks",
    question: "Compare WebSockets, Server-Sent Events (SSE), and Long Polling for real-time applications.",
    answer: "Long Polling sends repeated HTTP requests that the server holds until new data is available, incurring high header overhead and latency. Server-Sent Events (SSE) provide a lightweight, persistent, unidirectional HTTP connection from server to client with built-in reconnection, ideal for notifications and tickers. WebSockets provide a full-duplex, bidirectional TCP connection with minimal framing overhead, ideal for chat and games.",
    tags: ["websockets", "sse", "realtime"]
  },

  // ==========================================
  // DBMS (Database Management Systems)
  // ==========================================
  {
    company: "Goldman Sachs",
    topic: "DBMS",
    question: "Explain the ACID properties of database transactions with a real-world banking example.",
    answer: "In a $100 bank transfer from Account A to Account B: Atomicity guarantees both debit from A and credit to B succeed together or both abort with rollback. Consistency guarantees account balances satisfy business constraints (no negative balances). Isolation ensures concurrent transfers cannot observe intermediate states (money debited from A but not yet in B). Durability guarantees committed changes survive system crashes via Write-Ahead Logs.",
    tags: ["acid", "transactions", "rdbms"]
  },
  {
    company: "Amazon",
    topic: "DBMS",
    question: "What are the trade-offs between SQL (relational) and NoSQL databases, and when should you choose each?",
    answer: "SQL databases (PostgreSQL, MySQL) enforce ACID transactions, rigid relational schemas, and complex JOIN queries, making them ideal for financial systems, inventory, and structured relational data. NoSQL databases (MongoDB, DynamoDB, Cassandra) trade ACID constraints or relational joins for flexible schemaless documents, horizontal sharding, and massive write throughput across distributed clusters.",
    tags: ["sql", "nosql", "architecture"]
  },
  {
    company: "Microsoft",
    topic: "DBMS",
    question: "What is a database index and in what scenarios should you avoid creating one?",
    answer: "An index is an auxiliary data structure (typically a B+ Tree) that allows the query engine to find rows in O(log N) disk reads without scanning the entire table. You should avoid indexing small tables (where sequential table scans are faster), columns with low cardinality (e.g. boolean flags), and write-heavy tables where frequent INSERT/UPDATE/DELETE operations incur significant overhead to maintain index trees.",
    tags: ["indexing", "b+ tree", "performance"]
  },
  {
    company: "Oracle",
    topic: "DBMS",
    question: "What is the difference between a clustered index and a non-clustered (secondary) index?",
    answer: "A clustered index determines the physical on-disk sorting and storage order of the actual table rows; therefore, a table can have only one clustered index (usually the Primary Key). A non-clustered index stores index key values alongside pointers (row locators or primary keys) back to the actual data rows; a table can have multiple non-clustered indexes to speed up distinct query filter patterns.",
    tags: ["clustered index", "indexing", "sql"]
  },
  {
    company: "Google",
    topic: "DBMS",
    question: "What is a database transaction and what does transaction isolation prevent?",
    answer: "A transaction is a logical unit of database work containing one or more SQL statements executed as a single atomic operation. Transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) prevent concurrency anomalies such as Dirty Reads (reading uncommitted data), Non-Repeatable Reads (data modified mid-transaction), and Phantom Reads (new rows inserted matching range filters).",
    tags: ["transaction", "isolation levels", "concurrency"]
  },
  {
    company: "Common",
    topic: "DBMS",
    question: "What is the difference between an INNER JOIN and a LEFT JOIN in SQL?",
    answer: "An INNER JOIN evaluates two tables and returns only rows where the join condition matches in both tables, omitting unmatched records. A LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table regardless of whether a match exists, populating NULL for right table columns when the join predicate fails to find a matching row.",
    tags: ["sql", "joins", "relational"]
  },
  {
    company: "Meta",
    topic: "DBMS",
    question: "What is the N+1 query problem and how do you resolve it in an application or ORM?",
    answer: "The N+1 problem occurs when an application executes 1 initial SQL query to fetch N parent records (e.g., SELECT * FROM users), and then issues N subsequent individual queries in a loop to fetch related child entities (e.g., SELECT * FROM orders WHERE user_id = ?). It is resolved by eager loading child records using an SQL JOIN or an IN-clause batch query (e.g., SELECT * FROM orders WHERE user_id IN (...)).",
    tags: ["n+1 query", "orm", "performance"]
  },
  {
    company: "Apple",
    topic: "DBMS",
    question: "What is the CAP theorem and why can a distributed data store only guarantee two of the three properties?",
    answer: "The CAP theorem states that a distributed data system cannot simultaneously guarantee Consistency (every read receives the most recent write), Availability (every non-failing node returns a response), and Partition Tolerance (system functions despite network dropped packets). Because network partitions (P) are unavoidable in real networks, distributed systems must choose either CP (reject writes to preserve strict consistency, e.g., HBase, Zookeeper) or AP (accept writes with eventual consistency, e.g., Cassandra, DynamoDB).",
    tags: ["cap theorem", "distributed systems", "consistency"]
  },
  {
    company: "Cohesity",
    topic: "DBMS",
    question: "What is database connection pooling and why is it essential for scalable applications?",
    answer: "Establishing a new database connection requires an expensive TCP handshake, TLS negotiation, authentication, and backend process/thread allocation. A connection pool maintains a cache of pre-established, reusable physical connections. When an application thread needs database access, it borrows a connection from the pool and releases it back upon completion, capping total DB connections and slashing request latency.",
    tags: ["connection pooling", "performance", "backend"]
  },
  {
    company: "Stripe",
    topic: "DBMS",
    question: "What is the difference between Optimistic and Pessimistic concurrency control?",
    answer: "Pessimistic Locking locks database rows immediately upon reading (e.g., SELECT ... FOR UPDATE), blocking conflicting transactions until release; it is best for high-contention environments where conflicts are frequent. Optimistic Locking allows concurrent reads and writes without locks, checking for conflict at commit time using a version number or timestamp column; it is ideal for low-contention web applications.",
    tags: ["optimistic locking", "pessimistic locking", "concurrency"]
  },
  {
    company: "Uber",
    topic: "DBMS",
    question: "What is the purpose of database normalization and why do high-scale systems denormalize?",
    answer: "Normalization (1NF through BCNF) decomposes tables to eliminate data redundancy, avoid update/delete anomalies, and enforce referential integrity. However, normalized schemas require expensive multi-table JOINs at scale. High-throughput distributed systems deliberately denormalize data by storing pre-aggregated redundant attributes to satisfy critical read queries with single-table lookups.",
    tags: ["normalization", "denormalization", "schema design"]
  },
  {
    company: "Bloomberg",
    topic: "DBMS",
    question: "What is Write-Ahead Logging (WAL) and how does it guarantee transaction durability?",
    answer: "WAL enforces that any data modification must be appended sequentially to an append-only log file on non-volatile disk before the corresponding database page in memory is flushed to table storage. In the event of a sudden crash or power loss, the recovery engine replays committed transactions from the WAL (REDO) and rolls back uncommitted ones (UNDO) to restore database consistency.",
    tags: ["wal", "durability", "recovery"]
  },
  {
    company: "Netflix",
    topic: "DBMS",
    question: "What are the differences between Sharding, Partitioning, and Replication?",
    answer: "Replication copies the same dataset across multiple nodes to provide high availability, fault tolerance, and read scalability. Partitioning divides a single table's rows across multiple physical tables on the same database server (e.g. range partitioning by date). Sharding distributes table partitions horizontally across distinct physical database servers to overcome single-machine storage and write limits.",
    tags: ["sharding", "replication", "scalability"]
  },
  {
    company: "Salesforce",
    topic: "DBMS",
    question: "Explain the three classic ANSI SQL transaction anomalies: Dirty Read, Non-Repeatable Read, and Phantom Read.",
    answer: "A Dirty Read occurs when Transaction A reads data modified by Transaction B that has not yet been committed (and may be rolled back). A Non-Repeatable Read occurs when Transaction A reads a row twice and finds values modified or deleted by a committed concurrent transaction. A Phantom Read occurs when Transaction A re-executes a range query and discovers new rows inserted by a committed concurrent transaction.",
    tags: ["isolation anomalies", "transactions", "sql"]
  },

  // ==========================================
  // DSA Theory (Data Structures & Algorithms Theory)
  // ==========================================
  {
    company: "Amazon",
    topic: "DSA Theory",
    question: "When should you use a HashMap versus a TreeMap?",
    answer: "Use a HashMap when you need O(1) average-case time complexity for insertion, deletion, and search, and order does not matter (backed by an array with hash chaining). Use a TreeMap when you require keys to be maintained in sorted natural order or need range queries (e.g., subMap, floorKey, ceilingKey); TreeMap is backed by a Red-Black Tree providing guaranteed O(log N) operations.",
    tags: ["hashmap", "treemap", "data structures"]
  },
  {
    company: "Google",
    topic: "DSA Theory",
    question: "What is amortized time complexity, and how does dynamic array resizing demonstrate it?",
    answer: "Amortized complexity measures the average time taken per operation over a worst-case sequence of operations, demonstrating that occasional expensive operations do not ruin overall efficiency. For a dynamic array (e.g., ArrayList/std::vector), appending is usually O(1), but when the capacity fills, it reallocates and copies N elements taking O(N). Because resizing happens geometrically (doubling size), the cost spread across N operations averages O(1) amortized.",
    tags: ["amortized analysis", "dynamic array", "complexity"]
  },
  {
    company: "Microsoft",
    topic: "DSA Theory",
    question: "What is the difference between a stable and an unstable sorting algorithm, and why does stability matter?",
    answer: "A stable sort preserves the original relative order of elements that have equal keys; an unstable sort does not guarantee this order. Stability is critical in multi-level sorting—for example, sorting a list of employees alphabetically by name, and then sorting them by department. A stable sort (MergeSort, Insertion Sort) guarantees employees remain alphabetically ordered within each department, whereas QuickSort or HeapSort might shuffle them.",
    tags: ["sorting", "stable sort", "algorithms"]
  },
  {
    company: "Meta",
    topic: "DSA Theory",
    question: "Under what circumstances does QuickSort degrade to O(n²) time complexity, and how can this be mitigated?",
    answer: "QuickSort degrades to O(n²) when the chosen pivot consistently splits the array into highly unbalanced partitions of sizes 1 and n-1, such as picking the first or last element in an already sorted or reverse-sorted array. This is mitigated by using randomized pivot selection, the Median-of-Three pivot strategy (median of first, middle, and last elements), or hybrid algorithms like IntroSort (which falls back to HeapSort if recursion depth exceeds 2 log N).",
    tags: ["quicksort", "worst case", "algorithms"]
  },
  {
    company: "Apple",
    topic: "DSA Theory",
    question: "What is the difference between BFS and DFS, and when should you choose one over the other?",
    answer: "BFS explores a graph level by level using a Queue, finding the shortest path in unweighted graphs and consuming memory proportional to the maximum breadth of the graph. DFS explores as deep as possible along each branch before backtracking using a Stack or recursion, requiring memory proportional to the tree height. Use BFS for shortest paths and peer discovery; use DFS for topological sort, cycle detection, and maze backtracking.",
    tags: ["bfs", "dfs", "graphs"]
  },
  {
    company: "Uber",
    topic: "DSA Theory",
    question: "What is the fundamental difference between dynamic programming and the greedy algorithmic approach?",
    answer: "A greedy algorithm makes the locally optimal choice at each step without ever reconsidering previous decisions, requiring the greedy-choice property to guarantee a globally optimal solution. Dynamic programming solves problems with optimal substructure and overlapping subproblems by exploring all relevant subproblem states, caching results via memoization or tabulation to guarantee global optimality when greedy choices fail.",
    tags: ["dynamic programming", "greedy", "algorithms"]
  },
  {
    company: "Cohesity",
    topic: "DSA Theory",
    question: "What is a heap data structure and what are its primary use cases in systems and algorithms?",
    answer: "A binary heap is a complete binary tree implemented efficiently in an array satisfying the heap invariant: in a Min-Heap, every parent node is less than or equal to its children, providing O(1) minimum extraction and O(log N) insertion. Primary use cases include Priority Queues, Dijkstra's shortest path, finding the Top-K largest/smallest elements in a streaming dataset, and CPU task scheduling.",
    tags: ["heap", "priority queue", "data structures"]
  },
  {
    company: "Common",
    topic: "DSA Theory",
    question: "What is the difference between a stack and a queue, and what are typical real-world use cases for each?",
    answer: "A stack operates on a Last-In, First-Out (LIFO) basis where insertions and removals occur at the same end (top). A queue operates on a First-In, First-Out (FIFO) basis where insertions occur at the rear and removals occur at the front. Stacks are used for function call stacks, undo/redo buffers, and expression syntax parsing. Queues are used for asynchronous task queues, CPU scheduling, and printer spoolers.",
    tags: ["stack", "queue", "data structures"]
  },
  {
    company: "Bloomberg",
    topic: "DSA Theory",
    question: "How do Separate Chaining and Open Addressing resolve hash collisions?",
    answer: "Separate Chaining stores colliding elements in a secondary data structure (such as a linked list or red-black tree) at the corresponding array bucket index. Open Addressing keeps all records inside the main table array itself; upon collision, it probes alternative slots using linear probing, quadratic probing, or double hashing until an empty cell is found, requiring careful load factor management below 0.7.",
    tags: ["hash collisions", "chaining", "open addressing"]
  },
  {
    company: "Goldman Sachs",
    topic: "DSA Theory",
    question: "What is the difference between an AVL Tree and a Red-Black Tree, and when is each preferred?",
    answer: "AVL trees enforce strict balancing where the height difference between subtrees is at most 1, resulting in shallower trees and faster O(log N) lookups at the expense of more frequent tree rotations on write. Red-Black trees enforce looser balance constraints using node colors, requiring fewer rotations on inserts and deletes. Use AVL trees for read-intensive workloads and Red-Black trees (e.g. C++ std::map, Java TreeMap) for frequent insertions and deletions.",
    tags: ["avl tree", "red-black tree", "bst"]
  },
  {
    company: "Stripe",
    topic: "DSA Theory",
    question: "Compare Dijkstra's Algorithm and Bellman-Ford for finding single-source shortest paths.",
    answer: "Dijkstra's Algorithm uses a greedy approach with a min-priority queue, running in O((V + E) log V) time, but it fails in the presence of negative edge weights. The Bellman-Ford algorithm relaxes all edges V-1 times via dynamic programming in O(V * E) time; while slower, it correctly handles graphs with negative edge weights and detects negative weight cycles.",
    tags: ["dijkstra", "bellman-ford", "graphs"]
  },
  {
    company: "Netflix",
    topic: "DSA Theory",
    question: "Why are contiguous arrays typically much faster than linked lists for sequential traversal?",
    answer: "Arrays allocate contiguous memory blocks, enabling hardware CPU prefetchers to load sequential cache lines into fast L1/L2 CPU caches with high spatial locality. Linked list nodes are scattered arbitrarily across the heap connected by pointers; traversing them incurs multiple cache misses and pointer-chasing latency that dwarfs raw instruction execution time on modern processors.",
    tags: ["cache locality", "array", "linked list"]
  },
  {
    company: "Google",
    topic: "DSA Theory",
    question: "What is a Trie and why is it preferred over a Hash Table for prefix search?",
    answer: "A Trie (prefix tree) is a tree data structure where each node represents a character along a string path, sharing common prefixes across words. Looking up or auto-completing a prefix of length L takes deterministic O(L) time independent of the total number of words in the dictionary. While a Hash Table can find exact matches in O(1), finding all words matching a prefix requires scanning all keys or complex secondary indices.",
    tags: ["trie", "prefix search", "data structures"]
  },
  {
    company: "Salesforce",
    topic: "DSA Theory",
    question: "When should you represent a graph using an Adjacency Matrix versus an Adjacency List?",
    answer: "Use an Adjacency Matrix (a V x V boolean/weight grid) for dense graphs where E is close to V² or when you need O(1) edge existence queries, though it consumes O(V²) space and takes O(V) to iterate neighbors. Use an Adjacency List (an array of neighbor lists) for sparse graphs where E << V²; it consumes O(V + E) space and enables finding all adjacent neighbors in time proportional to vertex degree.",
    tags: ["graphs", "adjacency matrix", "adjacency list"]
  }
];

export function getInterviewQuestions(topic?: string): InterviewQuestion[] {
  if (!topic || topic.toLowerCase() === "all" || topic.toLowerCase() === "mixed") {
    return INTERVIEW_QUESTIONS;
  }
  return INTERVIEW_QUESTIONS.filter(
    (q) => q.topic.toLowerCase() === topic.toLowerCase()
  );
}
