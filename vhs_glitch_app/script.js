document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded");
    
    // Get canvas and context
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeParticles(); // Reinitialize particles on resize
    });
    
    // Matrix characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>/?~`';
    
    // Rainbow colors
    const rainbowColors = [
        '#FF0000', // Red
        '#FF7F00', // Orange
        '#FFFF00', // Yellow
        '#00FF00', // Green
        '#0000FF', // Blue
        '#4B0082', // Indigo
        '#9400D3'  // Violet
    ];
    
    // Text to form
    const text = "HELLO MATRIX";
    
    // Font settings
    const fontSize = 14;
    const textFontSize = Math.min(canvas.width / 10, 120);
    
    // Animation timing (60 seconds total)
    const animationDuration = 60000; // 60 seconds in milliseconds
    const startTime = Date.now();
    
    // Matrix streams
    const streams = [];
    const streamCount = Math.floor(canvas.width / fontSize);
    
    // Text particles
    let textParticles = [];
    
    // Initialize matrix streams
    function initializeStreams() {
        for (let i = 0; i < streamCount; i++) {
            streams.push({
                x: i * fontSize,
                y: Math.random() * canvas.height * -2, // Start above the canvas
                speed: Math.random() * 0.5 + 0.5,
                characters: [],
                color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
            });
            
            // Fill stream with random characters
            const length = Math.floor(Math.random() * 20) + 5;
            for (let j = 0; j < length; j++) {
                streams[i].characters.push(characters.charAt(Math.floor(Math.random() * characters.length)));
            }
        }
    }
    
    // Get text pixel positions
    function getTextPixels() {
        // Create temporary canvas for text measurement
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw text
        tempCtx.font = `bold ${textFontSize}px monospace`;
        tempCtx.fillStyle = '#00FF00';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Get pixel data
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;
        
        // Sample pixels to create particles
        const sampleRate = 3; // Sample every 3 pixels for better density
        const textPixels = [];
        
        for (let y = 0; y < tempCanvas.height; y += sampleRate) {
            for (let x = 0; x < tempCanvas.width; x += sampleRate) {
                const index = (y * tempCanvas.width + x) * 4;
                const alpha = pixels[index + 3];
                
                // If pixel is part of text (alpha > 0)
                if (alpha > 0) {
                    textPixels.push({ x, y });
                }
            }
        }
        
        return textPixels;
    }
    
    // Initialize text particles
    function initializeParticles() {
        const textPixels = getTextPixels();
        textParticles = [];
        
        for (let i = 0; i < textPixels.length; i++) {
            const pixel = textPixels[i];
            
            textParticles.push({
                // Start from random position
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                // Target position (text pixel)
                targetX: pixel.x,
                targetY: pixel.y,
                // Random speed
                speed: Math.random() * 0.5 + 0.5,
                // Random color from rainbow
                color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
                // Not yet arrived at target
                arrived: false,
                // Random character
                char: characters.charAt(Math.floor(Math.random() * characters.length)),
                // Visibility (will be controlled by animation progress)
                visible: false
            });
        }
        
        console.log(`Created ${textParticles.length} particles`);
    }
    
    // Draw matrix streams
    function drawStreams() {
        // Add semi-transparent black rectangle to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set font style
        ctx.font = `${fontSize}px monospace`;
        
        // Draw each stream
        for (let i = 0; i < streams.length; i++) {
            const stream = streams[i];
            
            // Update stream position
            stream.y += stream.speed;
            
            // If stream is off screen, reset it
            if (stream.y > canvas.height + stream.characters.length * fontSize) {
                stream.y = Math.random() * canvas.height * -2;
                stream.speed = Math.random() * 0.5 + 0.5;
                stream.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
            }
            
            // Draw characters in stream
            for (let j = 0; j < stream.characters.length; j++) {
                // Occasionally change character
                if (Math.random() > 0.95) {
                    stream.characters[j] = characters.charAt(Math.floor(Math.random() * characters.length));
                }
                
                // Calculate position
                const y = stream.y - j * fontSize;
                
                // Only draw if on screen
                if (y > -fontSize && y < canvas.height) {
                    // Head of stream is brighter
                    if (j === 0) {
                        ctx.fillStyle = '#FFFFFF';
                    } else {
                        ctx.fillStyle = stream.color;
                    }
                    
                    // Draw character
                    ctx.fillText(stream.characters[j], stream.x, y);
                }
            }
        }
    }
    
    // Draw text particles
    function drawTextParticles(progress) {
        // Set font style
        ctx.font = `${fontSize}px monospace`;
        
        // Draw each particle
        for (let i = 0; i < textParticles.length; i++) {
            const p = textParticles[i];
            
            // Only start moving particles based on animation progress
            // Gradually reveal more particles as animation progresses
            if (i / textParticles.length > progress) {
                continue;
            }
            
            p.visible = true;
            
            // If not arrived at target
            if (!p.arrived) {
                // Move towards target
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If close enough to target, mark as arrived
                if (distance < 5) {
                    p.arrived = true;
                    p.x = p.targetX;
                    p.y = p.targetY;
                } else {
                    // Move towards target
                    p.x += dx * 0.03 * p.speed;
                    p.y += dy * 0.03 * p.speed;
                    
                    // Occasionally change character
                    if (Math.random() > 0.9) {
                        p.char = characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                }
            }
            
            // Draw particle
            if (p.visible) {
                ctx.fillStyle = p.arrived ? '#00FF00' : p.color;
                
                // Add glow effect for arrived particles
                if (p.arrived) {
                    ctx.shadowColor = '#00FF00';
                    ctx.shadowBlur = 5;
                }
                
                ctx.fillText(p.char, p.x, p.y);
                
                // Reset shadow
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // Add scan lines effect
    function drawScanLines() {
        // Draw scan lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < canvas.height; y += 2) {
            ctx.fillRect(0, y, canvas.width, 1);
        }
        
        // Draw random glitch lines
        if (Math.random() > 0.97) {
            ctx.fillStyle = 'rgba(32, 128, 32, 0.2)';
            const y = Math.random() * canvas.height;
            const height = Math.random() * 10 + 1;
            ctx.fillRect(0, y, canvas.width, height);
        }
    }
    
    // Animation loop
    function animate() {
        // Calculate animation progress (0 to 1)
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1.0);
        
        // Draw matrix streams
        drawStreams();
        
        // Draw text particles with progress
        drawTextParticles(progress);
        
        // Draw scan lines
        drawScanLines();
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    initializeStreams();
    initializeParticles();
    animate();
    
    console.log("Animation started");
});