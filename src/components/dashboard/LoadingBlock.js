"use client";

import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingBlock() {
  return (
    <div className="card flex justify-content-center">
      <ProgressSpinner />
    </div>
  );
}