# ADR-003: Repository File Structure

[//]: # (@formatter:off)
<!-- document status badges -->
[draft]: https://img.shields.io/badge/document_status-draft-orange.svg
[accepted]: https://img.shields.io/badge/document_status-accepted-green.svg
[deprecated]: https://img.shields.io/badge/document_status-deprecated-lightgrey.svg
[rejected]: https://img.shields.io/badge/document_status-rejected-red.svg
[final]: https://img.shields.io/badge/document_status-final-blue.svg
[//]: # (@formatter:on)
![status][final]

<details>
<summary>Document Changelog</summary>

[//]: # (order by version number descending)

| ver. | Date       | Author                                    | Changes description                               |
|------|------------|-------------------------------------------|---------------------------------------------------|
| 0.10 | 2026-01-27 | Serhii Horodilov                          | Fix typos, final draft                            |
| 0.9  | 2026-01-27 | Claude Sonnet 4.5 <noreply@anthropic.com> | Expand scope to comprehensive repo reorganization |
| 0.8  | 2026-01-26 | Serhii Horodilov                          | Fix typos                                         |
| 0.7  | 2026-01-26 | Claude Sonnet 4.5 <noreply@anthropic.com> | Complete final draft with decision                |
| 0.6  | 2026-01-26 | Serhii Horodilov                          | Replace `locales/**` with `content/**`            |
| 0.5  | 2026-01-26 | Serhii Horodilov                          | Add `upstream` repository link                    |
| 0.4  | 2026-01-25 | Serhii Horodilov                          | Fix typos                                         |
| 0.3  | 2026-01-25 | Claude Sonnet 4.5 <noreply@anthropic.com> | Reframe as ru localization, add pictures/         |
| 0.2  | 2026-01-25 | Serhii Horodilov                          | Fix typos                                         |
| 0.1  | 2026-01-25 | Claude Sonnet 4.5 <noreply@anthropic.com> | Initial draft                                     |

</details>

## Context

The repository currently has an inconsistent structure with content scattered across multiple locations, lacking clear
locale-based organization for a multilingual project. This creates organizational, discoverability, and maintainability
issues.

**Current State:**

- **Active content location**: `/src/` directory contains English course content (`.rst` format)
- **Active content format**: reStructuredText (`.rst`) - no format changes in this ADR
- **Sphinx artifacts**: `/src/_locales/` (gettext Ukrainian translations), `/src/_static/` (Sphinx JS files)
- **Legacy content at root**: All `*.md` files in root (except `AGENTS.md`, `CLAUDE.md`) are legacy Russian lesson
  files
- **Legacy assets scattered**: `/pictures/lesson01/`, `/pictures/lesson02/`, `/pictures/lesson08/` tied to legacy
  lessons
- **Active global assets**: `/assets/` directory contains assets used by current course
- **Infrastructure files**: `.ai/`, `docs/`, `templates/`, `mindmaps/` at root
- **Configuration files**: Various dotfiles; active files `AGENTS.md`, `CLAUDE.md` at root
- **Build artifacts location**: Undefined (Sphinx uses `_build/` but may change with SSG)

**Problems:**

1. **No locale-based organization**: Content lacks clear `en`/`uk`/`ru` structure for a multilingual project
2. **Inconsistent content location**: Active content in `/src/`, legacy at root — no unified approach
3. **Repository clutter**: Root directory contains 45+ legacy lesson files mixed with infrastructure
4. **Contributor confusion**: Where should new content go? Where is active English content?
5. **Scattered legacy content**: Russian files at root, images in `/pictures/lessonXX/` — not colocated
6. **Sphinx artifacts mixed with content**: `_locales/` and `_static/` in content directory
7. **Unclear content root**: `/src/` doesn't signal "this is the content directory"
8. **Historical preservation**: Legacy Russian content lacks a clear "preserved but not maintained" status
9. **Onboarding friction**: New contributors must understand historical context to navigate

**Historical Context:**

The legacy Russian-language files are from the original course (upstream source). The project was translated to English
with Ukrainian support, and content moved to `/src/`. Legacy files remained at root during translation, never organized
as a complete historical artifact.

> [!IMPORTANT]
> This decision is interdependent with ADR-002 (SSG Replacement). This ADR addresses **structure only** (where files
> live, directory organization). ADR-002 addresses **format** (reST → Markdown conversion).
> The two MUST BE coordinated but are distinct concerns.

## Decision Drivers

- **Contributor clarity**: Make it obvious where all content lives (active and legacy)
- **Locale-based organization**: Establish clear structure for multilingual content (`en`, `uk`, `ru`)
- **Historical preservation**: Maintain complete legacy Russian content as historical artifact
- **Content root naming**: Clear directory name signaling "this contains course content"
- **Maintainability**: Reduce a cognitive load when navigating repository
- **Discoverability**: Clear separation between active and legacy content
- **Content-asset colocation**: Keep related content and assets together within locales
- **Build system compatibility**: Structure should support current and future SSG expectations (MkDocs)
- **Git history preservation**: Maintain git history through move operations
- **Clean separation of concerns**: Sphinx artifacts separate from content
- **Respectful treatment**: Honor original Russian course as project foundation

## Considered Options

### Option 1: Comprehensive Locale-Based Structure with `content/` Root

**Description**: Reorganize the entire repository to establish `content/` as the content root with locale-based
subdirectories (`en/`, `ru/`). Move active content from `/src/` to `content/en/`, organize legacy content into
`content/ru/`, handle Sphinx artifacts appropriately, and keep global assets at repository root.

**Target Structure:**

```
content/                # Content root (renamed from src/)
  _locales/            # Temporary - Sphinx gettext Ukrainian .po files
                       # (Kept until ADR-002 migration replaces with MkDocs i18n)
  en/                  # Active English content
    *.rst              # Content in reST format (unchanged - conversion in ADR-002)
    subdirs/           # Lesson structure preserved
  ru/                  # Legacy Russian content (preserved, not maintained)
    lessons/           # Root lesson*.md, module*.md → here
      lesson*.md
      module*.md
    pictures/          # /pictures/lessonXX/ → here
      lesson01/
      lesson02/
      lesson08/
    README.md          # Explains legacy status

assets/                # Global project assets (stays at root)
  ...                  # Active assets used by course

(Root level remains: .ai/, docs/, templates/, mindmaps/, config files, AGENTS.md, CLAUDE.md)
```

**Note on `_static/`**: The `/src/_static/` directory (containing Sphinx-specific JS files) will be **removed** as it
is unnecessary for MkDocs (per ADR-002). Preserved in git history if needed.

**Note on `uk/`**: No `content/uk/` placeholder created now. Ukrainian content structure will be established during
ADR-002 when setting up MkDocs file-based i18n.

**Pros**:

- **Clear content root**: `content/` clearly signals "this is where course content lives"
- **Locale-based organization**: Establishes proper multilingual structure (`en`, `ru`, future `uk`)
- **Consistent pattern**: All locales use same organizational approach
- **Respectful preservation**: Legacy Russian course honored as a complete historical artifact
- **Clean root directory**: Infrastructure-only (no content files scattered)
- **Content-asset colocation**: Related content and images together within locales
- **Git history maintained**: Uses `git mv` for all operations
- **Future-compatible**: If `ru` support revived, content ready
- **SSG alignment**: MkDocs expects content root (configurable via `docs_dir: content`)
- **Scalable**: Easy to add future locales
- **Sphinx artifacts handled**: `_locales/` kept temporarily, `_static/` removed (not needed)

**Cons**:

- **Largest implementation effort**: Affects both active and legacy content
- **Repository size unchanged**: All content remains (though organized)
- **Temporary Sphinx artifacts**: `_locales/` kept until ADR-002 completes
- **Learning curve**: Contributors familiar with `/src/` must adapt to `content/en/`

### Option 2: Minimal Change, Only Organize Legacy Content

**Description**: Move only legacy Russian content to `content/ru/`, leave active content in `/src/` unchanged.

**Target Structure:**

```
src/                   # Active content (unchanged)
  *.rst
  _locales/
  _static/
content/
  ru/                  # Legacy Russian only
    lessons/
    pictures/
    README.md
```

**Pros**:

- **Minimal disruption**: Active content location unchanged
- **Smaller implementation effort**: Only legacy content moved
- **Partial cleanup**: Root directory cleaner (legacy files removed)

**Cons**:

- **Incomplete solution**: Doesn't address lack of locale structure for active content
- **Inconsistent naming**: Active in `/src/`, legacy in `content/` — confusing pattern
- **No content root**: `/src/` doesn't establish clear locale-based organization
- **Missed opportunity**: Doesn't position a project for proper multilingual structure
- **Sphinx artifacts remain**: `_locales/` and `_static/` still mixed with content

### Option 3: Archive Legacy Content Separately

**Description**: Create `_archive/ru/` for legacy content, keep active content in `/src/`.

**Target Structure:**

```
src/                   # Active content
  *.rst
_archive/
  ru/                  # Archived legacy
    lessons/
    pictures/
```

**Pros**:

- **Explicit archived status**: Underscore prefix signals "not for active use"
- **Active content unchanged**: No disruption to the current location

**Cons**:

- **No locale structure**: Doesn't establish multilingual organization
- **Archive vs. locale confusion**: Less elegant than proper locale structure
- **Incomplete solution**: Doesn't address core organizational issues

### Option 4: Delete Legacy Content

**Description**: Remove all legacy Russian content, document location (upstream repo, git history).

**Pros**:

- **Cleanest repository**: Smallest size, no legacy files
- **Simplest maintenance**: Only active content

**Cons**:

- **Historical context lost**: Harder to understand project evolution
- **Less respectful**: Treats original course as disposable
- **Doesn't address active content structure**: `/src/` still lacks locale organization

### Option 5: Keep As-Is with Documentation

**Description**: Maintain current structure, add README clarification.

**Pros**:

- **Zero implementation effort**: No changes required

**Cons**:

- **Solves nothing**: All current problems persist
- **Missed opportunity**: Doesn't prepare for a proper multilingual structure

## Decision

**Adopt Option 1: Comprehensive Locale-Based Structure with `content/` Root**

**Rationale:**

Option 1 provides a complete, future-proof solution that addresses all organizational issues while establishing
a proper multilingual structure. This decision is driven by:

1. **Proper Multilingual Foundation**: Establishing `content/en/` and `content/ru/` creates the right pattern for a
   multilingual project. When Ukrainian content is adopted from `*.po` files (ADR-002),
   it naturally fits as `content/uk/`.

2. **Clear Content Root**: Renaming `/src/` → `content/` with locale subdirectories makes it immediately obvious where
   all content lives and how it's organized.

3. **Complete Solution**: Addresses both active and legacy content organization in one coherent restructuring rather
   than piecemeal changes.

4. **Respectful Historical Preservation**: Legacy Russian course preserved as a complete, colocated artifact honoring
   project origins.

5. **Clean Repository Root**: All content files moved into `content/` structure, leaving root for infrastructure only.

6. **SSG Alignment**: MkDocs (per ADR-002) works perfectly with `content/` as content root via `docs_dir: content`
   configuration. Locale structure aligns with `mkdocs-static-i18n` plugin expectations.

7. **Git History Preserved**: All moves use `git mv`, maintaining full commit history and attribution.

8. **Proper Sphinx Artifact Handling**:
    - `_locales/` kept temporarily (needed for current Sphinx setup, will be replaced in ADR-002)
    - `_static/` removed immediately (Sphinx-specific JS, not needed for MkDocs, preserved in git history)

9. **Global Assets Properly Located**: `/assets/` stays at root (project-wide resources, not locale-specific).

10. **Scalability**: Structure easily accommodates future locales or content types.

**Why Not Other Options:**

- **Option 2 (Minimal)**: Incomplete, doesn't establish locale structure, misses opportunity
- **Option 3 (Archive)**: Less elegant, doesn't create a multilingual foundation
- **Option 4 (Delete)**: Too aggressive, loses historical context
- **Option 5 (Keep As-Is)**: Solves no problems

**Coordination with ADR-002:**

This ADR establishes the structure; ADR-002 handles format conversion. The sequence:

1. **ADR-003 first**: Reorganize structure (this ADR) — content still in `.rst` format
2. **ADR-002 second**: Convert `.rst` → `.md`, set up MkDocs, create `content/uk/` for Ukrainian

This separation is cleaner than combining structure and format changes.

**Scope Boundaries:**

- **In Scope**: Directory structure, file organization, git moves, Sphinx artifact handling
- **Out of Scope**: File format conversion (reST → Markdown), SSG migration, MkDocs setup
- **Deferred to ADR-002**: Ukrainian `content/uk/` creation, `_locales/` deprecation, MkDocs i18n setup

## Consequences

### Positive

- **Clear Multilingual Organization**: Proper locale-based structure (`content/en/`, `content/ru/`, future
  `content/uk/`)
- **Clean Repository Root**: All content files in `content/`, root contains only infrastructure
- **Improved Contributor Onboarding**: Obvious where content lives and how it's organized
- **Historical Preservation**: Complete Russian course preserved as a self-contained artifact
- **Content-Asset Colocation**: Lesson files and images together within locales
- **Git History Maintained**: Full commit history preserved for all moved files
- **SSG-Ready Structure**: Aligns perfectly with MkDocs expectations (per ADR-002)
- **Respectful Treatment**: Original Russian course honored as project foundation
- **Future-Proof**: Easy to add locales, content types, or reorganize within an established pattern
- **Reduced Cognitive Load**: Clear, intuitive organization reduces mental effort
- **Proper Artifact Handling**: Sphinx-specific files appropriately managed

### Negative

- **Implementation Effort**: Comprehensive reorganization requires careful execution (estimated 4--6 hours)
- **Repository Size Unchanged**: All content preserved (though organized)
- **Temporary Sphinx Artifacts**: `_locales/` remains until ADR-002 completes (technical debt)
- **Learning Curve**: Contributors familiar with `/src/` must adapt to `content/en/`
- **Git Log Shows Moves**: History shows reorganization (though full history via `git log --follow`)
- **Coordination Required**: Must coordinate with ADR-002 to avoid conflicting changes

### Neutral

- **Directory Naming Change**: `/src/` → `content/en/` (neither better nor worse, just different convention)
- **Build System Unaffected**: Current Sphinx build still works (content location configurable)
- **Documentation Updates Needed**: README, contributor guides, `.ai/config.yaml` require updates
- **Active Content Path Changes**: Internal references to `/src/` become `content/en/` (mechanical update)

## Implementation

### Phase 1: Preparation and Validation (1 hour)

**Objective**: Establish foundation and validate approach.

**Tasks**:

1. **Create Feature Branch**:
    - Branch: `feature/repo-structure-reorganization`
    - Protects `main` branch during reorganization

2. **Audit Current Content**:
    - Inventory all files in `/src/` directory
    - List all root `*.md` files (except `AGENTS.md`, `CLAUDE.md`)
    - Verify `/pictures/lesson01/`, `/pictures/lesson02/`, `/pictures/lesson08/`
    - Identify contents of `/src/_locales/` and `/src/_static/`
    - Confirm `/assets/` contains only active assets

3. **Verify No Cross-Dependencies**:
    - Search for absolute path references to `/src/` in documentation
    - Check for references to root-level legacy files
    - Identify any Sphinx configuration dependencies on current paths
    - Verify build process paths (if any hardcoded)

4. **Plan Git Move Operations**:
    - Document all `git mv` operations needed
    - Identify potential conflicts or issues
    - Plan the order of operations to avoid conflicts

**Deliverables**:

- Feature branch created
- Complete content inventory
- Cross-dependency verification report
- Git move operation plan

### Phase 2: Create Target Structure (30 minutes)

**Objective**: Establish target directory hierarchy.

**Tasks**:

1. **Create Content Root Structure**:
   ```bash
   mkdir -p content/en
   mkdir -p content/ru/lessons
   mkdir -p content/ru/pictures
   ```

2. **Create Legacy README**:
    - Create `content/ru/README.md` explaining:
        - This is the original Russian course (legacy, preserved for historical reference)
        - Not actively maintained
        - Represents project foundation and historical artifact
        - Active English course is in `content/en/`
        - Link to upstream repository for context

**Deliverables**:

- `content/` directory structure created
- `content/ru/README.md` with clear explanation

### Phase 3: Move Active Content (1.5 hours)

**Objective**: Reorganize active English content from `/src/` to `content/en/`.

**Tasks**:

1. **Move Active Content Files**:
   ```bash
   # Move all .rst files and subdirectories from src/ to content/en/
   git mv src/*.rst content/en/ 2>/dev/null || true
   git mv src/*/ content/en/ 2>/dev/null || true
   # Exclude _locales and _static (handled separately)
   ```
    - Preserve directory structure
    - Verify all content files moved
    - Confirm git history preserved: `git log --follow content/en/somefile.rst`

2. **Handle Sphinx Artifacts**:
   ```bash
   # Move _locales (keep temporarily)
   git mv src/_locales/ content/_locales/
   
   # Remove _static (not needed for MkDocs)
   git rm -r src/_static/
   ```

3. **Remove Empty `/src/` Directory**:
   ```bash
   rmdir src/
   ```
    - Verify `/src/` no longer exists
    - Confirm all intended content moved

4. **Verify Active Content Migration**:
    - Check `content/en/` contains all expected files
    - Verify directory structure preserved
    - Confirm `content/_locales/` present
    - Confirm `/src/_static/` removed
    - Test git history: `git log --follow` on sample files

**Deliverables**:

- All active content in `content/en/`
- `content/_locales/` preserved temporarily
- `/src/_static/` removed (in git history)
- `/src/` directory removed
- Git history preserved

### Phase 4: Move Legacy Content (1 hour)

**Objective**: Organize legacy Russian content into `content/ru/`.

**Tasks**:

1. **Move Legacy Lesson Files**:
   ```bash
   git mv lesson*.md content/ru/lessons/
   git mv module*.md content/ru/lessons/
   # Move any other root-level Russian lesson files
   ```
    - Verify all legacy `*.md` moved (except `AGENTS.md`, `CLAUDE.md`)
    - Confirm git history preserved

2. **Move Legacy Images**:
   ```bash
   git mv pictures/lesson01/ content/ru/pictures/
   git mv pictures/lesson02/ content/ru/pictures/
   git mv pictures/lesson08/ content/ru/pictures/
   ```
    - Verify all legacy picture directories moved
    - Remove empty `/pictures/` directory if empty: `rmdir pictures/`

3. **Verify Legacy Content Migration**:
    - Check `content/ru/lessons/` contains all lesson files
    - Check `content/ru/pictures/` contains all image directories
    - Confirm root directory clean (only `AGENTS.md`, `CLAUDE.md`, infrastructure)
    - Test git history: `git log --follow` on sample files

**Deliverables**:

- All legacy content in `content/ru/`
- Clean the root directory (infrastructure only)
- Git history preserved

### Phase 5: Update Sphinx Configuration (30 minutes)

**Objective**: Update Sphinx to reference a new content location.

**Tasks**:

1. **Update `conf.py` (if exists)**:
    - Update content source path from `src/` to `content/en/`
    - Update `_locales/` path to `content/_locales/` if referenced
    - Update any hardcoded paths

2. **Update Build Scripts**:
    - Update any Makefile or build script references to `/src/`
    - Update documentation build commands

3. **Test Sphinx Build**:
   ```bash
   # Test current Sphinx build with new paths
   sphinx-build content/en/ _build/
   ```
    - Verify build successful
    - Check for missing references or broken links
    - Confirm gettext localization still works (`content/_locales/`)

**Deliverables**:

- Updated Sphinx configuration
- Successful test build
- Build scripts updated

### Phase 6: Documentation Updates (1 hour)

**Objective**: Update all project documentation to reflect the new structure.

**Tasks**:

1. **Update Root `README.md`**:
    - Add a section explaining the new repository structure
    - Describe `content/` as content root
    - Explain locale organization (`content/en/`, `content/ru/`)
    - Note `content/_locales/` is temporary (will be replaced in ADR-002)
    - Direct contributors to `content/en/` for active content
    - Note legacy Russian in `content/ru/` for historical reference

2. **Update Contributor Documentation** (if it exists):
    - Update `CONTRIBUTING.md` or similar with new structure
    - Clarify where to add new content (`content/en/`)
    - Explain legacy content policy (preserved, not maintained)

3. **Update `.ai/config.yaml`**:
    - Change all references from `src/` to `content/en/`
    - Add `content/ru/` to file index if appropriate
    - Update `content/_locales/` reference
    - Remove references to removed `src/_static/`
    - Ensure AI agents understand new structure

4. **Update Other Documentation**:
    - Review `docs/` directory for path references
    - Update ADR-002 if it references `/src/` (coordination)
    - Update any internal documentation with path references
    - Check for broken links

**Deliverables**:

- Updated root `README.md`
- Updated contributor documentation
- Updated `.ai/config.yaml`
- All documentation references current

### Phase 7: Verification and Testing (1 hour)

**Objective**: Comprehensive verification that reorganization is successful.

**Tasks**:

1. **Structure Verification**:
    - Verify `content/en/` contains all active content (.rst files)
    - Verify `content/ru/lessons/` contains all legacy lesson files
    - Verify `content/ru/pictures/` contains all legacy image directories
    - Verify `content/_locales/` present (temporary)
    - Verify `content/ru/README.md` exists and accurate
    - Confirm root clean (only infrastructure: `.ai/`, `docs/`, `templates/`, etc.)
    - Confirm `/assets/` unchanged at root
    - Confirm `/src/` and `/pictures/` removed

2. **Git History Verification**:
    - Test `git log --follow content/en/somefile.rst` (from old src/somefile.rst)
    - Test `git log --follow content/ru/lessons/lesson01.md` (from old root)
    - Verify all moves shown as renames, not deletions
    - Confirm full history accessible

3. **Build System Check**:
    - Run a full Sphinx build with new paths
    - Verify HTML output correct
    - Check for missing references or broken links
    - Verify gettext localization works
    - Test deployment process (if applicable)

4. **Cross-Reference Check**:
    - Search documentation for broken references
    - Verify `.ai/config.yaml` paths correct
    - Check for orphaned files
    - Verify no unexpected side effects

5. **Comprehensive Git Status**:
   ```bash
   git status
   git diff --cached --stat
   ```
    - Review all changes
    - Confirm only intended modifications
    - Verify no unintended files are included

**Deliverables**:

- Structure verification checklist completed
- Git history verification passed
- Successful build confirmation
- No broken references
- Clean git status

### Phase 8: Commit and Finalize (30 minutes)

**Objective**: Finalize changes and prepare for merge.

**Tasks**:

1. **Create Comprehensive Commit**:
    - Commit message:
      ```
      refactor: reorganize repository structure with locale-based content/
      
      Establish comprehensive locale-based structure for multilingual content.
      Move active content from src/ to content/en/, organize legacy Russian
      content into content/ru/, and handle Sphinx artifacts appropriately.
      
      Changes:
      - Rename src/ → content/en/ (active English content, .rst format unchanged)
      - Move content/_locales/ (temporary, for current Sphinx setup)
      - Remove src/_static/ (Sphinx-specific JS, not needed for MkDocs)
      - Move root lesson*.md, module*.md → content/ru/lessons/
      - Move pictures/lessonXX/ → content/ru/pictures/
      - Create content/ru/README.md explaining legacy status
      - Update Sphinx configuration for new paths
      - Update README.md, CONTRIBUTING.md, .ai/config.yaml
      - Remove empty src/ and pictures/ directories
      
      Implements ADR-003: Repository File Structure (Option 1)
      
      Git history preserved via git mv operations.
      Format conversion (reST → Markdown) deferred to ADR-002.
      
      Co-authored-by: Serhii Horodilov <serhii.horodilov@example.com>
      ```

2. **Self-Review**:
    - Review full diff: `git diff --cached`
    - Verify a commit message is accurate and complete
    - Check no unintended files included
    - Confirm documentation updates complete

3. **Push and Create PR**:
    - Push feature branch
    - Create a pull request with ADR-003 reference
    - Link to ADR-003 in PR description
    - Highlight structure-only changes (no format conversion)
    - Request review from Project Owner

**Deliverables**:

- Committed changes with a comprehensive message
- Pull request created with context
- Ready for Project Owner review

### Success Criteria

Reorganization is considered successful when:

- [ ] All active content moved to `content/en/` (format unchanged)
- [ ] All legacy Russian content organized in `content/ru/`
- [ ] `content/_locales/` preserved temporarily
- [ ] `src/_static/` removed (preserved in git history)
- [ ] `/assets/` unchanged at root
- [ ] The root directory contains only infrastructure files
- [ ] `content/ru/README.md` clearly explains legacy status
- [ ] Root `README.md` updated with structure information
- [ ] `.ai/config.yaml` updated with new paths
- [ ] Sphinx configuration updated and built successfully
- [ ] Git history preserved for all moved files (verified with `git log --follow`)
- [ ] No broken references in documentation
- [ ] Changes committed with a clear, comprehensive message
- [ ] Project Owner approves structure

### Estimated Timeline

**Total: 4--6 hours** (conservative estimate including verification)

- Phase 1: 1 hour (Preparation)
- Phase 2: 30 minutes (Create structure)
- Phase 3: 1.5 hours (Move active content)
- Phase 4: 1 hour (Move legacy content)
- Phase 5: 30 minutes (Update Sphinx)
- Phase 6: 1 hour (Documentation)
- Phase 7: 1 hour (Verification)
- Phase 8: 30 minutes (Commit)

### Risks and Mitigations

| Risk                             | Impact | Mitigation                                                     |
|----------------------------------|--------|----------------------------------------------------------------|
| Unintended file moves            | High   | Careful verification in Phases 3, 4; feature branch protects   |
| Git history loss                 | High   | Use `git mv` exclusively; verify with `--follow` in Phase 7    |
| Broken Sphinx build              | Medium | Update configuration in Phase 5; test build before committing  |
| Broken documentation references  | Medium | Comprehensive search in Phase 6; verification in Phase 7       |
| Conflicting changes with ADR-002 | Medium | Coordinate timing; this ADR first, then ADR-002                |
| Path reference issues            | Medium | Thorough search for hardcoded paths; test all affected systems |
| Contributor confusion            | Low    | Clear documentation updates; communication about changes       |

### Rollback Plan

If critical issues emerge:

1. Feature branch (`feature/repo-structure-reorganization`) keeps `main` intact
2. Can abandon the branch and revert to the current structure
3. Git history preserved — original state always recoverable
4. No changes to `main` until reorganization fully validated
5. If issues are found post-merge, can revert commit (history allows reconstruction)

## Related

- [ADR-002][ADR-002]: Static Site Generator Replacement (interdependent, SSG expects content structure)
- [ADR-004][ADR-004]: Presentation Framework Handling (may affect assets organization)
- [ADR-001][ADR-001]: AI Guidelines Structure and Administration Framework
- [Upstream repository][upstream]: Original work by @PonomaryovVladyslav and contributors

[//]: # (@formatter:off)
<!-- ADR references -->
[ADR-001]: ./ADR-001-ai-guidelines-structure.md
[ADR-002]: ./ADR-002-ssg-replacement.md
[ADR-003]: ./ADR-003-repo-file-structure.md
[ADR-004]: ./ADR-004-presentation-framework.md
<!-- upstream repository -->
[upstream]: https://github.com/PonomaryovVladyslav/PythonCourses.git
[//]: # (formatter:on)
