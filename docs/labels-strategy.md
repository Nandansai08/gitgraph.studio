# GitHub Labels Strategy

To make GitGraph Studio structured, welcoming, and easy to navigate for contributors and maintainers, we recommend setting up the following taxonomy of labels in the repository settings.

---

## 🏷️ Standard Label Set

| Label Name | Color | Description | Usage Guideline |
| :--- | :--- | :--- | :--- |
| **`good first issue`** | `#7057ff` | Small, self-contained task perfect for newcomers | Use for simple UI tweaks, documentation fixes, or minor helper utilities. |
| **`help wanted`** | `#008672` | Extra attention needed or open to volunteers | Use when the maintainers do not have immediate plans to implement but welcome PRs. |
| **`bug`** | `#d73a4a` | Something isn't working as expected | Assigned to verified bug reports or crashes. |
| **`enhancement`** | `#a2eeef` | New feature or improvement proposal | Assigned to approved new feature designs or optimization requests. |
| **`documentation`** | `#0075ca` | Improvements or additions to docs and comments | Assigned to README updates, inline doc comments, or developer guide files. |
| **`question`** | `#d876e3` | Request for further information or clarification | Assigned to issues seeking support or setup clarification. |
| **`discussion`** | `#0366d6` | Brainstorming, feedback, or architectural design debates | Used for open-ended design discussions before implementation begins. |
| **`needs review`** | `#e11d21` | Pull requests awaiting review from project maintainers | Assigned to active PRs ready for core maintainer sign-off. |
| **`priority-high`** | `#b60205` | High priority issues that block releases or affect major users | Assigned to critical regression bugs or build breaks. |
| **`priority-medium`** | `#e99695` | Medium priority items that should be resolved in the next iteration | Standard development tasks. |
| **`priority-low`** | `#c5def5` | Low priority or nice-to-have features/ideas | Small backlog items or minor enhancements. |

---

## 🚀 Automation & Best Practices

1. **Auto-Labeling Issues**:
   - Issue templates (e.g., `.github/ISSUE_TEMPLATE/bug_report.yml`) are configured to automatically apply the corresponding label (e.g., `bug`) upon creation.
2. **First-Time Contributor Welcome**:
   - Recommend setting up a GitHub action or bot (such as Welcome Bot) to greet new contributors submitting their first pull request.
3. **Weekly Issue Grooming**:
   - Maintainers should check untriaged issues weekly to apply priority levels and highlight issues suitable for external contributions.
