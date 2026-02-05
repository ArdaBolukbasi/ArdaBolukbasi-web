"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MouseGlow() {
    const [isMobile, setIsMobile] = useState(false);

    // Smooth spring animation for the cursor
    const mouseX = useSpring(0, { stiffness: 2000, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 2000, damping: 100 });

    useEffect(() => {
        // Disable on touch devices/mobile to save battery and avoid obstruction
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", checkMobile);
        };
    }, [mouseX, mouseY]);

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
            <motion.div
                className="absolute w-[130px] h-[130px] rounded-full opacity-15 bg-purple-500 blur-[80px]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    mixBlendMode: "screen"
                }}
            />
        </motion.div>
    );
}
