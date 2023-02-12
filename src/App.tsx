import {
  createContext,
  PointerEventHandler,
  PropsWithChildren,
  TouchEventHandler,
  useContext,
  useReducer,
  useRef,
} from "react";
import Board from "./Board";

type PointType = {
  x: number;
  y: number;
};

type ElementType = {
  id: string;
} & PointType;

type BoardStateType = {
  elements: ElementType[];
  selectingId?: string;
  lastDraggingPoint?: PointType;
  elementRelativeDraggingPoint?: PointType;
};

type BoardMetaType = {
  rootRef?: React.RefObject<HTMLDivElement>;
};

type BoardStateAction = {
  type: string;
  payload?: any;
};

const DEFAULT_STATE: BoardStateType = {
  elements: [],
};

const BoardContext = createContext<
  BoardStateType &
    BoardMetaType & {createElement: () => void} & {
      setSelectedElementId: (id: string) => void;
    } & {handleMouseDown: PointerEventHandler} & {
      handleMouseMove: PointerEventHandler;
    } & {handleMouseUp: PointerEventHandler}
>({
  ...DEFAULT_STATE,
  createElement: () => {},
  setSelectedElementId: () => {},
  handleMouseDown: () => {},
  handleMouseMove: () => {},
  handleMouseUp: () => {},
});

export const useBoardContext = () => useContext(BoardContext);

const generateRandomId = () => Math.random().toString(16).slice(2, 10);
const randomBetween = (s: number, e: number) =>
  Math.floor(Math.random() * (e - s + 1)) + s;

const reducer = (
  state: BoardStateType,
  action: BoardStateAction
): BoardStateType => {
  const {type, payload} = action;
  switch (type) {
    case "CREATE_ELEMENT": {
      return {
        ...state,
        elements: [
          ...state.elements,
          {
            x: randomBetween(0, 200),
            y: randomBetween(0, 200),
            id: generateRandomId(),
          },
        ],
      };
    }
    case "SELECT_ELEMENT": {
      const index = state.elements.findIndex((e) => e.id === payload.id);
      const element = state.elements.splice(index, 1)[0];
      const ori = state.elements;
      ori.push(element);
      const target = [...ori];
      return {
        ...state,
        selectingId: payload.id,
        elements: target,
      };
    }
    case "START_DRAGGING": {
      const {relPos, elPos} = payload;
      return {
        ...state,
        lastDraggingPoint: relPos,
        elementRelativeDraggingPoint: elPos,
      };
    }
    case "SET_ELEMENT_POS": {
      const {pos} = payload;

      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === state.selectingId ? {...el, ...pos} : el
        ),
      };
    }
    case "CLEAR_FOCUS": {
      return {
        ...state,
        selectingId: undefined,
        lastDraggingPoint: undefined,
      };
    }
    default:
      break;
  }

  return state;
};

function BoardContextProvider({children}: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const rootRef = useRef<HTMLDivElement>(null);

  const createElement = () => {
    dispatch({
      type: "CREATE_ELEMENT",
    });
  };

  const setSelectedElementId = (id: string) => {
    dispatch({
      type: "SELECT_ELEMENT",
      payload: {
        id,
      },
    });
  };

  const setDraggingStartPositions = (relPos: PointType, elPos: PointType) => {
    dispatch({
      type: "START_DRAGGING",
      payload: {
        relPos,
        elPos,
      },
    });
  };
  const setElementPos = (pos: PointType) => {
    dispatch({
      type: "SET_ELEMENT_POS",
      payload: {
        id: state.selectingId,
        pos,
      },
    });
  };

  const handleMouseDown: PointerEventHandler = (e) => {
    e.preventDefault();
    console.log("Dragging");
    console.log(e);
    const {left, top} = e.currentTarget.getBoundingClientRect();
    const elementId = e.currentTarget.getAttribute("data-elementid");
    if (!elementId) {
      return;
    }

    setSelectedElementId(elementId);
    setDraggingStartPositions({x: left, y: top}, {x: e.clientX, y: e.clientY});
    //console.log(elementId);
    //console.log(left, top);
    //console.log(e.clientX, e.clientY);
  };

  const handleMouseMove: PointerEventHandler = (e) => {
    e.preventDefault();
    if (
      !state.selectingId ||
      !state.lastDraggingPoint ||
      !state.elementRelativeDraggingPoint ||
      !rootRef.current
    ) {
      return;
    }

    const {
      left: parentX,
      top: parentY,
      width: parentW,
      height: parentH,
    } = rootRef.current.getBoundingClientRect();

    const {clientX, clientY} = e;
    state.lastDraggingPoint.x;
    let x =
      clientX -
      (state.elementRelativeDraggingPoint.x - state.lastDraggingPoint.x) -
      parentX;
    let y =
      clientY -
      (state.elementRelativeDraggingPoint.y - state.lastDraggingPoint.y) -
      parentY;

    // Handle Boundry method 1

    //if (x < 0 || y < 0 || x >= parentW - 32 || y >= parentH - 32) {
    //  dispatch({
    //    type: "CLEAR_FOCUS",
    //  });
    //} else {
    //  setElementPos({x, y});
    //}

    // Handle Boundry method 2
    x = Math.min(Math.max(0, x), parentW - 32 - 1);
    y = Math.min(Math.max(0, y), parentH - 32 - 1);

    setElementPos({x, y});
  };

  const handleMouseUp: PointerEventHandler = (e) => {
    e.preventDefault();
    console.log("Release");
    dispatch({
      type: "CLEAR_FOCUS",
    });
  };

  return (
    <BoardContext.Provider
      value={{
        ...state,
        rootRef,
        createElement,
        setSelectedElementId,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

function App() {
  return (
    <BoardContextProvider>
      <Main />
    </BoardContextProvider>
  );
}

function Main() {
  const {handleMouseMove, handleMouseUp} = useBoardContext();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-screen"
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
    >
      <Board />
    </div>
  );
}

export default App;
