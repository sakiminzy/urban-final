const path = require("path");

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "about.html"),
        community: path.resolve(__dirname, "community.html"),
        products: path.resolve(__dirname, "products.html"),
        subscribe: path.resolve(__dirname, "subscribe.html"),
        notFound: path.resolve(__dirname, "404.html"),
      },
    },
  },
};
