import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production'; // For future deployment

// need to load these explicitly as the sequelise packages would not load internally
const nextConfig: NextConfig = {
    serverExternalPackages: ['sequelize', 'sqlite3', 'bcrypt'],
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    
    // Disable ESLint and TypeScript checks during production build
    // Suppress linting warning
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // Webpack configurations to load wire-up external packages
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = [
                ...(Array.isArray(config.externals) ? config.externals : []),
                { sqlite3: 'commonjs sqlite3', sequelize: 'commonjs sequelize', bcrypt: 'commonjs bcrypt' },
            ];
            config.externalsPresets = { node: true };
            config.ignoreWarnings = [
                { module: /node_modules\/sequelize\/lib/ },
                /Critical dependency: the request of a dependency is an expression/,
            ];
        }
        return config;
    },

    // Compiler optimisations introduced for failing ec2 builds
    compiler: isProd
        ? {
            removeConsole: {
                exclude: ['error', 'warn'], // Keep error and warn logs
            },
        }
        : undefined,

};

export default nextConfig;