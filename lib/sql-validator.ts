export interface ValidationResult {
  isCorrect: boolean;
  message: string;
  diffType?: 'row_count' | 'columns' | 'values' | 'none';
}

export function validateQueryResult(
  actual: { columns: string[]; rows: (string | number | boolean | null)[][] },
  expected: { columns: string[]; rows: (string | number | boolean | null)[][] },
  requiresStrictOrder = false
): ValidationResult {
  // 1. Column Count Check
  if (actual.columns.length !== expected.columns.length) {
    return {
      isCorrect: false,
      diffType: 'columns',
      message: `Column count mismatch: expected ${expected.columns.length} columns, got ${actual.columns.length}.`,
    };
  }

  // 2. Row Count Check
  if (actual.rows.length !== expected.rows.length) {
    return {
      isCorrect: false,
      diffType: 'row_count',
      message: `Row count mismatch: expected ${expected.rows.length} rows, got ${actual.rows.length}.`,
    };
  }

  // 3. Row Data Equivalence (Multiset comparison)
  const serializeRow = (row: (string | number | boolean | null)[]) =>
    row.map((val) => (val === null ? 'null' : String(val).trim().toLowerCase())).join('||');

  if (requiresStrictOrder) {
    for (let i = 0; i < expected.rows.length; i++) {
      if (serializeRow(actual.rows[i]) !== serializeRow(expected.rows[i])) {
        return {
          isCorrect: false,
          diffType: 'values',
          message: `Row ${i + 1} does not match expected ordering or values.`,
        };
      }
    }
  } else {
    const expectedCount = new Map<string, number>();
    for (const r of expected.rows) {
      const s = serializeRow(r);
      expectedCount.set(s, (expectedCount.get(s) || 0) + 1);
    }

    for (const r of actual.rows) {
      const s = serializeRow(r);
      const count = expectedCount.get(s) || 0;
      if (count === 0) {
        return {
          isCorrect: false,
          diffType: 'values',
          message: `Returned rows do not match the expected dataset.`,
        };
      }
      expectedCount.set(s, count - 1);
    }
  }

  return { isCorrect: true, message: 'Correct! Query output matches expected result.', diffType: 'none' };
}
