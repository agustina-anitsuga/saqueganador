import React, { createContext, useContext, useEffect, useState } from 'react';
import { ITournament, emptyTournament } from '@/types/model';
import { getCurrentTournament } from '@/api/api';

interface TournamentContextValue {
  tournament: ITournament;
  loading: boolean;
}

const TournamentContext = createContext<TournamentContextValue>({
  tournament: emptyTournament(),
  loading: true,
});

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournament, setTournament] = useState<ITournament>(emptyTournament());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentTournament()
      .then((t) => {
        if (mounted && t) setTournament(t);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <TournamentContext.Provider value={{ tournament, loading }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament(): TournamentContextValue {
  return useContext(TournamentContext);
}
