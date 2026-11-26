# IM-X-00 — foundations, isolated from RC1

Baseline 5b301a7db38869d27ada808e9434cf1fc71b677c, PR #2 draft; QA #53 159 total, artifact 15076956065, manifest 15076697099. No production merge or deployment. No real user data. Comparison against panda 945b7a59ea8f0f23d92008f23144009811f53456 returned 50 changed paths (not exhaustive repository inventory):
- .github/workflows/creator-qa.yml
- .github/workflows/editorial-check.yml
- .github/workflows/trend-discovery.yml
- README.md
- data/editorial-snapshot.json
- data/source-baseline.json
- data/trend-snapshot.json
- docs/release-candidate-v1.md
- e2e/creator.spec.js
- index.html
- package-lock.json
- package.json
- playwright.config.js
- scripts/check-sources.mjs
- scripts/discover-trends.py
- scripts/release-check.mjs
- scripts/release-references.mjs
- src/AcademyTracks.jsx
- src/AdaptiveRoute.jsx
- src/App.jsx
- src/CashCenter.jsx
- src/EditorialMonitor.jsx
- src/EntityCard.jsx
- src/FilePicker.jsx
- src/FinancePlanner.jsx
- src/Mentor.jsx
- src/OpportunityCenter.jsx
- src/PromptMaster.jsx
- src/ProposalEditor.jsx
- src/TrendRadar.jsx
- src/academy-tracks.js
- src/adaptive-core.js
- src/cash-core.js
- src/creator-core.js
- src/editorial-core.js
- src/editorial-review.js
- src/finance-core.js
- src/index.css
- src/learning-resources.js
- src/mentor-core.js
- src/method-guides.js
- src/opportunity-core.js
- src/prompt-master.js
- src/proposal-core.js
- src/research-core.js
- src/trend-core.js
- src/workspace-backup.js
- tests/creator-core.test.js
- tests/release-check.test.js
- tests/test_discover_trends.py

## X00-T01 inventory and boundaries
App.jsx is the existing UI/state composition; workspace-backup.js canonicalizes the main JSON. creator-core + method-guides + academy-tracks + learning-resources + adaptive-core supply education, method IDs and routes. opportunity/proposal/cash/finance cores contain financial/business logic. research/trend/editorial cores and checked-in snapshots provide evidence; Python/Node collectors run separately in CI. prompt-master and mentor-core provide prompt generation and optional provider integration. No backend, account system, network executor, persistent media store or synchronization. Dependencies remain React, Bootstrap, Framer Motion, icons; Vite/Playwright dev tools. Theme, radar and editorial imports are separate keys, not covered by main backup. Existing ID scopes must not be changed during migration.

## X00-T02 versioned workspace contract
workspace-envelope.js is pure preparation, not wired to UI. Separate key reserved; source remains untouched, original raw retained in migration result, normalizationChanged reports any semantic change; known fields are normalized by RC1 validator. Unknown legacy fields may be omitted in normalized view but remain in original; require review and explicit backup before any future persistence. Canonical envelope rejects unknown/future schema and silent normalization; rollback returns normalized RC1 JSON, exact original remains separately available. 10 MB UTF-8 max, not quota guarantee. Typed entity refs preserve existing IDs and namespace. Experiment/resource IDs future; no new entities instantiated. LocalStorage suitable for bounded metadata only; IndexedDB candidate for blobs/structured data, quota/eviction and browser support must be measured; filesystem optional and permission-based; hosted storage deferred (cost/privacy). Media not stored yet.

## X00-T03 capability policy
Pure deny-by-default preflight for explicit local zero-centavo operations, synthetic/public/personal local only; secret, network, unknown, paid, external all denied. Not a runtime security boundary; no network actions or provider credentials permitted. A later server or connector enforcement layer must bind real action, provider, identity, data class, consent, budget and idempotency to execution; untrusted content cannot grant permission. No data classification inferred from input, no telemetry. No browser key storage. No modification of RC1 App, package, workflows or storage.

## Validation
New isolated workflow runs npm test (Node built-ins only) on this branch. No dependency install, external provider or multimedia. X00-T01 through T03 candidate only until QA; no browser claim. T04 audit/provenance/idempotency and T05 benchmark pending. Future integration requires UI migration preview, durable original backup, transaction/rollback tests and full regression. No launch declaration.
