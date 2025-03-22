import Matter from 'matter-js';

let mouse: Matter.Mouse | null = null;
let mouseConstraint: Matter.MouseConstraint | null = null;

// Initialize the mouse and mouse constraint for the whole project
// The mouse is pretty much built into the mouseConstraint, so returning only the mouseConstraint does the job
export const initMouseConstraint = (   
  engine: Matter.Engine,
  canvas: HTMLCanvasElement
): Matter.MouseConstraint => {
  mouse = Matter.Mouse.create(canvas);
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false },
    },
  });
  return mouseConstraint;
};

// Reusable function to release bodies from the mouse with a mouse up event
export const releaseBodyFromMouse = () => {
  if(!mouseConstraint || !mouseConstraint.body) return;

  // Limit the velocity of the released body to prevent clipping and bugs
  Matter.Body.setVelocity(mouseConstraint.body, {
    x: mouseConstraint.body.velocity.x * 0.3,
    y: mouseConstraint.body.velocity.y * 0.3
  });

  if(mouse?.element) {
    const mouseUpEvent = new MouseEvent('mouseup');
    (mouse.element as HTMLElement).dispatchEvent(mouseUpEvent);
  }
};

// Function that returns if the targeted body is being dragged by the mouse or not
export const isBodyBeingDragged = (
  body: Matter.Body
): boolean => {
  return !!(mouseConstraint && mouseConstraint.body && mouseConstraint.body.id === body.id);
};


// Make the mouse constraint accessible to other components when needed
export const getMouseConstraint = (): Matter.MouseConstraint | null => {
  return mouseConstraint;
};