import { Card } from "primereact/card";

export default function MetricCard({ title, value, icon, subtitle }) {
  return (
    <Card className="h-full">
      <div className="flex align-items-center justify-content-between gap-3">
        <div>
          <div className="metric-label">{title}</div>
          <div className="metric-value">{value ?? "-"}</div>
          {subtitle && <div className="text-sm text-color-secondary mt-2">{subtitle}</div>}
        </div>

        {icon && (
          <div
            className="flex align-items-center justify-content-center border-circle"
            style={{
              width: "3rem",
              height: "3rem",
              background: "var(--surface-ground)",
            }}
          >
            <i className={`pi ${icon} text-xl`} />
          </div>
        )}
      </div>
    </Card>
  );
}