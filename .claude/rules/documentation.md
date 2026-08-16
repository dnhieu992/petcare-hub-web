# Documentation Convention

```
docs/
├── adr/        ← Architecture Decision Records — why we chose something. Kept forever.
└── changes/    ← Change notes — what changed in a feature/branch.
```

## ADR — Architecture Decision Records

- File: `docs/adr/NNNN-slug.md` (e.g. `docs/adr/0002-shared-api-package.md`).
- Create an ADR when: choosing between 2+ solutions with real trade-offs; a decision with
  long-term architectural impact; changing a pattern used across the project.
- Do **not** create one for: obvious choices, small config tweaks, trivial bug fixes.
- Status lifecycle: `Proposed` → `Accepted` → `Deprecated` / `Superseded by NNNN`.
- Never delete an old ADR — update its Status. ADRs hold **reasons, not code**.
- Use `docs/adr/TEMPLATE.md` as the starting point.

## Change notes

- File: `docs/changes/<year>/YYYYMMDD_<type>_<slug>.md`
  (e.g. `docs/changes/2026/20260816_feat_pet-profile.md`). **Archive theo năm** để thư
  mục không phình — mỗi năm một folder. Slug luôn chứa tên feature để tra lịch sử.
- Types: `feat`, `fix`, `refactor`, `perf`, `infra`, `db`.
- Create when: new feature with business logic; schema/API-contract change; refactor across
  modules; measured performance work. Skip for typos, dep bumps, tiny obvious fixes.
- Change notes hold **what changed**, not trade-off analysis — link to an ADR for the "why".
- Use `docs/changes/TEMPLATE.md`. Tra cứu: `find docs/changes -name '*<feature>*'`.
- Change notes là loại **tra-cứu-khi-cần** (không nạp vào context mỗi lần), nên cứ để lớn;
  chỉ archive theo năm. Khi quá nhiều có thể migrate sang GitHub Wiki. ADR luôn ở lại repo.

## Principle

- **ADR answers:** *Why this solution?* — **Change note answers:** *What changed in the code?*
- Prefer short and correct over long and complete. Keep the two kinds in separate files.
