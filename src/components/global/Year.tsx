"use client";

import { useEffect, useState } from "react";

/** Copyright year. Updates after load so a cached page doesn't keep last year's date. */
export default function Year() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span id="year">{year}</span>;
}
