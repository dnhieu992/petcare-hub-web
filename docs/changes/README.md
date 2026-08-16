# Change Notes — Index

Ghi lại **cái gì thay đổi** trong mỗi feature/fix (không chứa trade-off — cái đó ở `../adr/`).

## Quy ước

- Đường dẫn: `docs/changes/<year>/YYYYMMDD_<type>_<slug>.md`
  - Ví dụ: `docs/changes/2026/20260816_fix_appointments-timezone.md`
- **Archive theo năm** để thư mục không phình khó tìm. Mỗi năm một folder.
- **Slug luôn chứa tên feature** để tra lịch sử của feature bằng một lệnh.
- Dùng `../changes/TEMPLATE.md` làm khung.
- Types: `feat`, `fix`, `refactor`, `perf`, `infra`, `db`.

## Khi nào tạo / không tạo

Xem `.claude/rules/documentation.md`. Tóm tắt: tạo khi có business logic mới, đổi API/DB
contract, refactor nhiều module, hoặc bug fix impact lớn / nguyên nhân không hiển nhiên.
Không tạo cho typo, đổi dep, fix nhỏ nguyên nhân rõ.

## Tra cứu

```bash
# Toàn bộ lịch sử của một feature (mọi năm):
find docs/changes -name '*appointments*'

# Mọi thay đổi trong năm 2026:
ls docs/changes/2026/

# Tìm theo nội dung:
grep -rl "timezone" docs/changes/
```

> Đây là loại doc **tra-cứu-khi-cần** (không nạp vào context AI mỗi lần), nên cứ để lớn
> thoải mái — chỉ cần archive theo năm cho người dễ tìm.

## Lưu ý migrate

Theo `.claude/rules/documentation.md`, change notes có thể migrate sang GitHub Wiki khi
số lượng lớn. ADR (`../adr/`) thì luôn giữ trong repo.
