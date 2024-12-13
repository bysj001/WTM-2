import { Session, User } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';

import { supabase } from '~/src/lib/supabase';

type Auth = {
  isAuthenticated: boolean;
  session: Session | null;
  user?: User;
  profile: any | null;
};

const AuthContext = createContext<Auth>({
  isAuthenticated: false,
  session: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState();
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      let { data, error } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', session.user.id)
        .single();

      setProfile(data);
    };
    fetchProfile();
  }, [session?.user])

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user, isAuthenticated: !!session?.user, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);