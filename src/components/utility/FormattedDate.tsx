import { SITE_LOCALE } from "@/consts";
import { isDev } from "@/utils/dev";

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Date to format. */
  date: Date;
  /** BCP 47 locale. Defaults to `SITE_LOCALE`. */
  locale?: string;
  /** IANA time zone. Defaults to `UTC`. */
  timeZone?: string;
  /** `Intl.DateTimeFormat` options. Defaults to long date style. */
  format?: Intl.DateTimeFormatOptions;
};

export default function FormattedDate({
  render = true,
  date,
  locale = SITE_LOCALE,
  timeZone = "UTC",
  format = { dateStyle: "long" },
}: Props) {
  const isValid = date instanceof Date && !Number.isNaN(date.getTime());

  if (isDev && !isValid) {
    console.warn(
      "[lumos] <FormattedDate> rendered without a valid `date`; nothing was output.",
    );
  }

  if (!render || !isValid) return null;

  const formatted = new Intl.DateTimeFormat(locale, { ...format, timeZone }).format(date);
  return <time dateTime={date.toISOString()}>{formatted}</time>;
}
