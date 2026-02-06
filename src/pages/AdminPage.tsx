import { useState, useEffect } from 'react';
import { useBroadcastChannel } from '../hooks/useBroadcastChannel';
import { parseMatchData } from '../utils/parser';
import type { BroadcastState, Scene } from '../types/broadcast';
import { Layout, Send, Play, Image as ImageIcon, Palette, Trophy, Users, BarChart3, XCircle, Target, Monitor } from 'lucide-react';
import MiniScorecard from '../components/MiniScorecard';
import FullScorecard from '../components/FullScorecard';
import PlayingXIOverlay from '../components/PlayingXIOverlay';
import ManhattanGraph from '../components/ManhattanGraph';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { AnimatePresence } from 'framer-motion';

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
  const [parseStatus, setParseStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Update broadcast whenever local state changes
  useEffect(() => {
    broadcast(localState);
  }, [localState, broadcast]);

  const handleParse = () => {
    try {
      if (!rawText.trim()) {
        setParseStatus({ type: 'error', message: 'Input is empty' });
        return;
      }
      const parsedMatch = parseMatchData(rawText);
      if (!parsedMatch.team1 && !parsedMatch.score) {
        setParseStatus({ type: 'error', message: 'Could not find match data. Try copying from a different tab (Live or Scorecard).' });
        return;
      }
      setLocalState(prev => ({
        ...prev,
        match: { ...prev.match, ...parsedMatch }
      }));
      setParseStatus({ type: 'success', message: 'Successfully updated match state!' });
      setTimeout(() => setParseStatus({ type: null, message: '' }), 3000);
    } catch (err) {
      setParseStatus({ type: 'error', message: 'An error occurred during parsing.' });
    }
  };

  const updateScene = (scene: Scene) => {
    setLocalState(prev => ({ ...prev, scene }));
  };

  const updateMatchField = (field: string, value: any) => {
    setLocalState(prev => ({
      ...prev,
      match: { ...prev.match, [field]: value }
    }));
  };

  const adjustScore = (runs: number, wicket = false, isWide = false, isNB = false) => {
    const currentScore = localState.match.score || "0/0";
    const [scoreStr, wicketsStr] = currentScore.split('/');
    let runsVal = parseInt(scoreStr) + runs;
    let wicketsVal = parseInt(wicketsStr || "0") + (wicket ? 1 : 0);

    const newScore = `${runsVal}/${wicketsVal}`;

    // Update overs logic (simplified)
    const currentOvers = localState.match.overs || "0.0";
    let [ov, balls] = currentOvers.split('.').map(Number);
    if (!isWide && !isNB) {
      balls++;
      if (balls >= 6) {
        ov++;
        balls = 0;
      }
    }
    const newOvers = `${ov}.${balls}`;

    setLocalState(prev => {
      const newState = {
        ...prev,
        match: {
          ...prev.match,
          score: newScore,
          wickets: wicketsVal,
          overs: newOvers
        }
      };

      // Also add to recent balls
      let ballLabel = runs.toString();
      if (wicket) ballLabel = "W";
      if (runs === 0 && !wicket) ballLabel = "•";
      if (isWide) ballLabel = "wd";
      if (isNB) ballLabel = "nb";

      const newRecent = [...(prev.match.recentBalls || []), ballLabel].slice(-12);
      newState.match.recentBalls = newRecent;

      return newState;
    });

    if (runs === 4 && !wicket) triggerCelebration('four');
    if (runs === 6 && !wicket) triggerCelebration('six');
    if (wicket) triggerCelebration('wicket');
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

      {/* Live Preview Bar */}
      <section className="mb-8 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 relative group">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
          <Monitor size={14} className="text-green-400 animate-pulse" />
          LIVE BROADCAST PREVIEW
        </div>
        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden origin-top scale-[1] transition-transform">
           <div className="absolute inset-0 pointer-events-none transform scale-[0.6] origin-top-left w-[166.66%] h-[166.66%]">
              <div
                className={`relative w-full h-full overflow-hidden font-display ${
                  localState.isTransparent ? 'bg-transparent' : 'bg-slate-900'
                }`}
                style={localState.bgImage && !localState.isTransparent ? {
                  backgroundImage: `url(${localState.bgImage})`,
                  backgroundSize: 'cover'
                } : {}}
              >
                <AnimatePresence mode="wait">
                  {localState.scene === 'mini-scorecard' && <MiniScorecard key="mini" state={localState} />}
                  {localState.scene === 'full-scorecard' && <FullScorecard key="full" state={localState} />}
                  {localState.scene === 'playing-xi' && <PlayingXIOverlay key="xi" state={localState} />}
                  {localState.scene === 'manhattan' && <ManhattanGraph key="manhattan" state={localState} />}
                </AnimatePresence>
                <CelebrationOverlay type={localState.celebration} />
              </div>
           </div>
           {localState.scene === 'none' && !localState.celebration && (
             <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-sm">
               No Active Overlays
             </div>
           )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Input */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Send size={20} className="text-blue-600" />
              <h2>Raw Data Input</h2>
              <span className="ml-auto text-xs font-normal text-slate-400">Copy-paste the entire page from Cricinfo Live/Scorecard tabs</span>
            </div>

            {parseStatus.type && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                parseStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {parseStatus.message}
              </div>
            )}
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
              <Target size={20} className="text-green-600" />
              <h2>Manual Match Control</h2>
              <span className="ml-auto text-xs font-normal text-slate-400">Update scores manually if the parser fails</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button onClick={() => adjustScore(0)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded font-bold">Dot</button>
              <button onClick={() => adjustScore(1)} className="bg-blue-50 hover:bg-blue-100 p-2 rounded font-bold">1 Run</button>
              <button onClick={() => adjustScore(4)} className="bg-yellow-50 hover:bg-yellow-100 p-2 rounded font-bold">4 Runs</button>
              <button onClick={() => adjustScore(6)} className="bg-purple-50 hover:bg-purple-100 p-2 rounded font-bold">6 Runs</button>
              <button onClick={() => adjustScore(0, true)} className="bg-red-50 hover:bg-red-100 p-2 rounded font-bold">Wicket</button>
              <button onClick={() => adjustScore(1, false, true)} className="bg-orange-50 hover:bg-orange-100 p-2 rounded font-bold">Wide</button>
              <button onClick={() => adjustScore(1, false, false, true)} className="bg-orange-50 hover:bg-orange-100 p-2 rounded font-bold">No Ball</button>
              <button onClick={() => setLocalState(prev => ({ ...prev, match: { ...prev.match, recentBalls: [] } }))} className="bg-slate-100 hover:bg-slate-200 p-2 rounded text-xs">Reset Over</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t pt-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400">Score & State</h3>
                <div className="flex gap-2">
                   <input
                    type="text"
                    value={localState.match.score || "0/0"}
                    onChange={(e) => updateMatchField('score', e.target.value)}
                    placeholder="Score (e.g. 82/1)"
                    className="w-full p-2 border rounded text-sm"
                   />
                </div>
                <div className="flex gap-2">
                   <input
                    type="text"
                    value={localState.match.overs || "0.0"}
                    onChange={(e) => updateMatchField('overs', e.target.value)}
                    placeholder="Overs (e.g. 7.0)"
                    className="w-full p-2 border rounded text-sm"
                   />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400">Current Batter</h3>
                <input
                  type="text"
                  value={localState.match.batters?.[0]?.name || ""}
                  onChange={(e) => {
                    const batters = [...(localState.match.batters || [])];
                    if (!batters[0]) batters[0] = { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "0.0", isStriker: true };
                    batters[0].name = e.target.value;
                    updateMatchField('batters', batters);
                  }}
                  placeholder="Striker Name"
                  className="w-full p-2 border rounded text-sm font-bold"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localState.match.batters?.[0]?.runs || 0}
                    onChange={(e) => {
                      const batters = [...(localState.match.batters || [])];
                      batters[0].runs = parseInt(e.target.value);
                      updateMatchField('batters', batters);
                    }}
                    className="w-1/2 p-2 border rounded text-sm"
                    placeholder="Runs"
                  />
                  <input
                    type="number"
                    value={localState.match.batters?.[0]?.balls || 0}
                    onChange={(e) => {
                      const batters = [...(localState.match.batters || [])];
                      batters[0].balls = parseInt(e.target.value);
                      updateMatchField('batters', batters);
                    }}
                    className="w-1/2 p-2 border rounded text-sm"
                    placeholder="Balls"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400">Current Bowler</h3>
                <input
                  type="text"
                  value={localState.match.bowlers?.[0]?.name || ""}
                  onChange={(e) => {
                    const bowlers = [...(localState.match.bowlers || [])];
                    if (!bowlers[0]) bowlers[0] = { name: "", overs: "0.0", maidens: 0, runs: 0, wickets: 0, econ: "0.0" };
                    bowlers[0].name = e.target.value;
                    updateMatchField('bowlers', bowlers);
                  }}
                  placeholder="Bowler Name"
                  className="w-full p-2 border rounded text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localState.match.bowlers?.[0]?.wickets || 0}
                    onChange={(e) => {
                      const bowlers = [...(localState.match.bowlers || [])];
                      bowlers[0].wickets = parseInt(e.target.value);
                      updateMatchField('bowlers', bowlers);
                    }}
                    className="w-1/2 p-2 border rounded text-sm"
                    placeholder="Wkts"
                  />
                  <input
                    type="number"
                    value={localState.match.bowlers?.[0]?.runs || 0}
                    onChange={(e) => {
                      const bowlers = [...(localState.match.bowlers || [])];
                      bowlers[0].runs = parseInt(e.target.value);
                      updateMatchField('bowlers', bowlers);
                    }}
                    className="w-1/2 p-2 border rounded text-sm"
                    placeholder="Runs"
                  />
                </div>
              </div>
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
