# PROJECT MASTER BRIEF — WTQ BUILD TRACK: UTILITY BILL DECODER

## 1. Your role

Act as a senior full-stack engineer, AI/LLM engineer, document-processing specialist, test engineer, and technical lead working on a time-constrained hackathon project.

Build a reliable AI-powered Pakistani electricity bill decoder that satisfies the official WTQ Build Track Participant Guide.

Do not start implementing every feature at once. Work phase by phase, inspect existing files before modifying them, and report results honestly.

## 2. Challenge objective

The application processes scanned images, screenshots, or photographs of electricity bills from:

- K-Electric
- LESCO
- IESCO

It must support tilted or imperfect images, layouts that differ by provider, partly Urdu content, and personal identifiers obscured by grey boxes.

There are two mandatory levels:

LEVEL 1 — EXTRACTION
Produce one complete JSON object per bill using the exact required schema.

LEVEL 2 — EXPLANATION
Answer all questions provided in the original level2.csv, grounded in the corresponding bill. Calculate numerical answers using deterministic code wherever possible.

The batch runner must generate the completed level1.csv and level2.csv files from the official templates without manually editing the results.

## 3. Mandatory competition rules

- Use only the permitted LLMs for model inference:
  - Gemini 3.5 Flash-Lite: gemini-3.5-flash-lite
  - Gemini 3.1 Flash-Lite: gemini-3.1-flash-lite
  
- Verify the selected model ID against the provider's available API configuration. Never silently substitute a different model.
- Local OCR and ordinary image-processing libraries are allowed.
- Do not use prohibited invoice or receipt extraction agents or services, including Azure prebuilt-invoice, Textract AnalyzeExpense, and Mindee.
- Disclose all AI models, APIs, services, and AI coding assistants used in README.md.
- Never commit API keys, a real .env file, or other secrets.
- Do not extract or return names, addresses, CNICs, account numbers, reference numbers, consumer numbers, or meter numbers.
- Preserve printed bill values. Do not recalculate or silently correct extracted financial values.
- Return null for unavailable, obscured, blank, or unreadable fields. Never guess.
- Preserve the original CSV headers, row order, IDs, question text, and row counts.
- The submission ZIP must not exceed 15 MB.

## 4. Required Level 1 schema

Every bill must return exactly these top-level fields:

{
  "provider": "KE | LESCO | IESCO",
  "tariff": null,
  "sanctioned_load_kw": null,
  "bill_month": null,
  "reading_date": null,
  "issue_date": null,
  "due_date": null,
  "previous_reading": null,
  "current_reading": null,
  "units_consumed": null,
  "charges": [],
  "total_charges": null,
  "taxes": [],
  "total_taxes": null,
  "current_bill": null,
  "arrears": null,
  "payable_within_due_date": null,
  "payable_after_due_date": null
}

Use the exact required types. The provider must be KE, LESCO, or IESCO when identifiable. Unknown values must be null. The charges and taxes collections must always be arrays, including when empty.

Charge types:
energy, fixed, fpa, quarterly_adjustment, surcharge, meter_rent, subsidy, other.

Tax types:
gst, electricity_duty, income_tax, municipal_tax, other_tax.

Include every non-zero charge or tax line separately. Do not merge repeated entries of the same type. Exclude blank and zero-valued lines. Negative credits and subsidies must retain the required negative sign.

Use YYYY-MM for bill_month and YYYY-MM-DD for dates. Use numeric values, not numeric strings. Remove currency symbols and thousands separators.

Classify tax entries by their printed section, not merely their labels. If the bill gives a combined tax amount without a breakdown, return an empty taxes array and preserve the combined value in total_taxes.

Use the highest amount if several post-due-date payable amounts are printed.

## 5. Required Level 2 behavior

Read the actual question text and question IDs from level2.csv. Do not invent, replace, reorder, or omit questions.

The official test template contains 10 bills and 12 questions per bill, giving 120 answer rows. The general implementation must also support the actual input files rather than hardcoding these counts.

Answers must:
- Be in English.
- Use only evidence available on the bill.
- Include correct calculations for counts, differences, averages, percentages, and estimates.
- Explicitly label estimates and explain their calculation.
- State when the required information is unavailable.
- Explain ambiguous interpretations or answer both reasonable interpretations.
- Exclude personal identifiers.

Use code for arithmetic and calculations. Use the LLM primarily for interpreting text, resolving context, and generating clear explanations from validated evidence.

## 6. Architecture

Maintain one shared processing engine that can be used by:

A. The web interface.
B. The standalone batch CLI that generates competition output.

Keep UI components separate from extraction, normalization, validation, calculations, CSV generation, and packaging.

Suggested modules:
- image preprocessing
- OCR adapter
- permitted LLM adapter
- Level 1 extraction
- schema validation
- evidence and intermediate representation
- deterministic calculations
- Level 2 answering
- CSV input/output
- batch orchestration
- output validation
- ZIP packaging

Do not introduce unnecessary services, databases, queues, or frameworks unless they solve a demonstrated requirement.

## 7. Engineering requirements

- Use TypeScript and Node.js 22+ unless the existing project or a documented requirement justifies another choice.
- Use strict typing and runtime validation.
- Handle malformed images, API errors, timeouts, rate limits, empty OCR output, malformed JSON, and missing fields.
- Retry transient failures with bounded exponential backoff and respect provider rate limits.
- Avoid duplicate LLM calls where safe caching can reduce cost.
- Log progress and failures without logging secrets or personal identifiers.
- Keep source bill images and extracted content out of public logs and URLs.
- Make the batch process restartable where practical.
- Use deterministic calculations and repeatable tests.
- Keep all required outputs reproducible from the original input files.

## 8. Working protocol

Before modifying code:
1. Inspect the repository, framework, scripts, and existing components.
2. Identify the current phase and what is already implemented.
3. Identify missing requirements and risks.
4. Propose a minimal implementation plan.

Then:
1. Implement only the approved phase.
2. Run the available checks.
3. Fix failures caused by your changes.
4. Summarize files changed and features completed.
5. List tests actually run and their real results.
6. List known issues and remaining requirements.
7. Recommend the next phase without implementing it automatically.

Do not claim a feature is complete unless it has been implemented and verified. Do not replace working code without a reason. Do not overwrite user changes or perform destructive operations without approval.

## 9. Definition of done

The final solution must:
- Extract all required Level 1 fields with the correct types.
- Answer every question from the supplied Level 2 template.
- Generate both CSV files using a real CSV library.
- Preserve all input identifiers, question text, and row order.
- Pass schema, CSV, completeness, and privacy checks.
- Run using documented commands on a clean environment.
- Include README.md, .env.example, and dependency lock files.
- Include an honest AI usage disclosure.
- Produce a valid submission ZIP of 15 MB or less.

Start by auditing the existing repository and proposing the project plan. Do not implement all phases in this initial step.