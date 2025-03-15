import Matter from 'matter-js';

let globalMouse: Matter.Mouse | null = null;
let globalMouseConstraint: Matter.MouseConstraint | null = null;

// Initialize the mouse and mouse constraint for the whole project
// The mouse is pretty much built into the mouseConstraint, so returning only the mouseConstraint does the job
export const initMouseConstraint = (   
  engine: Matter.Engine,
  canvas: HTMLCanvasElement
): Matter.MouseConstraint => {
  globalMouse = Matter.Mouse.create(canvas);
  globalMouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: globalMouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false },
    },
  });

  return globalMouseConstraint;
};


// Reusable function to release bodies from the mouse with a mouse up event
export const releaseBodyFromMouse = () => {
  if(!globalMouseConstraint || !globalMouseConstraint.body) return;

  // Limit the velocity of the released body to prevent clipping and bugs
  Matter.Body.setVelocity(globalMouseConstraint.body, {
    x: globalMouseConstraint.body.velocity.x * 0.3,
    y: globalMouseConstraint.body.velocity.y * 0.3
  });

  if(globalMouse?.element) {
    const mouseUpEvent = new MouseEvent('mouseup');
    (globalMouse.element as HTMLElement).dispatchEvent(mouseUpEvent);
  }
};


// Make the mouse constraint accessible to other components when needed
export const getMouseConstraint = (): Matter.MouseConstraint | null => {
  return globalMouseConstraint;
};