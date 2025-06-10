import { useReducer } from 'react'; // Import useReducer
import { renderHook } from '@testing-library/react-hooks'; // To test hooks

// Manually extract initialState and reducer from app.js for testing
// This is a simplified approach. In a real scenario, you might export them from app.js or a separate state management file.

const initialState = {
  pdf: null,
  uploading: false,
  uploadProgress: 0,
  stars: 0,
  tips: [],
  errorMessage: "",
  isDetailsOpen: false,
  firstName: "",
  email: "",
  contact: "",
};

function reducer(state, action) {
  // console.log(`[REDUCER] Action: ${action.type}`, action.payload !== undefined ? action.payload : ''); // Keep console logs for debugging if needed
  switch (action.type) {
    case "SET_PDF":
      return { ...state, pdf: action.payload };
    case "UPLOAD_START":
      return { ...state, uploading: true, uploadProgress: 0, errorMessage: "" };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "UPLOAD_SUCCESS":
      // console.log("[REDUCER] UPLOAD_SUCCESS: Stars -", action.payload.stars, "Tips -", action.payload.tips ? action.payload.tips.length : 0);
      return {
        ...state,
        uploading: false,
        stars: action.payload.stars,
        tips: action.payload.tips,
        uploadProgress: 100,
        errorMessage: "",
      };
    case "UPLOAD_FAIL":
      // console.error("[REDUCER] UPLOAD_FAIL:", action.payload);
      return {
        ...state,
        uploading: false,
        errorMessage: action.payload,
        uploadProgress: 0,
      };
    case "TOGGLE_DETAILS":
      return { ...state, isDetailsOpen: !state.isDetailsOpen };
    case "SET_FIRST_NAME":
      return { ...state, firstName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CONTACT":
      return { ...state, contact: action.payload };
    default:
      // console.warn(`[REDUCER] Unknown action type: ${action.type}`);
      return state;
  }
}


describe('App Reducer', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [state] = result.current;
    expect(state).toEqual(initialState);
  });

  it('should handle SET_PDF', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const pdfUri = 'file:///test.pdf';
    dispatch({ type: 'SET_PDF', payload: pdfUri });
    const [newState] = result.current;
    expect(newState.pdf).toBe(pdfUri);
  });

  it('should handle UPLOAD_START', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    dispatch({ type: 'UPLOAD_START' });
    const [newState] = result.current;
    expect(newState.uploading).toBe(true);
    expect(newState.uploadProgress).toBe(0);
    expect(newState.errorMessage).toBe("");
  });

  it('should handle UPLOAD_PROGRESS', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    dispatch({ type: 'UPLOAD_PROGRESS', payload: 50 });
    const [newState] = result.current;
    expect(newState.uploadProgress).toBe(50);
  });

  it('should handle UPLOAD_SUCCESS', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const payload = { stars: 4, tips: ['Great job!', 'Improve section X'] };
    dispatch({ type: 'UPLOAD_SUCCESS', payload });
    const [newState] = result.current;
    expect(newState.uploading).toBe(false);
    expect(newState.stars).toBe(4);
    expect(newState.tips).toEqual(payload.tips);
    expect(newState.uploadProgress).toBe(100);
    expect(newState.errorMessage).toBe("");
  });

  it('should handle UPLOAD_FAIL', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const errorMessage = 'Upload failed miserably';
    dispatch({ type: 'UPLOAD_FAIL', payload: errorMessage });
    const [newState] = result.current;
    expect(newState.uploading).toBe(false);
    expect(newState.errorMessage).toBe(errorMessage);
    expect(newState.uploadProgress).toBe(0);
  });

  it('should handle TOGGLE_DETAILS', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    dispatch({ type: 'TOGGLE_DETAILS' });
    const [newState] = result.current;
    expect(newState.isDetailsOpen).toBe(!initialState.isDetailsOpen);
    dispatch({ type: 'TOGGLE_DETAILS' });
    const [finalState] = result.current;
    expect(finalState.isDetailsOpen).toBe(initialState.isDetailsOpen);
  });

  it('should handle SET_FIRST_NAME', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const name = 'John';
    dispatch({ type: 'SET_FIRST_NAME', payload: name });
    const [newState] = result.current;
    expect(newState.firstName).toBe(name);
  });

  it('should handle SET_EMAIL', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const email = 'john@example.com';
    dispatch({ type: 'SET_EMAIL', payload: email });
    const [newState] = result.current;
    expect(newState.email).toBe(email);
  });

  it('should handle SET_CONTACT', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState));
    const [, dispatch] = result.current;
    const contact = '1234567890';
    dispatch({ type: 'SET_CONTACT', payload: contact });
    const [newState] = result.current;
    expect(newState.contact).toBe(contact);
  });
});
