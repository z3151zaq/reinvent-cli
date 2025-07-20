function hijackWinCmd(cmd) {
    const path = require('path');
    const fs = require('fs');
    const { execSync } = require('child_process');
    
    // Get fakeCmd directory path
    const fakeCmdDir = path.resolve(__dirname, '../fakeCmd');
    console.log('=== fakeCmd Directory Path ===');
    console.log(fakeCmdDir);
    
    // Check if directory exists, create if not
    if (!fs.existsSync(fakeCmdDir)) {
        console.log('📁 fakeCmd directory does not exist, creating...');
        fs.mkdirSync(fakeCmdDir, { recursive: true });
        console.log('✅ fakeCmd directory created successfully');
    }
    
    // If cmd parameter is provided, check and create corresponding cmd file
    if (cmd) {
        console.log(`=== Checking if command "${cmd}" exists ===`);
        
        try {
            // Check if command exists using where
            const whereResult = execSync(`where ${cmd}`, { encoding: 'utf-8' });
            if (!whereResult.trim()) {
                console.error(`❌ Command "${cmd}" does not exist on your system`);
                console.log(`💡 Please check if "${cmd}" is installed and available in PATH`);
                console.log(`💡 Cannot create hijack file for non-existent command`);
                return;
            }
            console.log(`✅ Command "${cmd}" exists on your system`);
            
            const cmdFilePath = path.join(fakeCmdDir, `${cmd}.cmd`);
            console.log(`=== Checking ${cmd}.cmd file ===`);
            console.log(cmdFilePath);
            
            if (!fs.existsSync(cmdFilePath)) {
                console.log(`📝 ${cmd}.cmd file does not exist, creating...`);
                
                // Create cmd file content
                const cmdContent = `@ECHO OFF\nreinvent ${cmd} %*`;
                
                try {
                    fs.writeFileSync(cmdFilePath, cmdContent, 'utf8');
                    console.log(`✅ ${cmd}.cmd file created successfully`);
                    console.log(`📄 File content:`);
                    console.log(cmdContent);
                } catch (error) {
                    console.error(`❌ Failed to create ${cmd}.cmd file:`, error.message);
                    return;
                }
            } else {
                console.log(`✅ ${cmd}.cmd file already exists`);
            }
        } catch (error) {
            console.error(`❌ Command "${cmd}" does not exist on your system`);
            console.log(`💡 Please check if "${cmd}" is installed and available in PATH`);
            console.log(`💡 Cannot create hijack file for non-existent command`);
            return;
        }
    }
    
    // Get current system-level PATH environment variable
    let systemPath = '';
    try {
        systemPath = execSync('powershell -Command "[Environment]::GetEnvironmentVariable(\'PATH\', \'Machine\')"', { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error('❌ Cannot get system-level PATH');
        console.log('💡 Please run command prompt as administrator');
        return;
    }
    
    const pathArray = systemPath.split(';').filter(p => p.trim() !== '');
    
    console.log('\n=== Current System-level PATH Environment Variable ===');
    pathArray.forEach((p, index) => {
        console.log(`${index + 1}. ${p}`);
    });
    
    // Check if fakeCmd path is already in PATH and remove all duplicates
    const uniquePaths = [];
    const seenPaths = new Set();
    
    // First, add fakeCmd path
    uniquePaths.push(fakeCmdDir);
    seenPaths.add(fakeCmdDir.toLowerCase());
    
    // Then add all other unique paths
    pathArray.forEach(p => {
        const normalizedPath = p.toLowerCase();
        if (!seenPaths.has(normalizedPath)) {
            uniquePaths.push(p);
            seenPaths.add(normalizedPath);
        }
    });
    
    const isInPath = pathArray.some(p => p.toLowerCase() === fakeCmdDir.toLowerCase());
    
    if (isInPath) {
        console.log('\n✅ fakeCmd path is already in environment variable, no action needed');
        return; // Do nothing if already exists
    } else {
        console.log('\n❌ fakeCmd path is not in environment variable, adding to top...');
    }
    
    console.log('🔧 Rebuilding PATH with fakeCmd at the top and removing all duplicates...');
    
    const finalPathArray = uniquePaths;
    
    const finalPathString = finalPathArray.join(';');
    
    // Try to modify system-level environment variable (requires admin privileges)
    try {
        const systemCommand = `powershell -Command "[Environment]::SetEnvironmentVariable('PATH', '${finalPathString}', 'Machine')"`;
        execSync(systemCommand, { stdio: 'inherit' });
        console.log('✅ Successfully modified system-level environment variable');
        
        console.log('\n=== Updated PATH Environment Variable (fakeCmd highest priority) ===');
        finalPathArray.forEach((p, index) => {
            if (index === 0) {
                console.log(`${index + 1}. ${p} ← fakeCmd (highest priority)`);
            } else {
                console.log(`${index + 1}. ${p}`);
            }
        });
        
        console.log('\n✅ fakeCmd path has been permanently added to the top of system environment variable (highest priority)');
        console.log('🔄 Please reopen command prompt or restart application for changes to take effect');
        
        // Also update current process environment variable
        process.env.PATH = finalPathString;
        
    } catch (systemError) {
        console.error('❌ Cannot modify system-level environment variable');
        console.log('💡 Please run this program as administrator');
        return;
    }
}

module.exports = { hijackWinCmd };