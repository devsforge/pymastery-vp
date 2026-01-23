# ADR-0001: AI Guidelines Structure

[//]: # (@formatter:off)
<!-- document status badges -->
[draft]: https://img.shields.io/badge/document_status-draft-orange.svg
[accepted]: https://img.shields.io/badge/document_status-accepted-green.svg
[deprecated]: https://img.shields.io/badge/document_status-deprecated-lightgrey.svg
[rejected]: https://img.shields.io/badge/document_status-rejected-red.svg
[final]: https://img.shields.io/badge/document_status-final-blue.svg
[//]: # (@formatter:on)
![status][draft]

<details>
<summary>Document Changelog</summary>

[//]: # (order by version number descending)

| ver. | Date       | Author                            | Changes description |
|------|------------|-----------------------------------|---------------------|
| 0.1  | 2026-01-23 | Claude <claude@anthropic.noreply> | Initial draft       |

</details>

## Context

This project requires AI agents to operate within defined boundaries – protecting human-authored course content while
enabling autonomous work on infrastructure, documentation, and tooling. We need a structure for storing and organizing
AI guidelines that is:

- Discoverable by AI agents
- Maintainable by humans
- Modular enough to evolve independently
- Clear in its hierarchy and purpose

## Decision Drivers

- AI agents need a single entry point to understand project rules
- Guidelines span multiple concerns (roles, style, documentation, CI/CD)
- Some guidelines change more frequently than others
- Machine-readable configuration aids tooling and automation
- Human readability remains essential for oversight

## Considered Options

### Option 1: Single AGENTS.md File

**Description**: All AI guidelines in one Markdown file at the repository root.

**Pros**:

- Simple, single file
- Common convention (AGENTS.md, CLAUDE.md)
- Easy to discover

**Cons**:

- Becomes unwieldy as guidelines grow
- Harder to maintain independent sections
- No machine-readable structure
- Merge conflicts likely with multiple contributors

### Option 2: YAML Config Only

**Description**: All guidelines are encoded in a single YAML configuration file.

**Pros**:

- Machine-readable
- Good for tooling integration
- Structured data

**Cons**:

- Prose guidelines don't fit well
- Poor readability for complex rules
- Difficult for humans to review

### Option 3: Modular Structure (Current)

**Description**: YAML config as index, separate Markdown files for each ruleset domain.

**Pros**:

- Separation of concerns
- Each ruleset evolves independently
- YAML provides machine-readable index
- Markdown provides human-readable detail
- Easier to review changes per domain

**Cons**:

- Requires navigation between files
- AI must understand the index structure
- Slightly higher complexity

### Option 4: Hybrid with Entry Point

**Description**: Add AGENTS.md at repo root as human-readable entry point, pointing to `.ai/config.yaml` for full
structure.

**Pros**:

- Discoverable entry point at repo root
- Maintains modular benefits
- Best of both worlds
- Clear for both humans and AI

**Cons**:

- Slight duplication of high-level information
- One more file to maintain

## Decision

The chosen option is **Option 3: Modular Structure** with consideration for **Option 4** in the future.

**Rationale**:

1. The current modular structure provides a clear separation of concerns
2. Each ruleset (terms, guidelines, style, documentation) can be updated independently
3. The YAML config serves as a navigable index for AI agents
4. Adding an AGENTS.md entry point can be done later if discoverability becomes an issue

**Additional decisions**:

- CI/CD ruleset (`04-cicd-pipelines.md`) is **deferred** from active rulesets until CI/CD implementation becomes a
  priority. The file may be retained for reference but is not listed in `config.yaml`.
- A `version` field is added to `config.yaml` for tracking ruleset iterations.

## Consequences

### Positive

- Clear organization of AI guidelines by domain
- Independent evolution of each ruleset
- Machine-readable index enables future tooling
- Reduced merge conflicts

### Negative

- AI agents must parse config.yaml to find relevant rulesets
- Slightly more complex than a single-file approach

### Neutral

- The future option to add AGENTS.md entry point remains open
- CI/CD guidelines can be reactivated when needed

## Implementation

1. Maintain `.ai/config.yaml` as the authoritative index
2. Store rulesets in `.ai/rulesets/` with numeric prefix for ordering
3. Store templates in `templates/` directory
4. Store ADRs and developer docs in `/docs/` (flat structure, no subdirectories)
5. Reference rulesets from config.yaml with relative paths
6. Version the ruleset collection via `version` field in config.yaml
7. Use file naming conventions to distinguish document types (e.g., `ADR-xxx-*` prefix)

## Related

- `.ai/config.yaml` - Configuration index
- `.ai/rulesets/00-terms-and-conventions.md` - Role definitions
- `.ai/rulesets/01-general-guidelines.md` - Core principles
- `.ai/rulesets/02-grammar-and-style.md` - Writing standards
- `.ai/rulesets/03-documentation.md` - Documentation standards
- `templates/ADR.md` - ADR template
