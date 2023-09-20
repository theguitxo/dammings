// MODELS
export interface DammingsInfo {
  id?: string;
  dia: string;
  estaci: string;
  nivell_absolut: string;
  percentatge_volum_embassat: string;
  volum_embassat: string;
};

export interface ErrorData {
  title?: string;
  message?: string;
};

export interface HorizontalLine {
  y: number;
  x1: number;
  x2: number;
  yText: number;
  xText: number;
  text: string;
};

export interface VerticalLine {
  xLine: number;
  text: string;
};

export interface ValuePoint {
  cx: number;
  cy: number;
};

export interface ValueLine {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export interface ValueTooltip {
  x: number;
  y: number;
  text: string;
  show: boolean;
};

export interface HorizontalLinesValues {
  totalItems: number;
  init: number;
  end: number;
  gapInitEnd: number;
  chartGap: number;
  chartLabels: string[];
};

export interface HistoricDataTableRow {
  date: string,
  percentage: number,
  percentageFormatted: string;
  diffPercentage: number | null;
  diffPercentageFormatted: string;
  diffPercentageIsNegative: boolean;
  volume: number;
  volumeFormatted: string;
  diffVolume: number | null;
  diffVolumeFormatted: string;
  diffVolumeIsNegative: boolean;
};

// CONSTANTS

export enum LANGUAGES {
  ENGLISH = 'en',
  SPANISH = 'es',
  CATALAN = 'ca'
};
