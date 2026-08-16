# Feature Workflow — Quy trình làm feature

Tài liệu này mô tả quy trình end-to-end khi làm việc với AI ("vibe coding") trên monorepo
PetCare Hub, để **đi nhanh nhưng vẫn dễ maintain**. Gồm 2 phần:

1. [Build feature mới](#1-build-feature-mới)
2. [Update / fix bug feature có sẵn](#2-update--fix-bug-feature-có-sẵn)

> Code / path / lệnh giữ nguyên tiếng Anh; phần giải thích bằng tiếng Việt.

---

## Cách prompt (chung cho cả hai)

> "Build feature **[tên]** cho app **[clinic/admin/pet-portal]**: [user làm được gì]. API: [đã có / mock]."
>
> "Fix bug **[mô tả]** ở feature **[tên]** app **[…]**."

Thiếu thông tin (app nào? có API chưa?) → AI hỏi đúng 1 câu rồi mới làm.

---

## Bản đồ quyết định: code nằm ở đâu?

Bước quan trọng nhất — sai chỗ là hỏng maintain.

| Cái gì?                                                   | Nằm ở đâu?                              |
| -------------------------------------------------------- | --------------------------------------- |
| Zod schema, type, gọi HTTP, query key                    | `packages/api` (dùng chung)             |
| Component tái sử dụng, không dính business                | `packages/ui` (dùng chung)              |
| Logic riêng feature (hook `useQuery`, form, màn ghép lại) | `apps/<app>/src/features/<domain>`      |
| Gắn feature vào URL                                       | `apps/<app>/src/routes` (Vite) · `src/app` (Next) |
| Test                                                     | cạnh file: `foo.ts` → `foo.test.ts`     |

**Quy tắc vàng:** 1 app dùng → để trong app. ≥2 app dùng → đẩy xuống `packages/*`.

---

## 1. Build feature mới

Ví dụ: *"Thêm quản lý lịch hẹn (appointments) cho app clinic"*.

### Pipeline

```
BẠN PROMPT
   │
   ▼
(0) Xác định app + đã có API chưa   ── thiếu → AI hỏi 1 câu
   ▼
(1) packages/api    → Zod schema + type + client call + query key
   ▼
(2) packages/ui     → (chỉ khi cần) component tái dùng mới
   ▼
(3) apps/<app>/src/features/<domain>/   → hooks + components + types
   ▼
(4) apps/<app>/src/routes (hoặc src/app)  → gắn route
   ▼
(5) Test cạnh file
   ▼
(6) GUARDRAIL: pnpm type-check → pnpm lint → pnpm format
   ▼
(7) Docs: docs/changes/…_feat_….md   (+ ADR nếu có quyết định kiến trúc)
   ▼
(8) Commit → pre-commit hook chạy lint-staged → chỉ commit khi sạch
```

### Chi tiết (ví dụ appointments)

**(1) `packages/api` — data contract trước tiên** (schema là nguồn sự thật):
```
packages/api/src/
  schemas/appointment.ts      # appointmentSchema → type Appointment = z.infer<>
  client/appointments.ts      # getAppointments(), createAppointment()
  query-keys/appointments.ts  # appointmentKeys.list(tenant), .detail(id)
```
Re-export từ entry public → app dùng `import { getAppointments } from "@petcare/api/client"`.

**(2) `packages/ui`** — chỉ thêm khi thiếu (vd. `<DataTable>`). Đã có `<Button>` thì dùng lại,
không tạo bản sao trong app.

**(3) Feature slice** — nơi ghép mọi thứ:
```
apps/clinic/src/features/appointments/
  hooks/use-appointments.ts       # useQuery(appointmentKeys.list, getAppointments)
  components/appointment-list.tsx # <DataTable> (ui) + hook
  components/appointment-form.tsx # React Hook Form + zod schema (api)
```

**(4)** Route: `apps/clinic/src/routes/appointments.tsx` render `<AppointmentList>`.

**(5)** Test: co-locate, test hành vi (list đúng, form validate đúng).

---

## 2. Update / fix bug feature có sẵn

Ví dụ: *"Fix bug: tạo lịch hẹn bị sai timezone"*.

### Phase A — AI hiểu feature trước khi sửa (không sửa ngay)

Đọc hiểu qua 5 nguồn (nhờ feature-slice, mọi thứ nằm gần nhau):

```
1. CLAUDE.md gần nhất   → apps/clinic/CLAUDE.md
2. Feature slice        → apps/clinic/src/features/appointments/**
3. Data contract        → packages/api/.../appointment*   (schema Zod)
4. Test                 → *.test.ts   (đặc tả hành vi đúng)
5. Lịch sử              → git log của path + docs/changes/*appointments*
```

Lệnh AI thường chạy:
```bash
grep -r appointment apps/clinic/src packages/api/src   # khoanh vùng
git log -p -- apps/clinic/src/features/appointments     # thay đổi gần đây
find docs/changes -name '*appointments*'                # note cũ = "vì sao code như vậy"
```

### Phase B — Sửa xong, có cần change note không?

```
Thay đổi này…
├─ Thêm/đổi business logic, API contract, DB schema?        → CÓ  (feat/refactor/db)
├─ Bug fix impact lớn HOẶC nguyên nhân KHÔNG hiển nhiên?    → CÓ  (fix)
└─ Fix < 10 dòng, nguyên nhân rõ, UI tweak/typo?           → KHÔNG (chỉ commit message tốt)
```

Bug timezone: nguyên nhân không hiển nhiên + ảnh hưởng mọi lịch hẹn → **CÓ tạo note**.

### Cách viết change note

File: `docs/changes/<year>/YYYYMMDD_<type>_<slug>.md` (dựa trên `docs/changes/TEMPLATE.md`;
archive theo năm). **Slug luôn chứa tên feature** để tra lịch sử bằng 1 lệnh:
`find docs/changes -name '*appointments*'`.

Ví dụ `docs/changes/2026/20260816_fix_appointments-timezone.md`:
```markdown
# fix: appointment created with wrong timezone

- Date: 2026-08-16
- Type: fix
- Workspaces touched: packages/api, apps/clinic
- Related ADR: —

## What changed
- createAppointment() gửi local time → chuẩn hoá sang UTC (ISO) trước khi gọi API.
- appointment-form.tsx convert input về UTC bằng date-fns.

## How to verify
- Tạo lịch 09:00; API nhận đúng UTC; đổi timezone máy vẫn đúng.

## Notes
- Bug do quên chuẩn hoá timezone khi submit. Đã thêm test timezone.
```

Note chứa **what changed + how to verify**, KHÔNG chứa trade-off (cái đó để ADR).

---

## Guardrail — chạy ở bước (6) và khi commit

| Lỗi hay gặp                              | Ai bắt                | Khi nào       |
| ---------------------------------------- | --------------------- | ------------- |
| `any`, biến thừa                         | `type-check` + ESLint | bước 6        |
| Deep import `@petcare/ui/src/...`        | ESLint boundary       | bước 6        |
| App import app (clinic ↔ admin)          | ESLint boundary       | bước 6        |
| Gọi `axios`/`fetch` thẳng trong component | quy ước + review      | bước 6/review |
| Format lệch                              | Prettier              | bước 6 & commit |
| Commit code bẩn                          | husky pre-commit      | commit        |

Guardrail đỏ → AI tự sửa trong vòng lặp rồi chạy lại. **Không** bypass bằng `--no-verify`.

---

## AI báo cáo lại thế nào

Sau mỗi feature/fix, AI tóm tắt: file nào tạo/đổi ở package nào, guardrail pass/fail (kèm
output thật), change note đã tạo (nếu có), và cần bạn quyết gì (vd. đẩy component lên `ui`
hay giữ trong app). AI **không tự commit** khi bạn chưa yêu cầu.

---

## Xem thêm

- `.claude/rules/boundaries.md` — luật import (máy enforce)
- `.claude/rules/api-conventions.md` — data fetching, TanStack Query, tenancy
- `.claude/rules/documentation.md` — khi nào ADR vs change note
- `docs/changes/TEMPLATE.md`, `docs/adr/TEMPLATE.md`
