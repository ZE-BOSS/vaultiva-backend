import { Injectable, PipeTransform } from '@nestjs/common';

/**
 * Coerces a pagination query parameter to a sane positive integer.
 *
 * Needed because of a pipe-ordering trap. The global `ValidationPipe` runs with
 * `transform: true` and `enableImplicitConversion: true`, and its
 * `transformPrimitive` step does `+value` for any parameter typed `number`. For
 * an absent query string that is `+undefined`, i.e. `NaN` — so a TypeScript
 * default like `@Query('page') page: number = 1` never applies, and `NaN` reached
 * TypeORM as `skip`, which threw:
 *
 *     TypeORMError: Provided "skip" value is not a number.
 *
 * Every paginated list endpoint failed with a 500 unless the caller passed
 * `?page=&limit=` explicitly. `DefaultValuePipe` cannot fix it either: global
 * pipes run before parameter pipes, so by the time it sees the value it is `NaN`
 * rather than `undefined`.
 *
 * This pipe runs as a parameter pipe, after the global one, and simply replaces
 * anything non-finite with the fallback.
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform {
  constructor(
    private readonly fallback: number,
    private readonly max?: number,
  ) {}

  transform(value: unknown): number {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return this.fallback;
    const int = Math.floor(n);
    return this.max ? Math.min(int, this.max) : int;
  }
}
