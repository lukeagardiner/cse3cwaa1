import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
    // External packages that shouldn't be bundled
    serverExternalPackages: ['sequelize', 'sqlite3', 'bcrypt'],

    // Webpack customization with proper typing
    webpack: (config, context) => {
        const { isServer } = context;

        if (isServer) {
            // Development-only: more detailed logging
            if (isDev) {
                config.stats = 'verbose';
            }

            // Externalize native Node.js modules
            config.externals = config.externals || [];

            if (Array.isArray(config.externals)) {
                config.externals.push({
                    'sqlite3': 'commonjs sqlite3',
                    'sequelize': 'commonjs sequelize',
                    'bcrypt': 'commonjs bcrypt',
                });
            }

            // Enable Node.js built-ins
            config.externalsPresets = { node: true };
        }

        // Production optimizations
        if (isProd && config.optimization) {
            config.optimization.minimize = true;
        }

        // Suppress known Sequelize warnings
        config.ignoreWarnings = [
            { module: /node_modules\/sequelize\/lib/ },
            /Critical dependency: the request of a dependency is an expression/,
        ];

        return config;
    },

    // Compiler optimizations for production
    compiler: isProd
        ? {
            removeConsole: {
                exclude: ['error', 'warn'], // Keep error and warn logs
            },
        }
        : undefined,

    // React optimizations
    reactStrictMode: true,

    // Security headers
    poweredByHeader: false,

    // Compression
    compress: true,
};

export default nextConfig;