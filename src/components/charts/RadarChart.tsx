import React from "react";
import { DimensionScores } from "../../types";

interface RadarChartProps {
  dimensiones: DimensionScores;
  color?: string;
  fillColor?: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensiones,
  color = "#3B8AC4",
  fillColor = "rgba(59, 138, 196, 0.22)",
  size = 300
}) => {
  const categories: (keyof DimensionScores)[] = [
    "Almacenamiento y Fuentes",
    "Integración entre Áreas",
    "Frecuencia de Actualización",
    "Calidad y Consistencia",
    "Eficiencia de Reportes"
  ];

  const totalAxes = categories.length;
  const padX = 78;
  const padY = 24;
  const viewWidth = size + padX * 2;
  const viewHeight = size + padY * 2;
  const cx = viewWidth / 2;
  const cy = viewHeight / 2;
  const maxRadius = size / 2 - 44;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const clamped = Math.min(100, Math.max(0, value));
    const r = (clamped / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const levels = [25, 50, 75, 100];

  const points = categories
    .map((cat, i) => {
      const val = dimensiones[cat] ?? 0;
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(" ");

  const accessibleSummary = categories
    .map((cat) => `${cat}: ${dimensiones[cat] ?? 0}%`)
    .join(", ");

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#E4ECF2] shadow-xs w-full">
      <svg
        role="img"
        aria-label={`Gráfico radar de madurez por dimensión. ${accessibleSummary}`}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full max-w-[400px] h-auto"
      >
        <title>{`Perfil de madurez por dimensión: ${accessibleSummary}`}</title>

        {/* Background concentric polygons */}
        {levels.map((level) => {
          const ringPoints = categories
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <g key={level}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#E4ECF2"
                strokeWidth="1"
                strokeDasharray={level === 100 ? undefined : "3,3"}
              />
              <text
                x={cx + 4}
                y={cy - (level / 100) * maxRadius + 3}
                className="text-[10px] font-mono tabular-nums fill-slate-600 font-medium"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axis radial lines */}
        {categories.map((cat, i) => {
          const outer = getCoordinates(i, 100);
          return (
            <line
              key={cat}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="#E4ECF2"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          fill={fillColor}
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Points and Labels */}
        {categories.map((cat, i) => {
          const val = dimensiones[cat] ?? 0;
          const { x, y } = getCoordinates(i, val);

          const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
          const labelDist = maxRadius + 20;
          const labelX = cx + labelDist * Math.cos(angle);
          const labelY = cy + labelDist * Math.sin(angle);

          const textAnchor =
            Math.abs(Math.cos(angle)) < 0.2
              ? "middle"
              : Math.cos(angle) > 0
              ? "start"
              : "end";

          return (
            <g key={`data-${cat}`}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={color}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-[11px] font-medium fill-[#1E252D] pointer-events-none select-none font-['Outfit']"
              >
                {cat.split(" ")[0]}{" "}
                <tspan className="font-mono tabular-nums fill-[#2C6E9E] font-semibold">
                  ({val}%)
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[11px] text-slate-600 font-medium mt-1 font-['Inter']">
        Escala de preparación por dimensión (0 a 100%)
      </div>
    </div>
  );
};
