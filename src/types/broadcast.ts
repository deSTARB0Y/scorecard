import type { MatchState } from './match';

export type Scene = 'mini-scorecard' | 'full-scorecard' | 'playing-xi' | 'manhattan' | 'none';

export interface BroadcastState {
  match: Partial<MatchState>;
  scene: Scene;
  celebration?: 'four' | 'six' | 'wicket' | null;
  teamColors: {
    team1: string;
    team2: string;
  };
  teamLogos: {
    team1?: string;
    team2?: string;
  };
  bgImage?: string;
  isTransparent: boolean;
}
