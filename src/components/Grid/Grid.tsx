import React, { useState } from 'react';
import Xarrow, { anchorType, Xwrapper } from 'react-xarrows';
// Allowed means cards it can connect to

import GridCards from './gridData.json';
import DraggableCard from './DraggableCard';
import './Grid.css';

// column-row : id
const solutionsCards = {
  '1-7': 1,
  '1-6': 2,
  '2-6': 3,
  '3-6': 4,
  '4-4': 9,
  '4-6': 5,
  '5-4': 10,
  '5-6': 6,
  '5-7': 8,
  '6-6': 7,
  '7-4': 11,
  '7-5': 12,
  '8-4': 13,
  '8-5': 17,
  '9-4': 14,
  '9-7': 16,
  '10-5': 15,
  '12-5': 18,
  '12-7': 19,
  '12-3': 20,
  '13-3': 21,
};

const Grid: React.FC = () => {
  const [correct, setCorrect] = useState<number[]>([]);
  // If both are complete that means the activity is done
  const [arrowsComplete, setArrowsComplete] = useState(false);
  const [gridComplete, setGridComplete] = useState(false);

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
    startAnchor: {},
    _cpy1Offset: 0,
    _cpy2Offset: 0,
  });
  const [arrows, setArrows] = useState<
    {
      start: string;
      end: string;
      allowed: string;
      color?: string;
      endAnchor: string;
      startAnchor: string | {};
      _cpy1Offset: number;
      _cpy2Offset: number;
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
                    className='draggableBox'
                  >
                    <DraggableCard
                      id={`draggableCard${card.id}`}
                      cardData={card}
                      key={cardindex}
                      handleConnection={handleConnection}
                      disabled={correct}
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
                      disabled={correct}
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

    // Disconnect arrow
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
      const startCardIndex = currentTarget.split('draggableCard')[1] - 1;
      event.target.style.backgroundColor = 'white';
      // add second point
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
      setTimeout(() => {
        // Get First card
        const startCard = document.querySelector(
          `[data-id='${startCardIndex}'] `
        ) as any;
        const childElement: HTMLImageElement = startCard.children[0];
        // Change background for on click
        childElement.style.backgroundColor = 'transparent';
        event.target.style.backgroundColor = 'transparent';
      }, 1000);
      setCurrentArrow({
        start: '',
        end: '',
        allowed: '',
        endAnchor: '',
        startAnchor: '',
        _cpy1Offset: 0,
        _cpy2Offset: 0,
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
        _cpy1Offset: 0,
        _cpy2Offset: 0,
      });
    } else {
      event.target.style.backgroundColor = 'white';
      // create new line
      setCurrentArrow({
        ...currentArrow,
        start: currentTarget,
        allowed: event.target.parentNode.dataset.allowed,
        // endAnchor: '',
        startAnchor: GridCards.data[indexData].startAnchor,
        _cpy1Offset: GridCards.data[indexData]._cpy1Offset || 0,
        _cpy2Offset: GridCards.data[indexData]._cpy2Offset || 0,
      });
    }
  };

  const checkGrid = () => {
    let incorrectColumn: string;
    let incorrectLine = false;
    setArrows(
      arrows.map((lines, i) => {
        const search = lines.end.replace('draggableCard', '');
        if (lines.allowed.split(',').includes(search)) {
          // correct
          console.log('i', i);
          if (i === 22 && !incorrectLine) {
            // All arrows are correct
            setArrowsComplete(true);
            if (gridComplete) {
              alert('finished');
            }
          }
          return { ...lines, color: 'green' };
        }
        // clears incorrect arrows after 3 seconds
        setTimeout(() => {
          setArrows((arrows) =>
            arrows.filter(
              (line) => line.start !== lines.start && line.end !== lines.end
            )
          );
        }, 3000);
        incorrectLine = true;
        return { ...lines, color: 'red' };
      })
    );
    // Check grid here
    Object.entries(solutionsCards).forEach(([key, value], i, array) => {
      const solutionKey = key.split('-');

      const correctGridLocation = document.querySelector(
        `[data-row='${solutionKey[1]}'] [data-column='${solutionKey[0]}'] `
      ) as HTMLElement;
      const currentCard = document.querySelector(
        `[data-id='${value}'] `
      ) as HTMLElement;
      const gridBoundaries = correctGridLocation.getBoundingClientRect();
      const cardLocation = currentCard.getBoundingClientRect();

      if (
        cardLocation.x > gridBoundaries.left &&
        cardLocation.x < gridBoundaries.right &&
        cardLocation.y > gridBoundaries.top &&
        cardLocation.y < gridBoundaries.bottom
      ) {
        currentCard.style.backgroundColor = 'green';
        correctGridLocation.style.backgroundColor = '#fff';

        setCorrect((prevState: number[]) => {
          // Object.assign would also work
          return [...prevState, value];
        });
        if (array.length === i + 1) {
          setGridComplete(true);
          if (arrowsComplete) {
            alert('finished');
          }
        }
      } else {
        if (!incorrectColumn || incorrectColumn === solutionKey[0]) {
          incorrectColumn = solutionKey[0];
          correctGridLocation.style.backgroundColor = 'red';
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
            endAnchor={arrow.endAnchor as anchorType}
            startAnchor={arrow.startAnchor as anchorType}
            strokeWidth={2}
            headSize={4}
            _cpy1Offset={arrow._cpy1Offset}
            _cpy2Offset={arrow._cpy2Offset}
          />
        ))}
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
