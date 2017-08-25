module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'mymvs',
      script: 'app.js',
      env: {
        
      }
    }
  ],

  deploy: {
    
  }
};
