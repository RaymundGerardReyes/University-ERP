const fs = require('fs');
const path = require('path');

function stripBomAndFixLineEndings(filePath) {
    let content = fs.readFileSync(filePath);

    // Detect and remove UTF-8 BOM (EF BB BF)
    if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
        content = content.subarray(3);
    }

    // Detect and convert UTF-16 LE BOM (FF FE)
    if (content[0] === 0xFF && content[1] === 0xFE) {
        content = Buffer.from(content.toString('utf16le'), 'utf8');
    }

    // Convert buffer to string
    let text = content.toString('utf8');

    // Normalize Windows CRLF line endings to Linux LF
    text = text.replace(/\r\n/g, '\n');

    // Write the clean, pure UTF-8 text back to the file
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`[FIXED] Cleaned encoding for: ${path.basename(filePath)}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Ignore bin and obj folders to speed up processing
            if (file !== 'bin' && file !== 'obj') {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.csproj')) {
            stripBomAndFixLineEndings(fullPath);
        }
    }
}

// Target the specific backend module directories
const backendModulesRoot = path.join(__dirname, 'University-ERP-Backend', 'src', 'Modules');
const targetDirectories = ['Academic', 'StudentLifecycle'];

console.log('=============================================');
console.log(' Fixing .csproj Encodings for Docker (Linux) ');
console.log('=============================================\n');

targetDirectories.forEach(target => {
    const dirPath = path.join(backendModulesRoot, target);
    if (fs.existsSync(dirPath)) {
        console.log(`Scanning: ${target}...`);
        walkDir(dirPath);
    } else {
        console.log(`Directory not found: ${dirPath}`);
    }
});

console.log('\nSuccess: All targeted .csproj files are now pure, BOM-free UTF-8.');