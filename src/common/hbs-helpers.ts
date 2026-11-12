import type hbs from 'hbs';

type HelperOptions = { fn: (context: unknown) => string };

/** Helpers used by the templates under /views. */
export function registerHbsHelpers(engine: typeof hbs) {
  // 237000 -> "237,000" (same output as PHP's number_format)
  engine.registerHelper('number_format', (value: unknown) =>
    Number(value ?? 0).toLocaleString('en-US'),
  );

  engine.registerHelper('json', (value: unknown) => JSON.stringify(value ?? null));

  // {{#times 5}}...{{/times}} repeats the block, `this` is the 1-based index.
  engine.registerHelper('times', (count: number, options: HelperOptions) => {
    let out = '';
    for (let i = 1; i <= count; i++) out += options.fn(i);
    return out;
  });

  engine.registerHelper('rand', (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  );
}
