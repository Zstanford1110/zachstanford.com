import { useEffect } from 'react';
import Matter from 'matter-js';

export const useCollisionDetection = (
  engineRef: React.RefObject<Matter.Engine | null>,
  bodyRef: React.RefObject<Matter.Body | null>,
  collision: () => void
) => {
  useEffect(() => {
    // Check if the engine and collision body are initialized
    if (!engineRef.current || !bodyRef.current) return;

    const engine = engineRef.current;
    const body = bodyRef.current;

    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      // Access the pairs recorded by collision events by Matter
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        // Each pair comes with two bodies that are interacting
        const { bodyA, bodyB } = pair;

        // Check to see if the colliding bodies include the body we wish to detect collisions for
        if (bodyA === body || bodyB === body) {
          // Execute callback function provided by component calling the collision hook
          collision();
          break;
        }
      }
    };

    // Add event listener for collisions
    Matter.Events.on(engine, 'collisionStart', handleCollision);

    // Cleanup function to remove event listener on unmount
    return () => {
      Matter.Events.off(engine, 'collisionStart', handleCollision);
    }
  }, [engineRef, bodyRef, collision]);
};