/**
 * Rexer Micro-Tools — tool registry.
 *
 * Maps each tool slug to a component. Imports ALL tools from a small set of
 * consolidated files (tools-part1/2/3) plus the 3 original MVP files, giving
 * you ~78 working tools with ZERO new dependencies.
 */
import { createElement } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Original MVP tools (already on the repo as separate files).
const PasswordGenerator = dynamic(() => import("@/components/tools/PasswordGenerator"));
const ImageConverter = dynamic(() => import("@/components/tools/ImageConverter"));
const WhatsAppGenerator = dynamic(() => import("@/components/tools/WhatsAppGenerator"));

// Consolidated tool sets.
import * as P1 from "@/components/tools/tools-part1";
import * as P2 from "@/components/tools/tools-part2";
import * as P3 from "@/components/tools/tools-part3";

/** Wrappers for parameterized tools (no JSX — uses createElement). */
const wrap = (Comp: ComponentType<any>, props: Record<string, any> = {}) => {
  const C = () => createElement(Comp, props);
  C.displayName = `Wrapped(${Comp.displayName || Comp.name || "Component"})`;
  return C;
};

export const IMPLEMENTED_TOOLS: Record<string, ComponentType> = {
  // Original MVP
  "password-generator": PasswordGenerator,
  "image-converter": ImageConverter,
  "whatsapp-dm-generator": WhatsAppGenerator,

  // Text & docs (part1)
  "word-counter": P1.WordCounter,
  "case-converter": P1.CaseConverter,
  "find-and-replace": P1.FindAndReplace,
  "remove-duplicate-lines": P1.RemoveDuplicateLines,
  "sort-lines": P1.SortLines,
  "trim-whitespace": P1.TrimWhitespace,
  "remove-line-breaks": P1.RemoveLineBreaks,
  "extract-emails-urls": P1.ExtractEmailsUrls,
  "notepad": P1.Notepad,

  // Developer (part1)
  "json-formatter": P1.JsonFormatter,
  "json-validator": P1.JsonValidator,
  "json-to-csv": P1.JsonToCsv,
  "csv-to-json": P1.CsvToJson,
  "json-minifier": P1.JsonFormatter,
  "base64-encode-decode": P1.Base64EncodeDecode,
  "url-encode-decode": P1.UrlEncodeDecode,
  "html-entity-encoder": P1.HtmlEntityEncoder,
  "text-encoder-decoder": P1.TextEncoderDecoder,
  "css-minifier": wrap(P1.Minifier, { lang: "css", mode: "minify" }),
  "js-minifier": wrap(P1.Minifier, { lang: "js", mode: "minify" }),
  "js-beautifier": wrap(P1.Minifier, { lang: "js", mode: "beautify" }),
  "html-formatter": wrap(P1.Minifier, { lang: "html", mode: "beautify" }),
  "css-beautifier": wrap(P1.Minifier, { lang: "css", mode: "beautify" }),
  "regex-tester": P1.RegexTester,
  "uuid-generator": P1.UuidGenerator,
  "hash-generator": P1.HashGenerator,
  "jwt-decoder": P1.JwtDecoder,
  "token-counter": P1.TokenCounter,
  "cron-builder": P1.CronBuilder,
  "color-converter": P1.ColorConverter,

  // Converters (part2)
  "text-reverser": P2.TextReverser,
  "lorem-ipsum": P2.LoremIpsum,
  "random-text": P2.RandomText,
  "url-slug-generator": P2.UrlSlugGenerator,
  "number-formatter": P2.NumberFormatter,
  "base-converter": P2.BaseConverter,
  "unit-converter": P2.UnitConverter,
  "timezone-converter": P2.TimezoneConverter,
  "currency-converter": P2.CurrencyConverter,

  // Calculators / finance (part2)
  "percentage-calculator": P2.PercentageCalculator,
  "bmi-calculator": P2.BmiCalculator,
  "age-calculator": P2.AgeCalculator,
  "date-difference": P2.DateDifference,
  "compound-interest": P2.CompoundInterest,
  "loan-calculator": P2.LoanCalculator,
  "mortgage-calculator": wrap(P2.LoanCalculator, { labelPrincipal: "Home price", defaultYears: 30 }),
  "car-loan-calculator": wrap(P2.LoanCalculator, { labelPrincipal: "Car price", defaultYears: 5 }),
  "tip-calculator": P2.TipCalculator,
  "discount-calculator": P2.DiscountCalculator,
  "sales-tax": P2.SalesTax,
  "bill-splitter": P2.BillSplitter,
  "gpa-calculator": P2.GpaCalculator,
  "inflation-calculator": P2.InflationCalculator,
  "gas-cost-calculator": P2.GasCostCalculator,
  "random-number": P2.RandomNumber,
  "countdown-timer": P2.CountdownTimer,
  "stopwatch": P2.Stopwatch,
  "fake-data-generator": P2.FakeDataGenerator,
  "net-worth": P2.NetWorth,
  "savings-goal": P2.SavingsGoal,
  "debt-payoff": P2.DebtPayoff,
  "credit-card-payoff": wrap(P2.DebtPayoff, { label: "Card balance" }),
  "paye-tax": wrap(P2.PayeTax, { label: "Gross annual income" }),
  "paycheck-calculator": P2.PayeTax,
  "barcode-generator": P2.BarcodeGenerator,

  // Generators / productivity (part3)
  "username-generator": P3.UsernameGenerator,
  "business-name-generator": P3.BusinessNameGenerator,
  "random-name-picker": P3.RandomNamePicker,
  "coin-flip": P3.CoinFlip,
  "spin-wheel": P3.SpinWheel,
  "to-do-list": P3.ToDoList,
  "habit-tracker": P3.HabitTracker,
  "typing-test": P3.TypingTest,
  "emoji-picker": P3.EmojiPicker,
  "fancy-text": P3.FancyText,

  // Media (part3)
  "image-compressor": P3.ImageCompressor,
  "image-resizer": P3.ImageResizer,
  "image-rotator": P3.ImageRotator,
  "image-flip": P3.ImageFlip,
  "image-grayscale": P3.ImageGrayscale,
  "image-round-corners": P3.ImageRoundCorners,
  "image-to-base64": P3.ImageToBase64,
  "color-picker-from-image": P3.ColorPickerFromImage,
  "png-to-jpg": P3.PngToJpg,
  "image-watermark": P3.ImageWatermark,

  // SEO (part3)
  "meta-og-generator": P3.MetaOgGenerator,
  "robots-txt-generator": P3.RobotsTxtGenerator,
  "sitemap-generator": P3.SitemapGenerator,
  "keyword-density": P3.KeywordDensity,
};

export const SOCIAL_DOWNLOADERS: Record<string, string> = {};
export const IMPLEMENTED_SLUGS = new Set(Object.keys(IMPLEMENTED_TOOLS));
