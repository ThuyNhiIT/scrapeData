const scrapers = require("./scraper");
const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const indexs = [1, 2, 3, 4];
  try {
    const browser = await browserInstance;
    // gọi hàm cạo ở file s scrape
    const categories = await scrapers.scrapeCategory(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    console.log(selectedCategories);
    // console.log(categories);

    await scrapers.scraper(browser, selectedCategories[0].link, url);

  } catch (e) {
    console.log("Lỗi ở scrape controller: " + e);
  }
};


module.exports = scrapeController;
