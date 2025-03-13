"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { DataUnit } from "@/components/DataUnit";
import { DockingStation } from "@/components/DockingStation";


export default function Home() {
  // Matter.js Engine Configuration
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [engineReady, setEngineReady] = useState(false);

  // Initialization of Engine and Renderer
  useEffect(() => {
    // Initialize Physics Engine
    const engine = Matter.Engine.create(); // Create physics engine
    const world = engine.world; // Get the physics world
    engineRef.current = engine;

    // Initialize Matter.js Renderer
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 1000,
        height: 600,
        background: 'transparent', // Allows custom styling
        wireframes: true, // Disable when not debugging
      },
    });

    // Save render instance
    renderRef.current = render;

    // Start the physics engine and renderer
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Integrate with user input (mouse) and enable dragging
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    });

    // Add static boundaries to the canvas (Walls and Floor)
    const boundaries = [
      Matter.Bodies.rectangle(500, 0, 1000, 20, { isStatic: true }), // Top wall
      Matter.Bodies.rectangle(500, 600, 1000, 20, { isStatic: true }), // Bottom floor
      Matter.Bodies.rectangle(0, 300, 20, 600, { isStatic: true }), // Left wall
      Matter.Bodies.rectangle(1000, 300, 20, 600, { isStatic: true }), // Right wall
    ];

    // Add the Engine's world to the overall world
    Matter.World.add(world, [...boundaries, mouseConstraint]);

    // Global velocity limiting for all bodies
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const maxSpeed = 10; // Maximum speed limit
      const bodies = Matter.Composite.allBodies(world);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        // Skip static bodies
        if (body.isStatic) continue;

        // Apply velocity limiting to all non-static bodies
        if (Matter.Body.getSpeed(body) > maxSpeed) {
          Matter.Body.setVelocity(
            body,
            Matter.Vector.mult(Matter.Body.getVelocity(body), 0.8)
          );
        }
      }
    });

    // Mark the engine as ready
    setEngineReady(true);

    // Clean up the world, engine, and renderer when component unmounts/re-renders
    return () => { 
      if (mouseConstraint) {
        Matter.World.remove(world, mouseConstraint);
      }
      Matter.Events.off(engine, 'beforeUpdate');
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      render.canvas.remove();
      Matter.Runner.stop(runner);
    };
  }, []);

  // Enable collision detection for docking station
  // useCollisionDetection(engineRef, dockingStationRef, () => alert('Inserted Project into docking station'));

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <h1 className="text-3xl mb-4">Insert Your Data Unit</h1>
      <div ref={sceneRef} className="relative w-[1000px] h-[600px]">
        {engineReady && (
          <>
            <DockingStation engine={engineRef} />
            <DataUnit engine={engineRef} renderRef={renderRef} label="Project 1" />
            <DataUnit engine={engineRef} renderRef={renderRef} label="Project 2" />
            <DataUnit engine={engineRef} renderRef={renderRef} label="Project 3" />
          </>
        )}
      </div>
    </main>
  );
}
