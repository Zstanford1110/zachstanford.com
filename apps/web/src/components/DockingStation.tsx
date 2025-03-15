'use client';

import { useEffect, useRef, useState } from "react";
import Matter from 'matter-js';
import { releaseBodyFromMouse } from "@/utils/mouseUtils";

interface DockingStationProps {
  engine: React.RefObject<Matter.Engine | null>;
}

export const DockingStation = ({ engine }: DockingStationProps) => {
  const dockingStationRef = useRef<Matter.Body | null>(null);
  const [loadedDataUnit, setLoadedDataUnit] = useState<Matter.Body | null>(null);

  useEffect(() => {
    // Verify that engine has started
    if (!engine.current) return;

    const currentEngine = engine.current;

    // Extract the world to add the Docking Station body to
    const world = engine.current.world;

    // Create the Docking Station body
    const dockingStation = Matter.Bodies.rectangle(400, 350, 100, 20, {
      isStatic: true,
      label: "DockingStation",
    });

    // Add the Docking Station to the physics world and save a reference for future updates
    Matter.World.add(world, dockingStation);
    dockingStationRef.current = dockingStation;

    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // ✅ Ensure we are detecting only DataUnits colliding with Docking Station
        const isDataUnitA = bodyA.label === "DataUnit";
        const isDataUnitB = bodyB.label === "DataUnit";
        const isDockingStationA = bodyA.label === "DockingStation";
        const isDockingStationB = bodyB.label === "DockingStation";

        if ((isDataUnitA && isDockingStationB) || (isDataUnitB && isDockingStationA)) {
          const dataUnit = isDataUnitA ? bodyA : bodyB;
          // If there isn't a data unit loaded or ready to be loaded (collision), if not we're done here
          if (loadedDataUnit || !dataUnit) return;

          // Release the mouse constraint if this data unit is being dragged
          releaseBodyFromMouse();

          // Magnetic lock for the data unit to secure it in the station
          Matter.Body.setStatic(dataUnit, true);
          Matter.Body.setPosition(dataUnit, { x: 400, y: 330 }) // Will need to adjust this value based on where I decide to put the docking station later
          Matter.Body.setAngle(dataUnit, 0);

          setLoadedDataUnit(dataUnit);
          console.log("Data Unit inserted into Docking Station");
        }
      })
    };

    // Create an event to check for collisions
    Matter.Events.on(engine.current, 'collisionStart', handleCollision);

    return () => {
      Matter.World.remove(world, dockingStation);
      Matter.Events.off(currentEngine, 'collisionStart', handleCollision);
    };
  }, [engine, loadedDataUnit]);

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-4 bg-gray-700 rounded-md text-white">
      <p>Docking Station</p>
      {loadedDataUnit && (
        <button
          className="mt-2 bg-red-500 px-3 py-1 rounded"
          onClick={() => {
            Matter.Body.setStatic(loadedDataUnit, false);
            Matter.Body.setVelocity(loadedDataUnit, { x: 0, y: -5 }); // Give slight upward movement on eject
            Matter.Body.setPosition(loadedDataUnit, { x: 200, y: 50 }); // Move it out of the docking station

            setLoadedDataUnit(null);
          }}
        >
          Eject
        </button>
      )}
    </div>
  );
};