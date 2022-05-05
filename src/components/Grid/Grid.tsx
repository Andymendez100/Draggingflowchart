import React, { useState } from 'react';
import Xarrow, { anchorType, Xwrapper } from 'react-xarrows';
// Allowed means cards it can connect to

import GridCards from './gridData.json';
import DraggableCard from './DraggableCard';
import './Grid.css';

const Grid: React.FC = () => {
  const rowSwimLanes = [
    'Telescope Assy Sell-Off',
    'Telescope Assy Procurement',
    'Telescope Assy I&T',
    'Telescope Receivers',
    'Telescope Assy Design',
  ];
  const [currentArrow, setCurrentArrow] = useState({
    start: '',
    end: '',
    allowed: '',
    endAnchor: '',
    startAnchor: '',
  });
  const [arrows, setArrows] = useState<
    {
      start: string;
      end: string;
      allowed: string;
      color?: string;
      endAnchor: string;
      startAnchor: string;
    }[]
  >([]);
  let gridHeight = 7;
  let gridWidth = 14;

  const buildGrid = (width: number, height: number): any => {
    return Array.from(Array(height)).map((row: any, rowindex: number) => {
      if (rowindex < 1) {
        return (
          <tr data-row={rowindex + 1} key={rowindex} className='draggable-row'>
            {GridCards.data.map((card, cardindex) => {
              if (cardindex < 12) {
                return (
                  <td
                    data-column={cardindex}
                    key={cardindex}
                    // id='swim-lane-box'
                    className='draggableBox'
                  >
                    <DraggableCard
                      id={`draggableCard${card.id}`}
                      cardData={card}
                      key={cardindex}
                      handleConnection={handleConnection}
                    />
                  </td>
                );
              }
              return null;
            })}
          </tr>
        );
      } else if (rowindex === 1) {
        return (
          <tr data-row={rowindex + 1} key={rowindex} className='draggable-row'>
            {GridCards.data.map((card, cardindex) => {
              if (cardindex > 11) {
                return (
                  <td
                    data-column={cardindex}
                    key={cardindex}
                    className='draggableBox'
                    // id='swim-lane-box'
                  >
                    <DraggableCard
                      id={`draggableCard${card.id}`}
                      cardData={card}
                      key={cardindex}
                      handleConnection={handleConnection}
                    />
                  </td>
                );
              }
              return null;
            })}
          </tr>
        );
      }
      return (
        <tr data-row={rowindex + 1} key={rowindex}>
          {Array.from(Array(width)).map((column: any, index: number) => {
            if (index === 0 && rowindex > 1) {
              return (
                <td key={index} id='swim-lane-box'>
                  <span id='swim-lanes'>{rowSwimLanes[rowindex - 2]}</span>
                </td>
              );
            }
            return <td data-column={index} key={index}></td>;
          })}
        </tr>
      );
    });
  };

  const handleConnection = (event: any) => {
    const currentTarget = event.target.parentNode.id;
    const indexData = currentTarget.split('draggableCard')[1] - 1;
    const remove: number[] = [];
    const disconnect = arrows.filter((arrow, index) => {
      const condition =
        (arrow.start === currentArrow.start && arrow.end === currentTarget) ||
        (arrow.start === currentTarget && arrow.end === currentArrow.start);

      if (condition) {
        remove.push(index);
      }
      return condition;
    });

    // if current drawn arrow is waiting for second point
    if (
      currentArrow.start !== '' &&
      currentArrow.start !== currentTarget &&
      disconnect.length === 0
    ) {
      setArrows(
        arrows.concat([
          {
            ...currentArrow,
            start: currentArrow.start,
            end: currentTarget,
            allowed: currentArrow.allowed,

            endAnchor: GridCards.data[indexData].endAnchor,
          },
        ])
      );
      setCurrentArrow({
        start: '',
        end: '',
        allowed: '',
        endAnchor: '',
        startAnchor: '',
      });
    }
    // check if this exists in state
    else if (disconnect.length !== 0) {
      setArrows(arrows.filter((arrow, index) => !remove.includes(index)));
      setCurrentArrow({
        start: '',
        end: '',
        allowed: '',
        endAnchor: '',
        startAnchor: '',
      });
    } else {
      console.log(
        'test',
        GridCards.data[parseInt(currentTarget.split('draggableCard')[1] + 1)]
      );
      setCurrentArrow({
        ...currentArrow,
        start: currentTarget,
        allowed: event.target.parentNode.dataset.allowed,
        // endAnchor: '',
        startAnchor: GridCards.data[indexData].startAnchor,
      });
    }
  };

  const checkGrid = () => {
    let incorrectShowing = false;
    let previousItem: any;
    setArrows(
      arrows.map((lines) => {
        const search = lines.end.replace('draggableCard', '');
        if (lines.allowed.split(',').includes(search)) {
          // correct
          return { ...lines, color: 'green' };
        }
        return { ...lines, color: 'red' };
      })
    );
    // Check grid here
    GridCards.data.map((cards) => {
      const currentCard = document.querySelector(
        `[data-id='${cards.id}'] `
      ) as Element;
      const correctGridLocation = document.querySelector(
        `[data-row='${cards.row}'] [data-column='${cards.column}'] `
      ) as any;
      const gridBoundaries = correctGridLocation.getBoundingClientRect();
      const cardLocation = currentCard.getBoundingClientRect();
      if (
        cardLocation.x > gridBoundaries.left &&
        cardLocation.x < gridBoundaries.right &&
        cardLocation.y > gridBoundaries.top &&
        cardLocation.y < gridBoundaries.bottom
      ) {
        previousItem = currentCard;

        correctGridLocation.style.backgroundColor = '#fff';
      } else {
        if (!incorrectShowing) {
          incorrectShowing = true;
          if (previousItem) {
            previousItem.dataset.allowed.split(',').map((allowedCards: any) => {
              console.log('allowedCards', allowedCards);
              const hintCard = GridCards.data[parseInt(allowedCards) - 1];
              console.log('hintCard.column', hintCard);
              const hintCardGridLocation = document.querySelector(
                `[data-row='${hintCard.row}'] [data-column='${hintCard.column}'] `
              ) as any;
              hintCardGridLocation.style.backgroundColor = 'red';
            });
          } else {
            correctGridLocation.style.backgroundColor = 'red';
          }
        }
      }
    });
  };

  return (
    <>
      <Xwrapper>
        {/* render arrows here */}
        {arrows.map((arrow, index) => (
          <Xarrow
            key={index}
            {...arrow}
            lineColor={arrow.color ? arrow.color : '#3568c1'}
            headColor={arrow.color ? arrow.color : '#3568c1'}
            path='grid'
            // showHead={true}
            startAnchor={{ position: 'top', offset: { y: -1 } }}
            // arrowHeadProps={{ transform: 'rotate(180deg)' }}
            // endAnchor={{ position: 'top', offset: { y: -40 } }}
            // gridBreak='50'
            endAnchor={arrow.endAnchor as anchorType}
            // startAnchor={arrow.startAnchor as anchorType}
            strokeWidth={3}
            // headSize={6}
            // _debug={true}
            _cpy1Offset={-30}
            _cpy2Offset={-30}
          />
        ))}
        {/* <div id='grid-heading'>Telescope Assembly Network Diagram</div> */}
        {/* <div id='card-container'>{renderCardRows(buildCardRows())}</div> */}
        {/* 5x14 */}
        <div id='grid-container'>
          <table id='grid'>
            <span id='swim-lane-background'></span>
            <caption id='grid-heading'>
              Telescope Assembly Network Diagram
            </caption>
            <tbody className='tablebody'>
              {buildGrid(gridWidth, gridHeight)}
            </tbody>
          </table>
        </div>
      </Xwrapper>
      <button
        type='button'
        onClick={() => {
          checkGrid();
        }}
      >
        SUBMIT
      </button>
    </>
  );
};

export default Grid;
