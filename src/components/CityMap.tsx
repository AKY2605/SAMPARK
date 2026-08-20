import { Issue, IssueStatus } from '../types';

const markerColor: Record<IssueStatus, string> = {
  pending: '#D97706',
  assigned: '#0284C7',
  'in-progress': '#0284C7',
  resolved: '#16A34A',
  'sla-breached': '#DC2626',
};

interface Props {
  issues: Issue[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
}

export default function CityMap({ issues, selectedId, onMarkerClick }: Props) {
  return (
    <div className="relative w-full h-full bg-[#E4ECF4] overflow-hidden rounded-xl">
      <svg
        viewBox="0 0 500 340"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Base background */}
        <rect width="500" height="340" fill="#E4ECF4" />

        {/* City boundary polygon */}
        <polygon
          points="55,38 445,28 468,278 418,316 78,322 28,275"
          fill="#EEF2F7"
          stroke="#C5D0DC"
          strokeWidth="1.5"
        />

        {/* Green spaces */}
        <rect x="318" y="42" width="72" height="54" fill="#C5D9A2" rx="4" />
        <text x="354" y="69" fill="#567A2E" fontSize="7" fontFamily="Inter,sans-serif" textAnchor="middle">Parade Ground</text>

        <rect x="52" y="188" width="56" height="44" fill="#C5D9A2" rx="4" />
        <text x="80" y="212" fill="#567A2E" fontSize="7" fontFamily="Inter,sans-serif" textAnchor="middle">City Park</text>

        {/* Sai River */}
        <path
          d="M0,288 C60,278 140,295 220,285 C300,275 380,290 460,280 L500,278 L500,308 C460,318 380,308 300,315 C220,322 140,312 60,318 Z"
          fill="#A8C8DF"
          opacity="0.75"
        />
        <text x="190" y="301" fill="#3E6E8A" fontSize="8" fontFamily="Inter,sans-serif" fontStyle="italic">Sai Nadi →</text>

        {/* City blocks */}
        <rect x="82" y="55" width="90" height="62" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="192" y="50" width="112" height="56" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="82" y="162" width="76" height="58" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="172" y="170" width="124" height="52" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="312" y="160" width="102" height="68" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="82" y="242" width="82" height="38" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="182" y="245" width="112" height="34" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />
        <rect x="312" y="248" width="102" height="32" fill="#DCE4EE" rx="3" stroke="#C5D0DC" strokeWidth="0.5" />

        {/* Main roads */}
        <line x1="0" y1="152" x2="500" y2="152" stroke="#B8C8D8" strokeWidth="5" />
        <line x1="248" y1="0" x2="248" y2="340" stroke="#B8C8D8" strokeWidth="5" />

        {/* Secondary roads */}
        <line x1="82" y1="0" x2="82" y2="340" stroke="#C2CDD9" strokeWidth="2.5" />
        <line x1="312" y1="0" x2="312" y2="340" stroke="#C2CDD9" strokeWidth="2.5" />
        <line x1="418" y1="0" x2="418" y2="340" stroke="#C2CDD9" strokeWidth="2.5" />
        <line x1="0" y1="68" x2="500" y2="68" stroke="#C2CDD9" strokeWidth="2.5" />
        <line x1="0" y1="232" x2="500" y2="232" stroke="#C2CDD9" strokeWidth="2.5" />

        {/* Diagonal connector roads */}
        <line x1="82" y1="68" x2="248" y2="152" stroke="#C2CDD9" strokeWidth="2" />
        <line x1="418" y1="152" x2="500" y2="232" stroke="#C2CDD9" strokeWidth="2" />

        {/* Road labels */}
        <text x="90" y="147" fill="#8898AA" fontSize="7" fontFamily="Inter,sans-serif">Civil Lines Rd</text>
        <text x="253" y="110" fill="#8898AA" fontSize="7" fontFamily="Inter,sans-serif">Station Rd</text>

        {/* Area labels */}
        <text x="128" y="88" fill="#6A7A8A" fontSize="7.5" fontFamily="Inter,sans-serif" textAnchor="middle">Collectorate</text>
        <text x="248" y="76" fill="#6A7A8A" fontSize="7.5" fontFamily="Inter,sans-serif" textAnchor="middle">Govt. College</text>
        <text x="100" y="196" fill="#6A7A8A" fontSize="7.5" fontFamily="Inter,sans-serif" textAnchor="middle">Bus Stand</text>
        <text x="234" y="198" fill="#6A7A8A" fontSize="7.5" fontFamily="Inter,sans-serif" textAnchor="middle">Market Road</text>
        <text x="363" y="200" fill="#6A7A8A" fontSize="7.5" fontFamily="Inter,sans-serif" textAnchor="middle">Civil Lines</text>

        {/* Issue markers */}
        {issues.map((issue) => {
          const cx = (issue.mapX / 100) * 500;
          const cy = (issue.mapY / 100) * 340;
          const fill = markerColor[issue.status];
          const isSelected = issue.id === selectedId;
          const isCritical = issue.status === 'sla-breached';

          return (
            <g
              key={issue.id}
              onClick={() => onMarkerClick?.(issue.id)}
              style={{ cursor: 'pointer' }}
            >
              {isCritical && (
                <>
                  <circle cx={cx} cy={cy} r="14" fill={fill} opacity="0">
                    <animate attributeName="r" from="8" to="20" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.35" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {isSelected && (
                <circle cx={cx} cy={cy} r="13" fill="none" stroke={fill} strokeWidth="2.5" opacity="0.5" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 9 : 7}
                fill={fill}
                stroke="white"
                strokeWidth="1.5"
              />
              <circle cx={cx} cy={cy} r="2" fill="white" opacity="0.9" />
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 text-[9px] text-slate-400 bg-white/70 px-1.5 py-0.5 rounded">
        Demo Map · Pratapgarh, UP
      </div>
    </div>
  );
}
