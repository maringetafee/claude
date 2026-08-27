import { Fragment } from "react";

/** Splits on literal "\n" and renders each segment on its own line — lets
 * config titles opt into a stacked editorial headline without any markup. */
export function renderLines(text: string) {
  const parts = text.split("\n");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ));
}
