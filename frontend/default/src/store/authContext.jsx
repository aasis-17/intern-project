import { createContext, useReducer } from 'react';

//reducers
const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, isAuthenticated : true, userData : action.payload};
    case "logout" :
      return {...state, isAuthenticated : false, userData : null}
    case "setModal" : 
      return {...state, isVisible : action.payload}
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//context
const AuthContext = createContext();

const initialState = { 
    isAuthenticated : false,
    userData : null,
    isVisible : false
 };

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};




export { AuthContext, AuthProvider };