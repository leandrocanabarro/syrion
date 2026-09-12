---
name: php-standards
description: >
  Cross-cutting PHP/Laravel conventions: strict typing, Pint style, Larastan/
  PHPStan level, enums, and safe patterns. Use when writing or reviewing PHP and
  deciding how to type a class, method, or data shape in a Laravel project.
license: MIT
---

# php-standards

Shared PHP conventions across a Laravel codebase. The PHP analog of
`typescript-standards`.

## When to use

- Writing or reviewing any PHP in a Laravel project; deciding how to type a
  class, method, or model attribute.

## Strictness

- `declare(strict_types=1);` at the top of every new PHP file.
- Type every method signature: parameters, return types (including `void`,
  nullable `?Type`, and union types where PHP 8.4 allows). No untyped params.
- Run **Larastan/PHPStan** at the project's configured level (see
  `phpstan.neon`); do not add baseline ignores to silence new errors.

## Models & casts

- Use classic array properties (`$fillable`, `$hidden`, `$casts`) unless the
  project has explicitly adopted PHP attribute-based casts — match the existing
  convention in the codebase, don't introduce a second style.
- Add `@property` PHPDoc annotations for enum-backed and date-cast attributes so
  Larastan infers their type (it does not read a `casts()` method for property
  types).
- String-backed **enums** for finite sets (status, type, tier), each with a
  `label(): string` method for display.

## Style

- Format with **Pint** (`./vendor/bin/pint`); do not hand-format around it.
- Match existing naming: `PascalCase` classes, `camelCase` methods/properties,
  `snake_case` database columns.

## Safety patterns

- Prefer typed value objects/DTOs over associative arrays for structured data
  crossing a boundary (see `backend-laravel`).
- Avoid `mixed` unless the value is genuinely polymorphic; narrow with
  `instanceof`/`match` rather than casting.
- Null-safety: use nullable types and the `?->` operator explicitly; avoid
  suppressing errors with `@`.

## Dependencies

- Applies alongside every other Laravel skill; pairs with `code-quality`.

## Validation

- [ ] `declare(strict_types=1)`; all signatures typed.
- [ ] PHPStan/Larastan passes at the configured level with no new baseline entries.
- [ ] Enum-backed/cast attributes documented with `@property` where needed.
- [ ] Pint formatting applied; no hand-formatting drift.
