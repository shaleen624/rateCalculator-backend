module.exports = {
    apps: [
      {
        name: 'rate-calculator',
        script: 'app.js', // Replace with the entry point of your Node.js app
        exec_mode: 'cluster',
        instances: 'max',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 443, // Set the HTTPS port here
          HTTPS: true, // Enable HTTPS
          SSL_KEY: '/opt/bitnami/letsencrypt/certificates/rc-dev.fluffpandastore.com.key', // Path to your private key file
          SSL_CERT: '/opt/bitnami/letsencrypt/certificates/rc-dev.fluffpandastore.com.crt' // Path to your certificate file
        }
      }
    ]
  };
  