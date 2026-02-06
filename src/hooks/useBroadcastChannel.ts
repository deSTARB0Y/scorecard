import { useState, useEffect, useCallback } from 'react';
import type { BroadcastState } from '../types/broadcast';

const CHANNEL_NAME = 'cricket_broadcast_channel';

export function useBroadcastChannel(initialState?: BroadcastState) {
  const [state, setState] = useState<BroadcastState | null>(initialState || null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    setChannel(bc);

    bc.onmessage = (event) => {
      setState(event.data);
    };

    return () => {
      bc.close();
    };
  }, []);

  const broadcast = useCallback((newState: BroadcastState) => {
    setState(newState);
    channel?.postMessage(newState);
  }, [channel]);

  return { state, broadcast };
}
