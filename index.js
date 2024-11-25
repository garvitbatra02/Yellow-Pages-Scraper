const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    const locations = ['Victoria']; // Add other locations as needed
    const listings = ['Garden+Supplies']; // Add other listings as needed
    const pages=[21]
    const data = [['NameOfCompany', 'Address', 'PhoneNumber', 'email', 'website', 'pincode']];
    let cnt=0;
    for (const location of locations) {
        for (const listing of listings) {
            const pagelimit=pages[cnt];
            cnt++;
            const fileName = `${listing}_${location}.xlsx`;
            const wb = XLSX.utils.book_new();
            let pageNo = 1;
            let websiteLinks = [];

            while (pageNo <= pagelimit) { // Example: Scraping first 3 pages
                try {
                    await page.goto(`https://api.scraperapi.com/?api_key=38bab4a2891e7a673d853757642caa10&url=https://www.yellowpages.com.au/search/listings?clue=${listing}&locationClue=${location}&pageNumber=${pageNo}`, {
                        waitUntil: "domcontentloaded",
                    });

                    const grabParagraph = await page.evaluate(() => {
                        const pgTagElements = document.querySelectorAll(".Box__Div-sc-dws99b-0.iOfhmk.MuiPaper-root.MuiCard-root.PaidListing.MuiPaper-elevation1.MuiPaper-rounded");
                        const pgTagFreeElements = document.querySelectorAll(".Box__Div-sc-dws99b-0.iOfhmk.MuiPaper-root.MuiCard-root.FreeListing.MuiPaper-elevation1.MuiPaper-rounded");

                        let pagewebsites = [];
                        pgTagElements.forEach((element) => {
                            const website = element.querySelector(".MuiTypography-root.MuiLink-root.MuiLink-underlineNone.MuiTypography-colorPrimary").href;
                            pagewebsites.push(website);
                        });
                        pgTagFreeElements.forEach((element) => {
                            const website = element.querySelector(".MuiTypography-root.MuiLink-root.MuiLink-underlineNone.MuiTypography-colorPrimary").href;
                            pagewebsites.push(website);
                        });
                        return pagewebsites;
                    });

                    if (grabParagraph.length == 0) {
                        break;
                    }

                    grabParagraph.forEach((element) => {
                        console.log(element)
                        websiteLinks.push(element);
                    });

                    pageNo++;
                    // await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error('Error during scraping:', error);
                    break; // Exit the while loop if an error occurs
                }
            }

            for (let i = 0; i < websiteLinks.length; i++) {
                try {
                    const element = websiteLinks[i];
                    await page.goto('https://api.scraperapi.com/?api_key=38bab4a2891e7a673d853757642caa10&url=https://www.yellowpages.com.au/' + element.substring(26), {
                        waitUntil: "domcontentloaded",
                    });

                    const details = await page.evaluate(async () => {
                        const fans = {};
                        const name = document.querySelector(".listing-name");
                        fans.name = name ? name.innerText : "";

                        let finalAddress = "";
                        const address = document.querySelector(".listing-address.mappable-address");
                        finalAddress += address ? address.innerText : "";

                        const extraAddressButton = document.querySelector('li[data-name="additional-locations"][data-omniture-name="Additional Locations"]');
                        if (extraAddressButton) {
                            extraAddressButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }

                        const extraAddress = document.querySelectorAll(".cell.additional-location-name.first-cell > .listing-address.mappable-address");
                        extraAddress.forEach((element) => {
                            if (element) {
                                finalAddress += `   ${element.innerText}`;
                            }
                        });

                        fans.address = finalAddress;
                        fans.pincode = finalAddress.substring(finalAddress.length - 4);

                        const phone = document.querySelector(".click-to-call.contact.contact-preferred.contact-phone");
                        const phone2 = document.querySelector(".click-to-call.contact.contact-preferred.contact-mobile");

                        fans.phone = phone ? phone.href.substring(4) : (phone2 ? phone2.href.substring(4) : "");

                        const email = document.querySelector(".contact.contact-main.contact-email");
                        fans.email = email ? email.getAttribute('data-email') : "";

                        const website = document.querySelector(".contact.contact-main.contact-url");
                        fans.website = website ? website.href : "";

                        return fans;
                    });

                    console.log(details)
                    data.push([details.name, details.address, details.phone, details.email, details.website, details.pincode]);
                } catch (error) {
                    console.error('Error during scraping details:', error);
                }
            }

            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const excelFilePath = fileName;
            XLSX.writeFile(wb, excelFilePath);
            console.log(`Excel file "${excelFilePath}" created successfully.`);
        }
    }

    // await browser.close();
})();
