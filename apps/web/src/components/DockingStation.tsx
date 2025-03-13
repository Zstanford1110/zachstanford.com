'use client';

import { useEffect, useRef, useState } from "react";
import Matter from 'matter-js';

interface DockingStationProps {
  engine: React.RefObject<Matter.Engine | null>;
}

export const DockingStation = ({ engine }: DockingStationProps) => {
  const dockingStationRef = useRef<Matter.Body | null>(null);
  const [loadedDataUnit, setLoadedDataUnit] = useState<Matter.Body | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verify that engine has started
    if (!engine.current) return;

    const currentEngine = engine.current;

    // Extract the world to add the Docking Station body to
    const world = engine.current.world;

    // Create the Docking Station body
    const dockingStation = Matter.Bodies.rectangle(500, 500, 125, 30, {
      isStatic: true,
      label: "DockingStation",
    });

    // Add the Docking Station to the physics world and save a reference for future updates
    Matter.World.add(world, dockingStation);
    dockingStationRef.current = dockingStation;

    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Ensure we are detecting only DataUnits colliding with Docking Station
        const isDataUnitA = bodyA.label === "DataUnit";
        const isDataUnitB = bodyB.label === "DataUnit";
        const isDockingStationA = bodyA.label === "DockingStation";
        const isDockingStationB = bodyB.label === "DockingStation";

        if ((isDataUnitA && isDockingStationB) || (isDataUnitB && isDockingStationA)) {
          const dataUnit = isDataUnitA ? bodyA : bodyB;
          // If there is a data unit loaded, do not allow another to be loaded
          if (loadedDataUnit || !dataUnit) return;

          // Simulated loading animation for data unit inserting into the docking station
          if (!isLoading) {
            setIsLoading(true);

            const targetPosition = { x: 500, y: 500 }; // Adjust to Docking Station location
            const attractionStrength = 0.005; // Smaller value = slower pull
            const stopThreshold = 10;
          
            const pullInterval = setInterval(() => {
              if (!dataUnit) return;
          
              const dx = targetPosition.x - dataUnit.position.x;
              const dy = targetPosition.y - dataUnit.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
          
              console.log(`🔍 Distance: ${distance}`);

              // Stop pulling when close enough
              if (distance < stopThreshold) {
                clearInterval(pullInterval);


                Matter.Body.setStatic(dataUnit, true);
                Matter.Body.setPosition(dataUnit, targetPosition);
                setLoadedDataUnit(dataUnit);
                setIsLoading(false);
                console.log('Data Unit Inserted!');
                return;
              }
          
              // Apply a weak force towards the docking station
              Matter.Body.applyForce(dataUnit, dataUnit.position, {
                x: dx * attractionStrength,
                y: dy * attractionStrength,
              });
            }, 16); 
          }
        }
      })
    };

    // Create an event to check for collisions
    Matter.Events.on(engine.current, 'collisionStart', handleCollision);

    return () => {
      Matter.World.remove(world, dockingStation);
      Matter.Events.off(currentEngine, 'collisionStart', handleCollision);
    };
  }, [engine, loadedDataUnit, isLoading]);

  return (
    <div>
      <p className="absolute bottom-21 left-1/2 transform -translate-x-1/2 py-1 px-1 bg-gray-700 text-white">Docking Station</p>
      {loadedDataUnit && !isLoading && (
        <button
          className="absolute bottom-21 left-[calc(50%+70px)] bg-red-500 px-3 py-1 rounded"
          onClick={() => {
            Matter.Body.setStatic(loadedDataUnit, false);
            Matter.Body.applyForce(loadedDataUnit, loadedDataUnit.position, { x: 0.05, y: -0.05 });

            setLoadedDataUnit(null);
          }}
        >
          Eject
        </button>
      )}
    </div>
  );
};