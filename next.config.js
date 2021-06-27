module.exports = {
    reactStrictMode: true,
    siteURL:
        process.env.NODE !== "development"
            ? `http://localhost:${process.env.PORT}`
            : "https://siteurl.com",
};
