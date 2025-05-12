document.addEventListener('DOMContentLoaded', function() {
    // Matrix background effect
    const canvas = document.createElement('canvas');
    const matrixContainer = document.getElementById('matrix-canvas');
    matrixContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
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
    
    // Speed variation for each column
    const speeds = [];
    
    // Color offset for animation
    let colorOffset = 0;
    
    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops = [];
    
    // Initialize all columns
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height);
        speeds[i] = Math.random() * 0.5 + 0.5; // Random speed between 0.5 and 1
    }
    
    // Draw the matrix effect
    function draw() {
        // Add semi-transparent black rectangle to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set font style
        ctx.font = fontSize + 'px monospace';
        
        // Loop through each column
        for (let i = 0; i < drops.length; i++) {
            // Choose a random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // Choose a color based on the column position (rainbow effect) with animation
            const colorIndex = Math.floor(((i / columns) * rainbowColors.length + colorOffset) % rainbowColors.length);
            ctx.fillStyle = rainbowColors[colorIndex];
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset the drop when it reaches the bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                // Occasionally change the speed
                if (Math.random() > 0.8) {
                    speeds[i] = Math.random() * 0.5 + 0.5;
                }
            }
            
            // Move the drop down at its specific speed
            drops[i] += speeds[i];
        }
    }
    
    // Run the animation
    setInterval(() => {
        draw();
        // Slowly cycle the colors
        colorOffset += 0.01;
        if (colorOffset >= rainbowColors.length) {
            colorOffset = 0;
        }
    }, 35);
    
    // Add VHS glitch effects randomly
    function addRandomGlitch() {
        const glitchText = document.querySelector('.glitch-text');
        
        // Add a temporary stronger glitch class
        glitchText.classList.add('heavy-glitch');
        
        // Remove it after a short time
        setTimeout(() => {
            glitchText.classList.remove('heavy-glitch');
        }, 200);
        
        // Schedule next glitch
        setTimeout(addRandomGlitch, Math.random() * 5000 + 2000);
    }
    
    // Start random glitches
    setTimeout(addRandomGlitch, 2000);
});