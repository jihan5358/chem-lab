import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './index.css';

const reagents = [
  { name: 'HCl', image: 'flask_red.png' },
  { name: 'NaOH', image: 'flask_blue.png' },
  { name: 'CuSO4', image: 'flask_green.png' },
  { name: 'NaCl', image: 'flask_silver.png' },
  { name: 'AgNO3', image: 'flask_darkgray.png' },
  { name: 'KI', image: 'flask_yellow.png' },
  { name: 'BaCl2', image: 'flask_purple.png' },
  { name: 'Pb(NO3)2', image: 'flask_orange.png' },
  { name: 'H2SO4', image: 'flask_black.png' },
  { name: 'NH3', image: 'flask_teal.png' }
];

// 반응 데이터 (키는 알파벳 정렬 기준)
const reactionData = {
  'AgNO3+KI': {
    text: '노란색 침전 생성 (AgI)',
    image: 'yellow_precipitate.png'
  },
  'AgNO3+NaCl': {
    text: '흰색 침전 생성 (AgCl)',
    image: 'white_precipitate.png'
  },
  'BaCl2+H2SO4': {
    text: '흰색 침전 생성 (BaSO4)',
    image: 'white_precipitate.png'
  },
  'CuSO4+NaOH': {
    text: '청록색 침전 생성 (Cu(OH)2)',
    image: 'blue_precipitate.png'
  },
  'CuSO4+NH3': {
    text: '암청색 착물 형성 ([Cu(NH₃)₄]²⁺)',
    image: 'darkblue_solution.png' // 반드시 존재해야 함
  },
  'HCl+NaOH': {
    text: '중화 반응 발생 (물 + 염)',
    image: 'gas_bubble.png'
  },
  'KI+Pb(NO3)2': {
    text: '노란색 침전 생성 (PbI2)',
    image: 'yellow_precipitate.png'
  },
   'AgNO3+NH3': {
    text: '착이온 형성 ([Ag(NH₃)₂]⁺), 투명 용액',
    image: 'transparent_complex.png'
  },
   'H2SO4+Pb(NO3)2': {
    text: '흰색 침전 생성 (PbSO₄)',
    image: 'white_precipitate(3).png'
  },
  'NaCl+Pb(NO3)2': {
    text: '흰색 침전 생성 (PbCl₂)',
    image: 'white_precipitate(4).png'
  },
};

export default function ChemistryLab() {
  const [placedReagents, setPlacedReagents] = useState([]);
  const [reactionResult, setReactionResult] = useState(null);

  const handlePlace = (reagent) => {
    const newReagent = {
      ...reagent,
      id: Date.now(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100
    };
    setPlacedReagents(prev => [...prev, newReagent]);
  };

  const handleReset = () => {
    setPlacedReagents([]);
    setReactionResult(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4" tabIndex={0} onKeyDown={handleKeyDown}>
      <h1 className="text-xl font-bold mb-4 flex items-center">
        <span role="img" aria-label="lab">🧪</span>&nbsp;화학 반응 실험실
      </h1>

      {/* 시약 선택 영역 */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
        {reagents.map((r) => (
          <div
            key={r.name}
            className="flex flex-col items-center cursor-pointer bg-white rounded shadow px-2 py-2"
            onClick={() => handlePlace(r)}
          >
            <img src={`/images/${r.image}`} alt={r.name} className="w-10 h-10 object-contain" />
            <span className="text-sm mt-1 font-semibold">{r.name}</span>
          </div>
        ))}
      </div>

      {/* 실험 공간 */}
      <div className="border border-dashed border-gray-400 bg-white p-4 min-h-[300px] relative overflow-hidden">
        {placedReagents.map((r) => (
          <Draggable
            key={r.id}
            defaultPosition={{ x: r.x, y: r.y }}
            onStop={(e, data) => {
              const updated = placedReagents.map(item =>
                item.id === r.id ? { ...item, x: data.x, y: data.y } : item
              );
              setPlacedReagents(updated);

              const dragged = updated.find(item => item.id === r.id);

              for (const other of updated) {
                if (other.id === dragged.id) continue;

                const [name1, name2] = [dragged.name, other.name].sort();
                const key = `${name1}+${name2}`;

                const center1 = { x: dragged.x + 40, y: dragged.y + 40 };
                const center2 = { x: other.x + 40, y: other.y + 40 };
                const dx = center1.x - center2.x;
                const dy = center1.y - center2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                  const result = reactionData[key]
                    ? reactionData[key]
                    : { text: '반응 없음', image: null };

                  setReactionResult(result);
                  setPlacedReagents(updated.filter(item =>
                    item.id !== dragged.id && item.id !== other.id
                  ));
                  break;
                }
              }
            }}
          >
            <img
              src={`/images/${r.image}`}
              alt={r.name}
              className="w-20 h-20 object-contain absolute"
            />
          </Draggable>
        ))}

        {/* 반응 결과 출력 */}
        {reactionResult && (
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
    {reactionResult.image && (
      <img
        src={`/images/results/${reactionResult.image}`}
        alt="reaction result"
        className="w-36 h-36 object-contain mx-auto"
      />
    )}
    <p className="mt-2 font-bold text-lg">{reactionResult.text}</p>
    
    <div className="mt-3 flex justify-center gap-4">
      {/* 🧹 실험 초기화 */}
      <button
        onClick={() => {
          setReactionResult(null);
          setPlacedReagents([]);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        실험 초기화
      </button>

      {/* 🔁 계속 실험하기 */}
      <button
        onClick={() => setReactionResult(null)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        계속 실험하기
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
