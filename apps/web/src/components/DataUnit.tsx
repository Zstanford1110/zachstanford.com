"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

interface DataUnitProps {
  label: string;
  engine: React.RefObject<Matter.Engine | null>;
  renderRef: React.RefObject<Matter.Render | null>;
}

export const DataUnit = ({ label, engine, renderRef }: DataUnitProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const addedToWorld = useRef(false);
  const dataUnitRef = useRef<Matter.Body | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Width and height of each data unit
  const width = 100;
  const height = 40;

  useEffect(() => {
    // Check if engine is running
    if (!engine.current) {
      console.log("Engine is not ready yet for:", label);
      return;
    }

    // Check if renderer is running
    if (!renderRef.current) {
      console.log("Renderer is not ready yet for:", label);
      return;
    }

    // If this data unit exists in the physic world, exit here
    if (addedToWorld.current) return;

    // Update the ref to mark that the data unit has been created and added to the world
    addedToWorld.current = true;

    // Access the active physics world from props
    const world = engine.current.world;

    // Create the data unit
    const dataUnit = Matter.Bodies.rectangle(200, 100, width, height, {
      label: "DataUnit" + "-" + label,
      restitution: 0.2, // Reduces bouncing
      friction: 0.5, // Adds realistic surface resistance
      frictionAir: 0.02, // Limits object acceleration
      render: {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: 2,
      },
    });

    // Add the data unit to the physics world
    Matter.World.add(world, dataUnit);
    dataUnitRef.current = dataUnit;

    console.log("DataUnit added to world:", Matter.Composite.allBodies(world));
  }, [engine, renderRef, label]);

  // Animation loop to update the location of the label to match the data unit
  useEffect(() => {
    if (!dataUnitRef.current) return;

    // Function to constantly update the label position for each data unit
    const updateLabelPosition = () => {
      const { x, y } = dataUnitRef.current!.position;
      const { angle } = dataUnitRef.current!;

      setPosition((prev) => ({
        ...prev,
        x: x, // Center label horizontally
        y: y, //  Center label vertically
        rotation: angle, // Make the label rotate
      }));

      animationFrameRef.current = requestAnimationFrame(updateLabelPosition);
    };

    updateLabelPosition(); // Start loop

    // Cancel animation on unmount
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [renderRef]);

  return (
    <>
      {/* Debug CSS Position of Data Unit
        <div className="absolute text-xs bg-red-500 p-1" style={{ top: 0, left: 0 }}>
          {label}: {position.x.toFixed(2)}, {position.y.toFixed(2)}
        </div> 
      */}


      <div
        className="text-center text-sm text-white"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${position.rotation}rad)`,
          pointerEvents: "none",
        }}
      >
        {label}
      </div>
    </>
  );
};
