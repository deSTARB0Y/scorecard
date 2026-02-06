import { useState, useEffect } from 'react';
import { useBroadcastChannel } from '../hooks/useBroadcastChannel';
import { parseMatchData } from '../utils/parser';
import type { BroadcastState, Scene } from '../types/broadcast';
import { Layout, Send, Play, Image as ImageIcon, Palette, Trophy, Users, BarChart3, XCircle } from 'lucide-react';

const INITIAL_STATE: BroadcastState = {
  match: {},
  scene: 'none',
  teamColors: {
    team1: '#00529B',
    team2: '#FFD100',
  },
  teamLogos: {},
  isTransparent: true,
};

export default function AdminPage() {
  const { broadcast } = useBroadcastChannel(INITIAL_STATE);
  const [localState, setLocalState] = useState<BroadcastState>(INITIAL_STATE);
  const [rawText, setRawText] = useState('');

  // Update broadcast whenever local state changes
  useEffect(() => {
    broadcast(localState);
  }, [localState, broadcast]);

  const handleParse = () => {
    const parsedMatch = parseMatchData(rawText);
    setLocalState(prev => ({
      ...prev,
      match: { ...prev.match, ...parsedMatch }
    }));
  };

  const updateScene = (scene: Scene) => {
    setLocalState(prev => ({ ...prev, scene }));
  };

  const triggerCelebration = (type: 'four' | 'six' | 'wicket') => {
    setLocalState(prev => ({ ...prev, celebration: type }));
    // Auto-clear celebration after 5 seconds
    setTimeout(() => {
      setLocalState(prev => ({ ...prev, celebration: null }));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cricket Broadcast Control</h1>
          <p className="text-slate-500">Professional Scorecard & Overlay Manager</p>
        </div>
        <div className="flex gap-4">
          <a
            href="/view"
            target="_blank"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Play size={18} />
            Open Broadcast View
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Input */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Send size={20} className="text-blue-600" />
              <h2>Raw Data Input</h2>
              <span className="ml-auto text-xs font-normal text-slate-400">Copy-paste the entire page from Cricinfo Live/Scorecard tabs</span>
            </div>
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste ESPNcricinfo data here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleParse}
                className="flex-[2] bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium"
              >
                Parse & Update Match State
              </button>
              <button
                onClick={() => { setRawText(''); setLocalState(prev => ({ ...prev, match: {} })); }}
                className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg hover:bg-slate-200 transition font-medium flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Clear
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Layout size={20} className="text-blue-600" />
              <h2>Active Overlays</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SceneButton
                active={localState.scene === 'mini-scorecard'}
                onClick={() => updateScene(localState.scene === 'mini-scorecard' ? 'none' : 'mini-scorecard')}
                icon={<Trophy size={20} />}
                label="Mini Score"
              />
              <SceneButton
                active={localState.scene === 'full-scorecard'}
                onClick={() => updateScene(localState.scene === 'full-scorecard' ? 'none' : 'full-scorecard')}
                icon={<BarChart3 size={20} />}
                label="Full Stats"
              />
              <SceneButton
                active={localState.scene === 'playing-xi'}
                onClick={() => updateScene(localState.scene === 'playing-xi' ? 'none' : 'playing-xi')}
                icon={<Users size={20} />}
                label="Playing XI"
              />
              <SceneButton
                active={localState.scene === 'manhattan'}
                onClick={() => updateScene(localState.scene === 'manhattan' ? 'none' : 'manhattan')}
                icon={<BarChart3 size={20} />}
                label="Manhattan"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Trophy size={20} className="text-orange-500" />
              <h2>Celebration Triggers</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => triggerCelebration('four')}
                className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg font-bold hover:bg-blue-200 transition"
              >
                FOUR!
              </button>
              <button
                onClick={() => triggerCelebration('six')}
                className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-lg font-bold hover:bg-purple-200 transition"
              >
                SIX!
              </button>
              <button
                onClick={() => triggerCelebration('wicket')}
                className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-bold hover:bg-red-200 transition"
              >
                WICKET!
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Trophy size={20} className="text-blue-600" />
              <h2>Current Match State Preview</h2>
            </div>
            {localState.match.team1 ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Team 1</p>
                  <p className="text-lg font-bold">{localState.match.team1}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Team 2</p>
                  <p className="text-lg font-bold">{localState.match.team2}</p>
                </div>
                <div className="col-span-2 p-3 bg-slate-900 text-white rounded-lg flex justify-between items-center">
                   <div>
                     <p className="text-slate-400 font-bold uppercase text-[10px]">Current Score</p>
                     <p className="text-2xl font-black">{localState.match.score} ({localState.match.overs})</p>
                   </div>
                   <div className="text-right">
                     <p className="text-slate-400 font-bold uppercase text-[10px]">Run Rate</p>
                     <p className="text-xl font-bold">{localState.match.crr}</p>
                   </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8 italic">No match data parsed yet.</p>
            )}
          </section>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Palette size={20} className="text-blue-600" />
              <h2>Team Customization</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team 1 Name</label>
                <input
                  type="text"
                  value={localState.match.team1 || ''}
                  onChange={(e) => setLocalState(prev => ({ ...prev, match: { ...prev.match, team1: e.target.value } }))}
                  className="w-full mt-1 p-2 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team 1 Color</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={localState.teamColors.team1}
                    onChange={(e) => setLocalState(prev => ({ ...prev, teamColors: { ...prev.teamColors, team1: e.target.value } }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team 2 Name</label>
                <input
                  type="text"
                  value={localState.match.team2 || ''}
                  onChange={(e) => setLocalState(prev => ({ ...prev, match: { ...prev.match, team2: e.target.value } }))}
                  className="w-full mt-1 p-2 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team 2 Color</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={localState.teamColors.team2}
                    onChange={(e) => setLocalState(prev => ({ ...prev, teamColors: { ...prev.teamColors, team2: e.target.value } }))}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <ImageIcon size={20} className="text-blue-600" />
              <h2>Background & Logos</h2>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Background URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={localState.bgImage || ''}
                    onChange={(e) => setLocalState(prev => ({ ...prev, bgImage: e.target.value }))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
               </div>
               <div className="flex items-center gap-2">
                 <input
                   type="checkbox"
                   id="transparent"
                   checked={localState.isTransparent}
                   onChange={(e) => setLocalState(prev => ({ ...prev, isTransparent: e.target.checked }))}
                 />
                 <label htmlFor="transparent" className="text-sm text-slate-700">Transparent (OBS Mode)</label>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SceneButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
        active
          ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-md'
          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
      }`}
    >
      {icon}
      <span className="mt-2 text-xs font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
