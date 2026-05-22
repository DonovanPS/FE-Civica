"use client";

export default function PowerBiDashboardTab() {
  return (
    <div className="card">


      <div className="powerbi-frame-container">
        <iframe
          title="civica_dashboard"
          src="https://app.powerbi.com/view?r=eyJrIjoiYzgyN2EyYmMtYzQ0NS00ZjcxLWE2Y2YtZTdiZjBhOTMxYzlmIiwidCI6ImUyNDhjMjFmLTAzYjMtNDcyOS1hZDIzLTVhZjM4NDRjNTc5YSIsImMiOjR9"
          frameBorder="0"
          allowFullScreen
          className="powerbi-frame"
        />
      </div>
    </div>
  );
}