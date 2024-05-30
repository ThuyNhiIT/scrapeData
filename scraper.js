const scrapeCategory = (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            let page = await browser.newPage();
            console.log(">> Mở tab mới ...");
            await page.goto(url);
            console.log(">>Truy cập vào " + url);
            await page.waitForSelector("#webpage");
            console.log(">> Website đã laod xong...");

            const dataCategory = await page.$$eval(
                "#navbar-menu > ul > li",
                (els) => {
                    dataCategory = els.map((el) => {
                        return {
                            category: el.querySelector("a").innerText,
                            link: el.querySelector("a").href,
                        };
                    });
                    return dataCategory;
                }
            );
            await page.close();
            // console.log(dataCategory)
            console.log(">> Tab đã đóng.");
            resolve(dataCategory);
        } catch (error) {
            console.log("lỗi ở scrape category: " + error);
            reject(error);
        }
    });
const scraper = (browser, link, url) =>
    new Promise(async (resolve, reject) => {
        try {
            let newPage = await browser.newPage();
            console.log(">> Mở tab mới ...");
            await newPage.goto(link);
            console.log(">> Truy cập vào " + link);
            await newPage.waitForSelector("#main");
            console.log(">> Đã load xong main...");

            const scrapeData = {};

            // Lấy header
            const headerData = await newPage.$eval("header", (el) => {
                return {
                    title: el.querySelector("h1").innerText,
                    description: el.querySelector("p").innerText,
                };
            });
            // console.log(headerData);
            scrapeData.header = headerData;

            // Lấy thông tin chi tiết
            const detailLink = await newPage.$$eval('#left-col > section.section-post-listing > ul > li', (els) => {
                detailLink = els.map((el) => {
                    return el.querySelector('.post-meta > h3 > a').href
                })
                return detailLink;
            })
            // console.log(detailLink)



            const scrapeDetail = async (link) => new Promise(async (resolve, reject) => {
                try {
                    let pageDetail = await browser.newPage();
                    console.log(">> Mở tab mới ...");
                    await pageDetail.goto(link);
                    console.log(">> Truy cập vào " + link);
                    await pageDetail.waitForSelector("#main");
                    console.log(">> Đã load xong main...");


                    const detailData = {};
                    // Bắt đầu cạo
                    // Cạo ảnh
                    const images = await pageDetail.$$eval('#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide', (els) => {
                        const images = els.map(el => {
                            const img = el.querySelector('img');
                            return img ? img.src : null;
                        });
                        return images.filter(image => image !== null);
                    });
            
                    // console.log(images);
                    detailData.images = images;
                    
                    // Lấy header detail
                    const headerDetailData = await pageDetail.$eval('header.page-header', (el) => {
                        return {
                            title: el.querySelector('h1 > a').innerText,
                            start : el.querySelector('h1 > span').className.replace(/^\D+/g, ''),
                            class : {
                                content : el.querySelector('p').innerText,
                                classType : el.querySelector('p > a > strong').innerText,
                            },
                            address: el.querySelector('address').innerText,
                            attributes: {
                                price: el.querySelector('div.post-attributes >  .price > span').innerText,
                                acreage: el.querySelector('div.post-attributes >  .acreage > span').innerText,
                                published: el.querySelector('div.post-attributes >  .published > span').innerText,
                                hashtag: el.querySelector('div.post-attributes >  .hashtag > span').innerText,
                            }

                        }
                    }
                    )
                    console.log(headerDetailData);


                    await pageDetail.close();
                    console.log(">> Tab đã đóng." + link);
                    resolve();
                } catch (error) {
                    console.log("Lỗi ở scrape detail: " + error);
                }
            }
            )
            for (let link of detailLink) {
                await scrapeDetail(link);
            }


            await newPage.close();
            console.log(">> Trình duyệt đã đóng.");
            resolve();
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    scrapeCategory,
    scraper,
};
