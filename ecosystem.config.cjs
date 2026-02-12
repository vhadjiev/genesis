module.exports = {
    apps: [
        {
            name: 'aquasync-console',
            script: './node_modules/next/dist/bin/next',
            args: 'start',
            // cwd is not set - PM2 will use the current working directory when the config is loaded
            // This allows the script to cd into the symlink directory before starting PM2
            instances: 1,
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            env_development: {
                NODE_ENV: 'production',
                PORT: 3000,
                APP_URL: 'https://dev.aquasync.app',
            },
            max_memory_restart: '1G',
            kill_timeout: 5000,
            wait_ready: true,
            listen_timeout: 10000,
            restart_delay: 1000,
            autorestart: true,
            watch: false,
            ignore_watch: ['node_modules', '.next', '.git', 'logs'],
            env_file: '/var/www/dev.aquasync.app/shared/.env',
            shutdown_with_message: true,
            // Use local logs directory instead of /var/log/pm2 (requires root)
            error_file: './logs/aquasync-console-error.log',
            out_file: './logs/aquasync-console-out.log',
            log_file: './logs/aquasync-console.log',
            time: true,
        },
    ],
}
