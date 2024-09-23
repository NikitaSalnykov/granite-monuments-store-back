module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./server.js",
        watch: false,
        env: {
          DB_HOST: "mongodb://127.0.0.1:27017/memorial-service",
META_PASSWORD:"Kolokol010",
SECRET_KEY:"hehehe",
REFRESH_SECRET_KEY:"eheheh",
API_KEY:"698794858249293",
API_SECRET:"AhPDG8JTqwp6RvRjA4RODNcFgig",
        }
      }
  ]
}
