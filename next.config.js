module.exports = {
    reactStrictMode: true,
    siteURL:
        process.env.NODE_ENV !== "development"
            ? `http://localhost:${process.env.PORT || 3000}`
            : "https://daily-coding-article.herokuapp.com",
};
