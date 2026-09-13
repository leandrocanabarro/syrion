---
name: filament-livewire
description: >
  How to build UI in this org's Laravel apps with Filament panels, Livewire,
  Alpine, and Blade/Tailwind. Use when creating or changing Filament resources,
  Livewire components, or server-rendered Blade views/layouts.
license: MIT
---

# filament-livewire

UI playbook for Laravel's server-driven front end. The Filament/Livewire analog
of `frontend-react`.

## When to use

- Creating/changing Filament resources, panels, forms, tables, or actions.
- Creating/changing standalone Livewire components or Blade views/layouts.

Not for: page/screen UX decisions (`frontend-design` principles still apply
conceptually) or PHP typing conventions (`php-standards`).

## Filament resources & panels

- Model the resource around the Eloquent model; keep form/table schema
  declarative (Filament's fluent builders) rather than embedding business logic
  in closures — call an action/service instead (`backend-laravel`).
- Authorization: rely on the model's **Policy**; Filament reads it
  automatically — don't duplicate ability checks in the resource.
- Use Filament's validation (`->required()`, `->rules()`) for form-level
  constraints; defer cross-field/business validation to a Form Request or
  action.
- Keep panel-specific resources under the panel's namespace (e.g.
  `App/Filament/<Panel>`) — don't share resource classes across panels/guards.

## Livewire components

- Type public properties; validate with Livewire's `rules()`/`#[Validate]`
  before acting on them — treat them as external input.
- Keep components focused: one clear responsibility per component. Extract
  business logic to an action/service rather than inlining it in the component.
- Emit events for cross-component communication instead of reaching into
  sibling component state.

## Blade & styling

- Use Blade components (`resources/views/components`) for reusable markup;
  co-locate simple layout logic in the component class.
- Tailwind utility classes directly in Blade; extract a component when a pattern
  repeats rather than duplicating class lists.
- Alpine (`x-data`, `x-on`) for small client-side interactivity that doesn't
  need a full Livewire round trip; don't reach for Alpine for state that belongs
  server-side.

## States

- Handle loading (`wire:loading`), empty, and error/validation states explicitly
  in every form/table — not just the happy path.

## Accessibility

- Semantic elements, labeled inputs (`<label for>` or Filament's built-in
  labels), keyboard-operable interactive elements — same bar as `frontend-react`.

## Testing

- Every Livewire component/Filament resource flow gets a test via
  `Livewire::test(...)` (`laravel-testing`).

## Dependencies

- `backend-laravel`, `laravel-testing`, `php-standards`, `code-quality`.

## Validation

- [ ] Business logic delegated to actions/services, not resource/component closures.
- [ ] Authorization via Policies; no duplicated ability checks.
- [ ] Public Livewire properties validated before use.
- [ ] Loading/empty/error/validation states handled explicitly.
