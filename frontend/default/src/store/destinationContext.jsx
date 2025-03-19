import { createContext, useReducer } from "react";

const destinationReducer = () =>{
    switch (action.type) {
        case 'destinationDetails':
          return { ...state, details : action.payload};

        default:
          throw new Error(`Unhandled action type: ${action.type}`);
      }
}


const DestinationContext = createContext()

const initialState = {
    details : null
}

 const DestinationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(destinationReducer, initialState);

  return (
    <DestinationContext.Provider value={{ state, dispatch }}>
      {children}
    </DestinationContext.Provider>
  );
};

export {DestinationContext, DestinationProvider}