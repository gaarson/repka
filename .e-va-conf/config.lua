return {
    AGENTS = {
        ARCHITECT = {
            name = "ARCHITECT",
            params = { temperature = 0.1, stream = true },
            prompt_file = "prompts/architect.md",
            allowed_tools = { "explore_tree", "search", "read_file", "outline", "delegate_plan", "ask_user", "shell" }
        },
        CODER = {
            name = "CODER",
            params = { temperature = 0.35, stream = true },
            prompt_file = "prompts/coder.md",
            allowed_tools = { "patch", "create_file", "shell", "read_file", "search", "task_complete" }
        }
    },

    PIPELINE = {
        { stage = "ANALYSIS", agents = { "ARCHITECT" }, mode = "sequential" },
        { stage = "REVIEW", agents = { "ARCHITECT" }, mode = "interactive" },
        { stage = "IMPLEMENTATION", agents = { "CODER" }, mode = "sequential" }
    },

    LIMITS = { MAX_CONTEXT = 64000 }
}
