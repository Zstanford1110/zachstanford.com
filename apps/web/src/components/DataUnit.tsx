"use client";

import { useEffect } from "react";
import Matter from "matter-js";

interface DataUnitProps {
  label: string;
  engine: React.RefObject<Matter.Engine | null>;
  renderRef: React.RefObject<Matter.Render | null>;
}

export const DataUnit = ({ label, engine, renderRef }: DataUnitProps) => {

  useEffect(() => {
    // Check if engine is running
    if (!engine.current) {
      console.log("❌ Engine is not ready yet for:", label);
      return;
    }

    if(!renderRef.current) {
      console.log("❌ Render is not ready yet for:", label);
      return;
    }

    // Access the engine from props
    const world = engine.current.world;

    // Create the data unit
    const dataUnit = Matter.Bodies.rectangle(200, 100, 80, 40, {
      label: "DataUnit",
      render: {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: 2,
      },
    });

    // Add the data unit to the physics world
    Matter.World.add(world, dataUnit);

    console.log("DataUnit added to world:", Matter.Composite.allBodies(world));
  }, [engine, renderRef, label]);

  return (
    <div className="text-center text-sm text-white">
      {label}
    </div>
  );
};
