import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  userPreferences: [],
  favorites: [],
  loading: false,
  kreatives: []
};

// Action types
export const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_LOADING: 'SET_LOADING',
  SET_KREATIVES: 'SET_KREATIVES',
  LOGOUT: 'LOGOUT'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case ActionTypes.SET_USER_PREFERENCES:
      return { ...state, userPreferences: action.payload };
    case ActionTypes.ADD_FAVORITE:
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload] 
      };
    case ActionTypes.REMOVE_FAVORITE:
      return { 
        ...state, 
        favorites: state.favorites.filter(fav => fav.id !== action.payload) 
      };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_KREATIVES:
      return { ...state, kreatives: action.payload };
    case ActionTypes.LOGOUT:
      return { 
        ...initialState, 
        kreatives: state.kreatives 
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load kreatives data on app start
  useEffect(() => {
    const loadKreatives = async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        // Import the JSON data directly since it's in src folder
        const kreativesData = await import('../data/kreatives.json');
        dispatch({ type: ActionTypes.SET_KREATIVES, payload: kreativesData.default });
      } catch (error) {
        console.error('Error loading kreatives:', error);
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    loadKreatives();
  }, []);

  // Action creators
  const actions = {
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    setAuthenticated: (isAuth) => dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: isAuth }),
    setUserPreferences: (preferences) => dispatch({ type: ActionTypes.SET_USER_PREFERENCES, payload: preferences }),
    addFavorite: (kreative) => dispatch({ type: ActionTypes.ADD_FAVORITE, payload: kreative }),
    removeFavorite: (kreativeId) => dispatch({ type: ActionTypes.REMOVE_FAVORITE, payload: kreativeId }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    logout: () => dispatch({ type: ActionTypes.LOGOUT })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
