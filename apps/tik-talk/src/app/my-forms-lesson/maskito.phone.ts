import type { MaskitoOptions } from '@maskito/core';

export default {
  mask: [
    '+',
    '7',
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
} satisfies MaskitoOptions;
