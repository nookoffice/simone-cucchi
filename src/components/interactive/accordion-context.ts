"use client";

import { createContext } from "react";

export type AccordionGroup = {
  name?: string;
  open: boolean;
};

export const AccordionContext = createContext<AccordionGroup>({ open: false });
