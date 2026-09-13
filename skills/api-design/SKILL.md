---
name: api-design
description: >
  Conventions for designing HTTP APIs in this org: resource modeling, REST
  conventions, status codes, error shape, pagination, and versioning. Use when
  designing or changing an HTTP endpoint or its request/response contract.
license: MIT
---

# api-design

Design consistent, predictable HTTP APIs. Pairs with `backend-nodejs` for the
implementation.

## When to use

- Adding or changing an endpoint, request/response schema, or error contract.

## REST conventions

- Model **resources** (nouns), not actions: `/orders`, `/orders/{id}`.
- Methods: `GET` (read, safe), `POST` (create), `PUT`/`PATCH` (replace/update),
  `DELETE` (remove). Keep them idempotent where the spec requires.
- Use plural collection names and hierarchical paths for relations
  (`/orders/{id}/items`).

## Status codes

| Situation                    | Code                         |
| ---------------------------- | ---------------------------- |
| Success (read/update)        | `200`                        |
| Created                      | `201` (+ `Location`)         |
| Accepted (async)             | `202`                        |
| No content                   | `204`                        |
| Validation / bad input       | `400`                        |
| Unauthenticated              | `401`                        |
| Unauthorized                 | `403`                        |
| Not found                    | `404`                        |
| Conflict                     | `409`                        |
| Unprocessable                | `422`                        |
| Server error                 | `500`                        |

## Error shape

Use one consistent error body across the API:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [{ "field": "email", "issue": "required" }]
  }
}
```

- Stable machine-readable `code`; never leak stack traces or internal messages.

## Requests & responses

- Validate every request at the boundary (see `security-best-practices`).
- Return typed DTOs; do not expose internal/db models directly.
- **Pagination:** consistent strategy (cursor preferred for large sets); include
  page metadata. **Filtering/sorting:** documented query params.

## Versioning & compatibility

- Version via URL prefix (`/v1`) or header; pick one and keep it consistent.
- Additive changes are non-breaking; removing/renaming fields or changing types is
  breaking — version it and provide a migration path.

## Dependencies

- `backend-nodejs`, `typescript-standards`, `security-best-practices`.

## Validation

- [ ] Resource-oriented paths; correct methods and status codes.
- [ ] Single consistent error shape; no internal details leaked.
- [ ] Typed DTOs (no raw db models); pagination/filtering documented.
- [ ] Breaking changes versioned with a migration path.
