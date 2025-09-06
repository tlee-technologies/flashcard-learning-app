export const finiteAutomataCards = [
  // Core Definitions
  {
    front: "What is a Finite Automaton (FA)?",
    back: "An abstract machine with limited memory that processes input symbols",
    topic: "Core Definitions",
    notes: "Think of it as a simple computer that can only remember its current state",
  },
  {
    front: "What is a Deterministic Finite Automaton (DFA)?",
    back: "A finite automaton where each state and input symbol leads to exactly one transition",
    topic: "Core Definitions",
    notes: "No ambiguity - every input has exactly one path",
  },
  {
    front: "What is a Nondeterministic Finite Automaton (NFA)?",
    back: "A finite automaton where a state and input symbol can lead to multiple possible transitions",
    topic: "Core Definitions",
    notes: "Can 'guess' the right path - multiple choices allowed",
  },

  // Components
  {
    front: "What are States (Q) in a finite automaton?",
    back: "The finite set of all possible conditions the automaton can be in",
    topic: "Components",
    notes: "Like different modes or positions in a game",
  },
  {
    front: "What is the Start State (q₀)?",
    back: "The state where computation begins",
    topic: "Components",
    notes: "The initial position - where everything starts",
  },
  {
    front: "What are Accept (Final) States (F)?",
    back: "Special states where the automaton accepts the input string",
    topic: "Components",
    notes: "The 'winning' states - reaching these means success",
  },
  {
    front: "What is the Alphabet (Σ)?",
    back: "The finite set of allowed input symbols (e.g., {0,1})",
    topic: "Components",
    notes: "The vocabulary the machine understands",
  },
  {
    front: "What is the Transition Function (δ)?",
    back: "The rule that defines how the DFA moves from one state to another given a symbol (δ: Q × Σ → Q)",
    topic: "Components",
    notes: "The roadmap - tells you where to go next",
  },

  // Operations
  {
    front: "What is a Transition?",
    back: "The move from one state to another after reading a symbol",
    topic: "Operations",
    notes: "Like taking a step based on the input",
  },
  {
    front: "What is a String (w)?",
    back: "A finite sequence of symbols from the alphabet (e.g., 0101)",
    topic: "Operations",
    notes: "The input we're processing",
  },
  {
    front: "What is the Empty String (ε)?",
    back: "A string with length zero",
    topic: "Operations",
    notes: "No input at all - like pressing enter without typing",
  },
  {
    front: "What is the Computation Process?",
    back: "Start at q₀, read input symbols one by one, follow transitions, and end in some state",
    topic: "Operations",
    notes: "The step-by-step execution of the automaton",
  },

  // Languages
  {
    front: "What is a Language (L)?",
    back: "A set of strings (finite or infinite) over an alphabet",
    topic: "Languages",
    notes: "A collection of valid words or patterns",
  },
  {
    front: "What is the Empty Language (∅)?",
    back: "The set containing no strings",
    topic: "Languages",
    notes: "A language with no words at all",
  },
  {
    front: "What is the Recognized Language (L(M))?",
    back: "The set of strings accepted by DFA M",
    topic: "Languages",
    notes: "All the inputs that make the machine say 'yes'",
  },
  {
    front: "What is a Regular Language?",
    back: "A language that can be recognized by some finite automaton",
    topic: "Languages",
    notes: "Languages simple enough for finite automata to handle",
  },
  {
    front: "What is the Universe (Σ*)?",
    back: "All possible strings over the alphabet Σ",
    topic: "Languages",
    notes: "Every possible combination of symbols",
  },
  {
    front: "What is the Complement of a Language?",
    back: "The set of strings in Σ* that are not in the language",
    topic: "Languages",
    notes: "Everything the language doesn't include",
  },

  // Advanced Concepts
  {
    front: "What does it mean to Accept a String?",
    back: "If the DFA ends in an accept state after reading the entire string",
    topic: "Advanced Concepts",
    notes: "Success - the input passes the test",
  },
  {
    front: "What does it mean to Reject a String?",
    back: "If the DFA does not end in an accept state",
    topic: "Advanced Concepts",
    notes: "Failure - the input doesn't match the pattern",
  },
  {
    front: "What does it mean to Recognize a Language?",
    back: "A DFA accepts all strings in the language and rejects all others",
    topic: "Advanced Concepts",
    notes: "Perfect classification - yes to members, no to non-members",
  },
  {
    front: "What is the Closure Property?",
    back: "Regular languages remain regular under operations like union, concatenation, and complement",
    topic: "Advanced Concepts",
    notes: "Operations on regular languages produce regular languages",
  },
  {
    front: "What is the Memory Limitation of DFAs?",
    back: "DFAs cannot count or store arbitrary strings; they only track finite states",
    topic: "Advanced Concepts",
    notes: "Limited memory - can't count beyond the number of states",
  },
  {
    front: "What is the Formal Definition of a DFA?",
    back: "M = (Q, Σ, δ, q₀, F) with states, alphabet, transition function, start state, and accept states",
    topic: "Advanced Concepts",
    notes: "The complete mathematical description",
  },
];