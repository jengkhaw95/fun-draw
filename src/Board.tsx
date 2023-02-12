import React, {MouseEventHandler} from "react";
import {useBoardContext} from "./App";

interface BoxProps {
  id: string;
  x: number;
  y: number;
  setSelectedElementId: (id: string) => void;
  handleMouseDown: MouseEventHandler;
}

const randomColor = (n: number) => {
  const colors = ["red", "blue", "green", "yellow", "indigo", "pink"];
  return colors[n % colors.length];
};

function Panel() {
  const {selectingId, elements, createElement} = useBoardContext();
  return (
    <div className="w-96 flex items-center justify-between my-3">
      <div>Selecting ID: {selectingId}</div>
      <button
        className="border rounded px-3 py-1.5 shadow bg-white text-sm font-semibold text-gray-600"
        onClick={() => createElement()}
      >
        ADD
      </button>
    </div>
  );
}

export default function Board() {
  const {elements, rootRef, setSelectedElementId, handleMouseDown} =
    useBoardContext();

  return (
    <>
      <Panel />
      <div ref={rootRef} className="h-96 w-96 border relative">
        {elements.map((el: any) => (
          <Box
            id={el.id}
            key={el.id}
            x={el.x}
            y={el.y}
            setSelectedElementId={setSelectedElementId}
            handleMouseDown={handleMouseDown}
          />
        ))}
      </div>
    </>
  );
}

function Box({id, x, y, handleMouseDown}: BoxProps) {
  const num = parseInt(id.slice(-2), 16);
  return (
    <div
      className={`${`bg-${randomColor(num)}-200`} ${`border-${randomColor(
        num
      )}-500`} rounded w-8 h-8 absolute border`}
      style={{top: `${y}px`, left: `${x}px`}}
      data-elementid={id}
      onMouseDown={handleMouseDown}
    ></div>
  );
}

//function Box_unused({parentOffsetX, parentOffsetY}: BoxProps) {
//  const boxRef = useRef<HTMLDivElement>(null);
//  const dragStartPoint = useRef<{x: number; y: number}>();
//  const posBeforeDrag = useRef<{x: number; y: number}>();
//  const [pos, setPos] = useState<{x: number; y: number}>({x: 50, y: 50});

//  const onMouseDown: MouseEventHandler = (e) => {
//    const {clientX, clientY} = e;
//    if (!parentOffsetX || !parentOffsetY) {
//      return;
//    }

//    const relativeX = clientX;
//    const relativeY = clientY;

//    posBeforeDrag.current = {x: pos.x, y: pos.y};

//    dragStartPoint.current = {x: relativeX, y: relativeY};
//  };

//  const onMouseUp: MouseEventHandler = (e) => {
//    console.log("UP");
//    dragStartPoint.current = undefined;
//  };

//  const onMouseMove: MouseEventHandler = (e) => {
//    if (
//      !dragStartPoint.current ||
//      !parentOffsetX ||
//      !parentOffsetY ||
//      !posBeforeDrag.current
//    ) {
//      return;
//    }
//    const {clientX, clientY} = e;
//    const x = clientX - dragStartPoint.current.x + posBeforeDrag.current.x;
//    const y = clientY - dragStartPoint.current.y + posBeforeDrag.current.y;
//    setPos({x, y});
//  };

//  const onMouseLeave: MouseEventHandler = (e) => {
//    console.log("LEAVE");
//    dragStartPoint.current = undefined;
//  };

//  return (
//    <div
//      ref={boxRef}
//      className="bg-red-400 rounded w-12 h-12 absolute"
//      style={{top: `${pos.y}px`, left: `${pos.x}px`}}
//      onMouseDown={onMouseDown}
//      onMouseUp={onMouseUp}
//      onMouseMove={onMouseMove}
//      onMouseLeave={onMouseLeave}
//    ></div>
//  );
//}
