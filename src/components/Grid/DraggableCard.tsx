import React from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

declare module 'react-draggable' {
  export interface DraggableProps {
    children: React.ReactNode;
  }
}

const DraggableCard: React.FC<{
  cardData: any;
  id: string;
  handleConnection: Function;
  disabled: number[];
}> = ({ cardData, id, handleConnection, disabled }) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const updateXarrow = useXarrow();
  return (
    <Draggable
      onStop={updateXarrow}
      grid={[85, 84]}
      nodeRef={nodeRef}
      onDrag={updateXarrow}
      disabled={disabled.includes(cardData.id) ? true : false}
      // bounds='#grid'
    >
      <div
        className='card'
        ref={nodeRef}
        id={id}
        data-id={cardData.id}
        data-allowed={cardData.allowed}
      >
        <img
          src='./link.png'
          alt=''
          onClick={(event) => {
            handleConnection(event);
          }}
        />
        {cardData.title}
      </div>
    </Draggable>
  );
};

export default DraggableCard;
