import os from 'os';

/**
 * Get system information
 * @returns {Object} System information object
 */
function getSystemInfo() {
  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      userInfo: os.userInfo(),
      networkInterfaces: os.networkInterfaces()
    };

    return systemInfo;
  } catch (error) {
    console.error('Error getting system info:', error);
    throw new Error('Failed to get system information');
  }
}

export default getSystemInfo;