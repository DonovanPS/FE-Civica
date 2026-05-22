export default function ConfusionMatrix({ matriz }) {
  if (!matriz?.matrix) {
    return <p className="text-color-secondary">No hay matriz de confusión disponible.</p>;
  }

  const matrix = matriz.matrix;

  return (
    <div className="confusion-grid">
      <div></div>
      <div className="confusion-cell confusion-header">Pred: No cumple</div>
      <div className="confusion-cell confusion-header">Pred: Cumple</div>

      <div className="confusion-cell confusion-header">Real: No cumple</div>
      <div className="confusion-cell">
        <div className="confusion-number">{matrix?.[0]?.[0] ?? 0}</div>
        <div className="text-sm text-color-secondary">TN</div>
      </div>
      <div className="confusion-cell">
        <div className="confusion-number">{matrix?.[0]?.[1] ?? 0}</div>
        <div className="text-sm text-color-secondary">FP</div>
      </div>

      <div className="confusion-cell confusion-header">Real: Cumple</div>
      <div className="confusion-cell">
        <div className="confusion-number">{matrix?.[1]?.[0] ?? 0}</div>
        <div className="text-sm text-color-secondary">FN</div>
      </div>
      <div className="confusion-cell">
        <div className="confusion-number">{matrix?.[1]?.[1] ?? 0}</div>
        <div className="text-sm text-color-secondary">TP</div>
      </div>
    </div>
  );
}