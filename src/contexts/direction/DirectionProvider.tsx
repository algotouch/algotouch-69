
import { createContext, useContext } from 'react'

type Direction = 'ltr' | 'rtl';

interface DirectionContextValue {
  dir: Direction;
}

// Create context with a default value to avoid null checks
const DirectionContext = createContext<DirectionContextValue>({ dir: 'rtl' })

export const useDirection = () => useContext(DirectionContext);

interface DirectionProviderProps {
  dir?: Direction;
  children: React.ReactNode;
}

export const DirectionProvider = ({
  dir = 'rtl', // Default to RTL based on your app's Hebrew language
  children,
}: DirectionProviderProps) => (
  <DirectionContext.Provider value={{ dir }}>
    {children}
  </DirectionContext.Provider>
)
