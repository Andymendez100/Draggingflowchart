import React from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

declare module 'react-draggable' {
  export interface DraggableProps {
    children: React.ReactNode;
  }
}

// const handleOnStop = (event: any) => {
//   updateXarrow();
//   if (event.target.classList.contains('card')) {
//     let card = event.target.children;
//     const g = document.getElementById('grid');
//     const gData = g?.getBoundingClientRect();
//     const insideGridCheck =
//       event.y > (gData?.top || -1) &&
//       event.y < (gData?.bottom || -1) &&
//       event.x > (gData?.left || -1) &&
//       event.x < (gData?.right || -1);

//     if (insideGridCheck) {
//       card[0]?.classList.remove('hidden');
//     }

//     if (!insideGridCheck && !card[0]?.classList.contains('hidden')) {
//       card[0]?.classList.add('hidden');
//     }
//   }
// };

const DraggableCard: React.FC<{
  cardData: any;
  id: string;
  handleConnection: Function;
}> = ({ cardData, id, handleConnection }) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const updateXarrow = useXarrow();

  return (
    <Draggable
      onStop={updateXarrow}
      grid={[85, 84]}
      nodeRef={nodeRef}
      onDrag={updateXarrow}
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
